import { useCallback, useEffect, useRef, useState } from "react";
import "../style/ProductImageViewer.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ProductImageViewer({
  images = [],
  initialIndex = 0,
  title = "Product image",
  onClose,
}) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastTap = useRef(0);
  const imageRef = useRef(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const changeImage = useCallback(
    (step) => {
      if (!images.length) return;

      setIndex((current) => (current + step + images.length) % images.length);
      resetZoom();
    },
    [images.length, resetZoom],
  );

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") changeImage(1);
      if (event.key === "ArrowLeft") changeImage(-1);
      if (event.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeImage, close, resetZoom]);

  const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  const getCenter = (a, b) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    event.currentTarget.setPointerCapture?.(event.pointerId);

    const points = [...pointers.current.values()];

    if (points.length === 2) {
      gesture.current = {
        type: "pinch",
        distance: getDistance(points[0], points[1]),
        center: getCenter(points[0], points[1]),
        scale,
        offset: { ...offset },
      };
    } else if (points.length === 1) {
      gesture.current = {
        type: "drag",
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        offset: { ...offset },
        startTime: Date.now(),
        moved: false,
      };
    }
  };

  const handlePointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const points = [...pointers.current.values()];
    const currentGesture = gesture.current;

    if (!currentGesture) return;

    if (points.length >= 2 && currentGesture.type === "pinch") {
      const distance = getDistance(points[0], points[1]);
      const center = getCenter(points[0], points[1]);

      const nextScale = clamp(
        currentGesture.scale *
          (distance / Math.max(currentGesture.distance, 1)),
        1,
        5,
      );

      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = center.x - rect.left - rect.width / 2;
      const centerY = center.y - rect.top - rect.height / 2;

      const ratio = nextScale / currentGesture.scale;

      setScale(nextScale);
      setOffset({
        x: centerX - (centerX - currentGesture.offset.x) * ratio,
        y: centerY - (centerY - currentGesture.offset.y) * ratio,
      });

      return;
    }

    if (points.length === 1 && currentGesture.type === "drag") {
      const dx = event.clientX - currentGesture.lastX;
      const dy = event.clientY - currentGesture.lastY;

      if (
        Math.abs(event.clientX - currentGesture.startX) > 5 ||
        Math.abs(event.clientY - currentGesture.startY) > 5
      ) {
        currentGesture.moved = true;
      }

      currentGesture.lastX = event.clientX;
      currentGesture.lastY = event.clientY;

      if (scale > 1) {
        setOffset((previous) => ({
          x: previous.x + dx,
          y: previous.y + dy,
        }));
      } else {
        setOffset({ x: 0, y: 0 });
      }
    }
  };

  const handlePointerUp = (event) => {
    const currentGesture = gesture.current;
    const pointsBeforeRemoval = [...pointers.current.values()];

    if (
      currentGesture?.type === "drag" &&
      scale === 1 &&
      currentGesture.moved &&
      pointsBeforeRemoval.length === 1
    ) {
      const dx = event.clientX - currentGesture.startX;
      const dy = event.clientY - currentGesture.startY;

      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        changeImage(dx < 0 ? 1 : -1);
      }
    }

    pointers.current.delete(event.pointerId);

    const remaining = [...pointers.current.values()];

    if (remaining.length === 1) {
      const point = remaining[0];
      gesture.current = {
        type: "drag",
        startX: point.x,
        startY: point.y,
        lastX: point.x,
        lastY: point.y,
        offset: { ...offset },
        startTime: Date.now(),
        moved: false,
      };
    } else {
      gesture.current = null;
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();

    const nextScale = clamp(scale + (event.deltaY < 0 ? 0.25 : -0.25), 1, 5);

    setScale(nextScale);

    if (nextScale === 1) {
      setOffset({ x: 0, y: 0 });
    }
  };

  if (!images.length) return null;

  return (
    <div
      className="piv-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
      onClick={close}
    >
      <button
        type="button"
        className="piv-close"
        onClick={close}
        aria-label="Close image viewer"
      >
        ×
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="piv-arrow piv-prev"
          onClick={(event) => {
            event.stopPropagation();
            changeImage(-1);
          }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <div
        className={`piv-stage ${scale > 1 ? "piv-zoomed" : ""}`}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <img
          ref={imageRef}
          className="piv-image"
          src={images[index]}
          alt={`${title} image ${index + 1}`}
          draggable="false"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        />
      </div>

      {images.length > 1 && (
        <button
          type="button"
          className="piv-arrow piv-next"
          onClick={(event) => {
            event.stopPropagation();
            changeImage(1);
          }}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      <div className="piv-counter">
        {index + 1} / {images.length}
      </div>

      <div className="piv-hint">
        Pinch to zoom · Swipe to change image · Double-click to zoom
      </div>
    </div>
  );
}
