import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import "../style/ReviewPhotoViewer.css";

const getReviewImages = (review) => {
  if (Array.isArray(review?.images)) {
    return review.images
      .map((image) => (typeof image === "string" ? image : image?.url))
      .filter(Boolean);
  }

  const singleImage = review?.image;
  if (singleImage) {
    return [typeof singleImage === "string" ? singleImage : singleImage?.url].filter(Boolean);
  }

  return [];
};

const getReviewDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ReviewPhotoViewer({
  reviews = [],
  initialReviewIndex = 0,
  onClose,
}) {
  const items = useMemo(
    () =>
      reviews.flatMap((review, reviewIndex) =>
        getReviewImages(review).map((url, imageIndex) => ({
          url,
          review,
          reviewIndex,
          imageIndex,
        }))
      ),
    [reviews]
  );

  const initialItemIndex = Math.max(
    0,
    items.findIndex((item) => item.reviewIndex === initialReviewIndex)
  );

  const [activeIndex, setActiveIndex] = useState(initialItemIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const pinchStart = useRef(null);
  const touchStart = useRef(null);

  const activeItem = items[activeIndex];
  const activeReview = activeItem?.review;

  const changeImage = (step) => {
    if (items.length <= 1) return;

    setActiveIndex((current) => (current + step + items.length) % items.length);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    pointers.current.clear();
    gesture.current = null;
    pinchStart.current = null;
  };

  const closeViewer = () => {
    onClose?.();
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") changeImage(-1);
      if (event.key === "ArrowRight") changeImage(1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length]);

  const distanceBetweenPointers = () => {
    const points = [...pointers.current.values()];
    if (points.length < 2) return 0;

    return Math.hypot(
      points[0].x - points[1].x,
      points[0].y - points[1].y
    );
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size === 2) {
      pinchStart.current = {
        distance: distanceBetweenPointers(),
        scale,
        offset: { ...offset },
      };
      gesture.current = null;
      return;
    }

    gesture.current = {
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startOffset: { ...offset },
      startTime: Date.now(),
      moved: false,
    };
  };

  const handlePointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const distance = distanceBetweenPointers();
      if (!pinchStart.current.distance) return;

      const nextScale = Math.min(
        5,
        Math.max(
          1,
          pinchStart.current.scale *
            (distance / pinchStart.current.distance)
        )
      );

      setScale(nextScale);

      if (nextScale === 1) {
        setOffset({ x: 0, y: 0 });
      }

      return;
    }

    const currentGesture = gesture.current;
    if (!currentGesture) return;

    const dx = event.clientX - currentGesture.startX;
    const dy = event.clientY - currentGesture.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      currentGesture.moved = true;
    }

    if (scale > 1) {
      setOffset({
        x: currentGesture.startOffset.x + dx,
        y: currentGesture.startOffset.y + dy,
      });
    }

    currentGesture.lastX = event.clientX;
    currentGesture.lastY = event.clientY;
  };

  const handlePointerUp = (event) => {
    const currentGesture = gesture.current;

    if (
      currentGesture &&
      pointers.current.size === 1 &&
      scale === 1
    ) {
      const dx = event.clientX - currentGesture.startX;
      const dy = event.clientY - currentGesture.startY;

      if (
        Math.abs(dx) > 55 &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        changeImage(dx < 0 ? 1 : -1);
      }
    }

    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) {
      pinchStart.current = null;
    }

    if (pointers.current.size === 0) {
      gesture.current = null;
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();

    setScale((current) => {
      const next = Math.min(
        5,
        Math.max(1, current + (event.deltaY < 0 ? 0.25 : -0.25))
      );

      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  if (!activeItem) return null;

  const reviewerName =
    activeReview?.user?.name ||
    activeReview?.user?.username ||
    activeReview?.userName ||
    activeReview?.name ||
    "Customer";

  const rating = Math.max(
    0,
    Math.min(5, Number(activeReview?.rating) || 0)
  );

  const comment = activeReview?.comment || activeReview?.review || "";

  return (
    <div
      className="review-photo-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Customer review photo"
      onClick={closeViewer}
    >
      <button
        type="button"
        className="review-photo-close"
        onClick={closeViewer}
        aria-label="Close image viewer"
      >
        <X size={26} />
      </button>

      <div
        className="review-photo-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="review-photo-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <img
            key={activeItem.url}
            className="review-photo-full-image"
            src={activeItem.url}
            alt={`Review photo by ${reviewerName}`}
            draggable={false}
            onDoubleClick={handleDoubleClick}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            }}
          />

          {items.length > 1 && (
            <>
              <button
                type="button"
                className="review-photo-arrow review-photo-prev"
                onClick={() => changeImage(-1)}
                aria-label="Previous review photo"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                type="button"
                className="review-photo-arrow review-photo-next"
                onClick={() => changeImage(1)}
                aria-label="Next review photo"
              >
                <ChevronRight size={30} />
              </button>

              <span className="review-photo-counter">
                {activeIndex + 1} / {items.length}
              </span>
            </>
          )}
        </div>

        <aside className="review-photo-details">
          <div className="review-photo-customer">
            <div className="review-photo-avatar">
              {reviewerName.charAt(0).toUpperCase()}
            </div>

            <div className="review-photo-customer-info">
              <strong>{reviewerName}</strong>
              <span>{getReviewDate(activeReview?.createdAt)}</span>
            </div>
          </div>

          <div className="review-photo-rating" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={19}
                fill={index < rating ? "currentColor" : "none"}
              />
            ))}
            <strong>{rating}.0</strong>
          </div>

          <h3 className="review-photo-heading">Customer review</h3>

          <p className="review-photo-comment">
            {comment || "No written comment for this review."}
          </p>

          {items.length > 1 && (
            <p className="review-photo-hint">
              Photo {activeItem.imageIndex + 1} of this review
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
