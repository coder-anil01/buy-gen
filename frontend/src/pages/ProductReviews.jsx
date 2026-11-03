import { useState } from "react";
import "../style/ProductReviews.css";
// import cloudinaryImagesUploads from "../utils/cloudinaryImagesUploads";
import cloudinaryImagesUploads from "../components/cloudinaryImagesUploads";

const ProductReviews = ({ productId, userId, token, sendData}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewModel, setReviewModel] = useState(true);


  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = 5 - images.length;
    const allowedFiles = selectedFiles.slice(0, remainingSlots);

    const validFiles = allowedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select valid image files only.");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be smaller than 5 MB.");
        return false;
      }

      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);
    setSuccess("");
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!productId || !userId) {
      setError("Product or user information is missing.");
      return;
    }

    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setLoading(true);

      let uploadedImages = [];

      if (images.length > 0) {
        uploadedImages = await cloudinaryImagesUploads(images);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/review/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            product: productId,
            user: userId,
            rating,
            title: title.trim(),
            comment: comment.trim(),
            images: uploadedImages,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setSuccess(data.message || "Your review has been submitted!");
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setComment("");
      setImages([]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="review-form-container">
      <div className="review-form-header">
        <h2>Write a Review</h2>
        <p>Share your experience with this product.</p>
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-rating-field">
          <label>Your Rating <span>*</span></label>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`review-star ${
                  star <= (hoverRating || rating) ? "active" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating === star}
              >
                ★
              </button>
            ))}

            <span className="review-rating-text">
              {rating ? `${rating}/5` : "Select rating"}
            </span>
          </div>
        </div>

        <div className="review-field">
          <label htmlFor="review-title">Review Title</label>
          <input
            id="review-title"
            type="text"
            placeholder="Summarize your experience"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="review-field">
          <label htmlFor="review-comment">
            Your Review <span>*</span>
          </label>
          <textarea
            id="review-comment"
            placeholder="What did you like or dislike about this product?"
            rows={5}
            maxLength={2000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="review-character-count">
            {comment.length}/2000
          </div>
        </div>

        <div className="review-field">
          <label>Add Product Photos (Optional)</label>
          <p className="review-upload-hint">
            Upload up to 5 images. Maximum 5 MB per image.
          </p>

          <div className="review-image-grid">
            {images.map((file, index) => (
              <div className="review-image-preview" key={`${file.name}-${index}`}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Review preview ${index + 1}`}
                />
                <button
                  type="button"
                  className="review-remove-image"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="review-upload-box">
                <span>＋</span>
                <small>Add Photo</small>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {error && <p className="review-message error">{error}</p>}
        {success && <p className="review-message success">{success}</p>}

        <button
          type="submit"
          className="review-submit-btn"
          disabled={loading}
        >
          {loading ? "Submitting Review..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
};

export default ProductReviews;