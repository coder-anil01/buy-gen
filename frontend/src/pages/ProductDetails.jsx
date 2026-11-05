import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../context/auth";
import ProductImageViewer from "../components/ProductImageViewer";
import "../style/ProductDetails.css";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import optimizeImage from "../utils/optimizeImage";
import { Helmet } from "react-helmet-async";

const apiDomain = import.meta.env.VITE_API_URL || "";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [totalReviews, settotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auth, setAuth] = useAuth();
  const [selectedReviewPhoto, setSelectedReviewPhoto] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  // EXP
  const [isProductImageViewerOpen, setIsProductImageViewerOpen] =
    useState(false);
  const mainImageTouchStart = useRef(null);

  const goToProductImage = (step) => {
    if (images.length <= 1) return;

    setSelectedImage(
      (current) => (current + step + images.length) % images.length,
    );
  };

  const handleMainImageTouchStart = (event) => {
    const touch = event.touches[0];

    mainImageTouchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleMainImageTouchEnd = (event) => {
    if (!mainImageTouchStart.current || images.length <= 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - mainImageTouchStart.current.x;
    const deltaY = touch.clientY - mainImageTouchStart.current.y;

    mainImageTouchStart.current = null;

    // Horizontal swipe only; ignore vertical scrolling.
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      goToProductImage(deltaX < 0 ? 1 : -1);
    }
  };
  // EXP

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(
          `${apiDomain}/api/v1/product/get/${id}`,
        );
        setProduct(data?.product);
        setReviews(data?.reviews);
        settotalReviews(data?.totalReviews);
        setAverageRating(data?.averageRating);
        setRatingBreakdown(data?.ratingBreakdown);
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.response?.data?.message || "Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const reloade = () => {
      setIsWishlisted(
        auth?.wishlist?.some((item) => item._id === product?._id) || false,
      );
    };
    reloade();
  }, [auth?.wishlist, product?._id]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="product-details-status">
        <h1>Product not found</h1>
        <p>{error || "This product is not available."}</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  // Supports your existing product.images[0].url schema.
  const images = (
    Array.isArray(product.images) && product.images.length ? product.images : []
  )
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);

  const reviewPhotoItems = (reviews || []).flatMap((review) =>
    (review.images || [])
      .map((image, imageIndex) => ({
        src: typeof image === "string" ? image : image?.url,
        review,
        imageIndex,
      }))
      .filter((item) => item.src),
  );

  const price = Number(product?.price ?? 0);
  const originalPrice = Number(product?.compareAtPrice ?? 0);
  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  const offer = `Buy${product?.bogoOffers[0]?.buyQuantity}Get${product?.bogoOffers[0]?.getQuantity}`;
  const productTitle = product?.title;
  const ratingValue = Math.min(5, Math.max(0, averageRating));

  // Add to Wishlist

  const handleWishlist = () => {
    const wishlist = auth?.wishlist || [];
    const existingProduct = wishlist.some((item) => item._id === product._id);

    const updatedAuth = {
      ...auth,
      wishlist: existingProduct
        ? wishlist.filter((item) => item._id !== product._id)
        : [...wishlist, { ...product }],
    };

    setAuth(updatedAuth);
    localStorage.setItem("auth", JSON.stringify(updatedAuth));
    setIsWishlisted(!existingProduct);
  };

  // Add to Cart
  const handleAddToCart = () => {
    const cart = auth?.cart || [];
    const existingProduct = cart.find((item) => item._id === product._id);

    const updatedAuth = {
      ...auth,
      cart: existingProduct
        ? cart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item,
          )
        : [...cart, { ...product, quantity: 1 }],
    };
    setAuth(updatedAuth);
    localStorage.setItem("auth", JSON.stringify(updatedAuth));
    navigate("/cart", { state: { product } });
  };

  const handleBuyNow = () => {
    // Change this route if your BuyNow page uses a different path.
    navigate(`/buy/${product?._id}`, { state: { product } });
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Helmet>
        <title>{product?.title ? `${product.title} | BuyGen` : "BuyGen - Online Shopping"}</title>
        <meta name="description" content={ product?.shortDescription ? product?.shortDescription : "Buy products online at BuyGen" } />
        <meta property="og:title" content={ product?.title ? `${product.title} | BuyGen` : "BuyGen - Online Shopping" } />
        <meta
          property="og:description"
          content={product?.shortDescription ? product?.shortDescription : "Buy products online at BuyGen"}
        />
        <meta
          property="og:image" content={ product?.images?.[0]?.url ? product?.images?.[0]?.url :
            "https://res.cloudinary.com/pbykkmdq/image/upload/f_auto,q_auto,w_100,c_limit/v1791045756/hqcsiqqd8jnnfpjceniz.png"
          }
        />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="product-details-page">
        <div className="product-details-container">
          <div className="product-details-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span>›</span>
            <span>
              {product?.subCategory
                ? product?.subCategory?.name
                : product?.category?.name || "Products"}
            </span>
            <span>›</span>
            <span className="product-details-breadcrumb-current">
              {/* {productTitle} */}
              {product?.slug}
            </span>
          </div>

          <section className="product-details-main">
            {/* Product images */}
            <div className="product-details-gallery">
              <div className="product-details-thumbnails">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={`product-details-thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <OptimizedImage
                      className="product-details-thumbnail-image"
                      src={optimizeImage(image, 100)}
                      alt={`${productTitle} ${index + 1}`}
                      priority={false}
                      draggable="false"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>

              <div className="product-details-image-box">
                <button
                  type="button"
                  className={`product-details-wishlist ${
                    isWishlisted ? "active" : ""
                  }`}
                  onClick={handleWishlist}
                  aria-label="Toggle wishlist"
                >
                  {/* {isWishlisted ? "❤️" : "♡"} */}
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>

                {product?.bogoOffers[0] && (
                  <span className="product-details-sale-badge">{offer}</span>
                )}

                {images.length > 0 ? (
                  <>
                    <img
                      className="product-details-main-image"
                      src={images[selectedImage] || images[0]}
                      alt={productTitle}
                      onClick={() => setIsProductImageViewerOpen(true)}
                      onTouchStart={handleMainImageTouchStart}
                      onTouchEnd={handleMainImageTouchEnd}
                      draggable={false}
                      style={{ cursor: "zoom-in" }}
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="product-details-slider-arrow product-details-slider-prev"
                          onClick={() => goToProductImage(-1)}
                          aria-label="Previous product image"
                        >
                          ‹
                        </button>

                        <button
                          type="button"
                          className="product-details-slider-arrow product-details-slider-next"
                          onClick={() => goToProductImage(1)}
                          aria-label="Next product image"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="product-details-no-image">
                    No image available
                  </div>
                )}

                {images.length > 1 && (
                  <span className="product-details-image-count">
                    {selectedImage + 1}/{images.length}
                  </span>
                )}

                {images.length > 1 && (
                  <span className="product-details-image-count">
                    {selectedImage + 1}/{images.length}
                  </span>
                )}
              </div>
            </div>

            {/* Product information */}
            <div className="product-details-info">
              {product.brand && (
                <span className="product-details-brand">
                  {typeof product.brand === "object"
                    ? product.brand.name
                    : product.brand}
                </span>
              )}

              <h1>{productTitle}</h1>

              {product.shortDescription &&
                !Array.isArray(product.shortDescription) && (
                  <p className="product-details-subtitle">
                    {product.shortDescription}
                  </p>
                )}

              {product?.totalReviews > 0 && (
                <button
                  type="button"
                  className="product-details-rating-summary"
                  onClick={() =>
                    document
                      .getElementById("product-reviews")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="product-details-rating-pill">
                    {ratingValue.toFixed(1)} ★
                  </span>
                  <span className="product-details-stars">★★★★★</span>
                  <span>({totalReviews}) Reviews ›</span>
                </button>
              )}

              <div className="product-details-price-row">
                <strong>₹{price.toLocaleString("en-IN")}</strong>

                {originalPrice > price && (
                  <>
                    <del>₹{originalPrice.toLocaleString("en-IN")}</del>
                    <span className="product-details-discount">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="product-details-tax-note">Inclusive of all taxes</p>

              <div className="product-details-benefits">
                <div>
                  <span>↩️</span>
                  <section>
                    <strong>7 Days Return</strong>
                    <small>Easy return policy</small>
                  </section>
                </div>

                <div>
                  <span>💵</span>
                  <section>
                    <strong>Cash on Delivery</strong>
                    <small>Pay at your doorstep</small>
                  </section>
                </div>

                <div>
                  <span>🚚</span>
                  <section>
                    <strong>Free Shipping</strong>
                    <small>On eligible orders</small>
                  </section>
                </div>
              </div>

              <div className="product-details-purchase-buttons">
                <button type="button" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
                <button type="button" onClick={handleBuyNow}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          </section>

          {/*  Product Details */}
          <section>
            <div className="pd-summary">
              {product?.specifications.length > 0 && (
                <details open>
                  <summary>
                    Product Highlites
                    <ChevronDown size={18} />
                  </summary>
                  <div className="pd-details">
                    {product.specifications.slice(0, 6).map((index) => (
                      <div className="pd-details-item" key={index}>
                        <span>{index.name} </span>
                        <p>{index.value}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {product.shortDescription.length > 0 && (
                <details open>
                  <summary>
                    More Information <ChevronDown size={18} />
                  </summary>
                  {product.shortDescription.map((benefit, index) => (
                    <div className="pd-benefit" key={index}>
                      <div className="benefit-icon">
                        <span>✓</span>
                        <span>{benefit}</span>
                      </div>
                    </div>
                  ))}
                </details>
              )}

              {product.description && (
                <details className="pd-summary">
                  <summary>
                    Product Description <ChevronDown size={18} />
                  </summary>
                  <p>{product.description}</p>
                </details>
              )}
            </div>
          </section>

          {/* Customer reviews */}
          {totalReviews > 0 && (
            <section className="product-details-reviews" id="product-reviews">
              <h2>Customer Ratings &amp; Reviews</h2>

              <div className="product-details-rating-layout">
                <div className="product-details-rating-overall">
                  <strong>{ratingValue.toFixed(1)}</strong>
                  <span className="product-details-stars">★★★★★</span>
                  <small>({totalReviews} reviews)</small>
                </div>

                <div className="product-details-rating-bars">
                  {ratingBreakdown.map((item) => (
                    <div
                      className="product-details-rating-bar-row"
                      key={item.star}
                    >
                      <span>{item.star} ★</span>
                      <div className="product-details-rating-track">
                        <span style={{ width: `${item.percentage}%` }} />
                      </div>
                      <small>{Math.round(item.percentage)}%</small>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="product-details-review-photo-card">
                <h2>Product Review Images</h2>

                <div className="product-details-review-photo-grid">
                  {reviewPhotoItems.slice(0, 8).map((item, index) => (
                    <button
                      type="button"
                      className={`review-photo-button ${
                        index === 7 && reviewPhotoItems.length > 8
                          ? "review-photo-more"
                          : ""
                      }`}
                      key={`${item.review._id || "review"}-${item.imageIndex}`}
                      onClick={() => setSelectedReviewPhoto(index)}
                    >
                      <OptimizedImage
                        src={optimizeImage(item?.src, 100)}
                        alt={"Customer review"}
                        priority={false}
                        objectFit="cover"
                      />

                      {index === 7 && reviewPhotoItems.length > 8 && (
                        <span className="review-photo-overlay">
                          +{reviewPhotoItems.length - 8}
                        </span>
                      )}
                    </button>
                  ))}

                  {!reviewPhotoItems.length && (
                    <p>Customer photos will appear here.</p>
                  )}
                </div>
              </aside>

              <div className="product-details-review-list">
                {reviews?.length > 0 ? (
                  reviews.map((review, index) => (
                    <article
                      className="product-details-review-card"
                      key={index}
                    >
                      <div className="product-details-review-top">
                        <div className="product-details-review-avatar">
                          {review.user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{review.user?.name || "Customer"}</strong>
                          <small>
                            Posted {formatDate(review.createdAt || review.date)}
                          </small>
                        </div>
                      </div>

                      <div className="product-details-review-stars">
                        {"★".repeat(
                          Math.min(5, Math.max(0, Number(review.rating) || 0)),
                        )}
                        <span>
                          {"☆".repeat(
                            5 -
                              Math.min(
                                5,
                                Math.max(0, Number(review.rating) || 0),
                              ),
                          )}
                        </span>
                      </div>
                      {review.comment &&
                        (() => {
                          const words = review.comment.trim().split(/\s+/);
                          const isLong = words.length > 25;
                          const isExpanded = expandedReviews[review._id];

                          return (
                            <p className="review-comment">
                              {isLong && !isExpanded
                                ? words.slice(0, 25).join(" ") + "..."
                                : review.comment}
                              {isLong && (
                                <button
                                  type="button"
                                  className="review-more-btn"
                                  onClick={() =>
                                    setExpandedReviews((prev) => ({
                                      ...prev,
                                      [review._id]: !prev[review._id],
                                    }))
                                  }
                                >
                                  {isExpanded ? " less" : "more"}
                                </button>
                              )}
                            </p>
                          );
                        })()}

                      {review.images?.length > 0 && (
                        <div className="product-details-review-images">
                          {review.images.map((image, imageIndex) => {
                            const src =
                              typeof image === "string" ? image : image?.url;

                            const photoIndex = reviewPhotoItems.findIndex(
                              (item) =>
                                item.review === review &&
                                item.imageIndex === imageIndex,
                            );

                            if (!src) return null;

                            return (
                              <button
                                type="button"
                                className="review-photo-button"
                                key={imageIndex}
                                onClick={() =>
                                  setSelectedReviewPhoto(photoIndex)
                                }
                              >
                                <OptimizedImage
                                  src={optimizeImage(src, 100)}
                                  alt={"Customer review"}
                                  priority={false}
                                  objectFit="cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="product-details-no-reviews">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Fixed mobile purchase bar */}
        <div className="product-details-mobile-bar">
          <button type="button" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/buy/${product._id}`, { state: { product } })
            }
          >
            ⚡ Buy Now →
          </button>
        </div>
      </div>
      {/* POPUP REVIEW */}
      {selectedReviewPhoto !== null &&
        reviewPhotoItems[selectedReviewPhoto] && (
          <div
            className="review-image-modal-overlay"
            onClick={() => setSelectedReviewPhoto(null)}
          >
            <div
              className="review-image-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="review-modal-close"
                onClick={() => setSelectedReviewPhoto(null)}
                aria-label="Close image"
              >
                ×
              </button>

              <div className="review-modal-image-area">
                {reviewPhotoItems.length > 1 && (
                  <small className="review-modal-count">
                    {selectedReviewPhoto + 1}/{reviewPhotoItems.length}
                  </small>
                )}

                {reviewPhotoItems.length > 1 && (
                  <button
                    type="button"
                    className="review-modal-arrow review-modal-prev"
                    onClick={() =>
                      setSelectedReviewPhoto(
                        (selectedReviewPhoto - 1 + reviewPhotoItems.length) %
                          reviewPhotoItems.length,
                      )
                    }
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                )}

                <img
                  src={reviewPhotoItems[selectedReviewPhoto].src}
                  alt="Customer review"
                  className="review-modal-main-image"
                />

                {reviewPhotoItems.length > 1 && (
                  <button
                    type="button"
                    className="review-modal-arrow review-modal-next"
                    onClick={() =>
                      setSelectedReviewPhoto(
                        (selectedReviewPhoto + 1) % reviewPhotoItems.length,
                      )
                    }
                    aria-label="Next image"
                  >
                    ›
                  </button>
                )}
              </div>

              <div className="review-modal-details">
                <div className="review-modal-customer">
                  <div className="review-modal-avatar">
                    {(
                      reviewPhotoItems[selectedReviewPhoto].review.user?.name ||
                      "C"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {reviewPhotoItems[selectedReviewPhoto].review.user
                        ?.name || "Customer"}
                    </strong>

                    <small>
                      Posted{" "}
                      {formatDate(
                        reviewPhotoItems[selectedReviewPhoto].review
                          .createdAt ||
                          reviewPhotoItems[selectedReviewPhoto].review.date,
                      )}
                    </small>
                  </div>
                </div>

                <div className="review-modal-rating">
                  {"★".repeat(
                    Math.min(
                      5,
                      Math.max(
                        0,
                        Number(
                          reviewPhotoItems[selectedReviewPhoto].review.rating,
                        ) || 0,
                      ),
                    ),
                  )}
                  <span>
                    {"☆".repeat(
                      5 -
                        Math.min(
                          5,
                          Math.max(
                            0,
                            Number(
                              reviewPhotoItems[selectedReviewPhoto].review
                                .rating,
                            ) || 0,
                          ),
                        ),
                    )}
                  </span>
                </div>

                {reviewPhotoItems[selectedReviewPhoto].review.title && (
                  <h3>{reviewPhotoItems[selectedReviewPhoto].review.title}</h3>
                )}

                <p className="review-modal-comment">
                  {reviewPhotoItems[selectedReviewPhoto].review.comment ||
                    "No comment added."}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* {POPUP PRODUCT IMAGES} */}
      {isProductImageViewerOpen && images.length > 0 && (
        <ProductImageViewer
          images={images}
          initialIndex={selectedImage}
          title={productTitle}
          onClose={() => setIsProductImageViewerOpen(false)}
        />
      )}
    </>
  );
};

export default ProductDetails;
