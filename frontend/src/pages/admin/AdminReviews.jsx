import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaStar, FaTrash, FaSearch, FaRegImage } from "react-icons/fa";
import "../../style/AdminReviews.css";
import AdminMenu from "./AdminMenu";

const apiDomain = import.meta.env.VITE_API_URL;

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");

  // Get all reviews
  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.get(`${apiDomain}/api/v1/review/get`);

        if (response.data.success) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, []);

  // Delete review
  const deleteReview = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${apiDomain}/api/v1/review/admindeletereview/${id}`,);

      if (data.success) {
        setReviews((prev) => prev.filter((review) => review._id !== id));
      };
    } catch (error) {
      console.log(error);
      alert("Unable to delete review");
    }
  };

  // Search and rating filter
  const filteredReviews = reviews.filter((review) => {
    const productName = review.product?.title || "";
    const userName = review.user?.name || "";

    const matchSearch =
      productName.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      (review.comment || "").toLowerCase().includes(search.toLowerCase());

    const matchRating =
      rating === "all" || Number(review.rating) === Number(rating);

    return matchSearch && matchRating;
  });

  // Rating stars
  const renderStars = (value) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar key={star} className={star <= value ? "active" : ""} />
        ))}
      </div>
    );
  };

  return (
    <>
      <AdminMenu />
      <div className="admin-dashbord-layout">
        {/* ================= CONTENT ================= */}

        <div className="admin-reviews">
          <div className="reviews-header">
            <div>
              <h2>Reviews Management</h2>
              <p>Manage customer product reviews</p>
            </div>

            <div className="reviews-total">
              Total Reviews: <strong>{reviews.length}</strong>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="reviews-toolbar">
            <div className="reviews-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search product, customer or review..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="reviews-table-wrapper">
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Images</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="reviews-empty">
                      Loading reviews...
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="reviews-empty">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review._id}>
                      {/* Customer */}
                      <td>
                        <div className="review-customer">
                          <span className="customer-avatar">
                            {(review.user?.name || "U").charAt(0).toUpperCase()}
                          </span>

                          <span>{review.user?.name || "Unknown"}</span>
                        </div>
                      </td>

                      {/* Product */}
                      <td>
                        <Link
                          to={`/product/${review.product?._id}`}
                          className="review-product"
                        >
                          <img
                            src={
                              review.product?.images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt=""
                          />

                          <span>
                            {review.product?.title || "Product deleted"}
                          </span>
                        </Link>
                      </td>

                      {/* Rating */}
                      <td>
                        {renderStars(Number(review.rating || 0))}
                        <small>{review.rating}/5</small>
                      </td>

                      {/* Comment */}
                      <td>
                        <p className="review-comment">
                          {review.comment || "No comment"}
                        </p>
                      </td>

                      {/* Review Images */}
                      <td>
                        {review.images?.length > 0 ? (
                          <div className="review-images">
                            {review.images.slice(0, 2).map((image, index) => (
                              <img key={index} src={image.url} alt="Review" />
                            ))}

                            {review.images.length > 2 && (
                              <span>+{review.images.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <FaRegImage className="no-review-image" />
                        )}
                      </td>

                      {/* Date */}
                      <td>
                        {new Date(review.createdAt).toLocaleDateString("en-IN")}
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          className="review-delete-btn"
                          onClick={() => deleteReview(review._id)}
                          title="Delete Review"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="reviews-footer">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminReviews;
