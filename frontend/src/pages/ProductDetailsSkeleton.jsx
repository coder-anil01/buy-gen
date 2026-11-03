import "../style/ProductDetails.css";



const ProductDetailsSkeleton = () => {
  return (
    <main className="pds">
      <div className="pds-container">
         <div className="pds-line pds-comment" />
        {/* Product image + information */}
        <section className="pds-main">
          {/* Gallery */}
          <div className="pds-gallery">
            <div className="pds-thumbnails">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="pds-thumb pds-skeleton" key={item} />
              ))}
            </div>

            <div className="pds-main-image pds-skeleton">
              {/* <div className="pds-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <path
                    d="m21 15-5-5L5 21"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </div> */}

              <div className="pds-image-counter pds-skeleton" />
            </div>
          </div>

          {/* Product information */}
          <div className="pds-info">
            <div className="pds-line pds-brand" />
            <div className="pds-line pds-title" />
            <div className="pds-line pds-title pds-title-short" />

            <div className="pds-rating">
              <div className="pds-rating-pill pds-skeleton" />
              <div className="pds-line pds-rating-stars" />
              <div className="pds-line pds-review-count" />
            </div>

            <div className="pds-price">
              <div className="pds-line pds-price-main" />
              <div className="pds-line pds-price-old" />
              <div className="pds-discount pds-skeleton" />
            </div>

            <div className="pds-line pds-tax" />

            {/* Benefits */}
            <div className="pds-benefits">
              {[1, 2, 3].map((item) => (
                <div className="pds-benefit" key={item}>
                  <div className="pds-benefit-icon pds-skeleton" />
                  <div className="pds-benefit-text">
                    <div className="pds-line pds-benefit-title" />
                    <div className="pds-line pds-benefit-subtitle" />
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase buttons */}
            <div className="pds-actions">
              <div className="pds-action-button pds-skeleton" />
              <div className="pds-action-button pds-skeleton" />
            </div>
          </div>
        </section>

        {/* Product highlights */}
        <section className="pds-details-section">
          <div className="pds-accordion">
            <div className="pds-accordion-heading">
              <div className="pds-line pds-heading-line" />
              <div className="pds-chevron" />
            </div>

            <div className="pds-specifications">
              {[1, 2, 3, 4].map((item) => (
                <div className="pds-spec-row" key={item}>
                  <div className="pds-line pds-spec-label" />
                  <div className="pds-line pds-spec-value" />
                </div>
              ))}
            </div>
          </div>

          <div className="pds-accordion">
            <div className="pds-accordion-heading">
              <div className="pds-line pds-heading-line" />
              <div className="pds-chevron" />
            </div>
          </div>

          <div className="pds-accordion">
            <div className="pds-accordion-heading">
              <div className="pds-line pds-heading-line" />
              <div className="pds-chevron" />
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="pds-reviews">
          <div className="pds-line pds-reviews-heading" />

          <div className="pds-rating-layout">
            <div className="pds-overall-rating">
              <div className="pds-line pds-big-rating" />
              <div className="pds-line pds-rating-stars" />
              <div className="pds-line pds-rating-caption" />
            </div>

            <div className="pds-rating-bars">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="pds-rating-bar" key={item}>
                  <div className="pds-line pds-star-label" />
                  <div className="pds-bar-track">
                    <div
                      className="pds-bar-fill pds-skeleton"
                      style={{ width: `${item * 13}%` }}
                    />
                  </div>
                  <div className="pds-line pds-percent" />
                </div>
              ))}
            </div>
          </div>

          {/* Review photos */}
          <div className="pds-line pds-photo-heading" />

          <div className="pds-review-photos">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div className="pds-review-photo pds-skeleton" key={item} />
            ))}
          </div>

          {/* Review cards */}
          <div className="pds-review-list">
            {[1, 2].map((item) => (
              <article className="pds-review-card" key={item}>
                <div className="pds-review-user">
                  <div className="pds-avatar pds-skeleton" />

                  <div className="pds-user-info">
                    <div className="pds-line pds-user-name" />
                    <div className="pds-line pds-user-date" />
                  </div>
                </div>

                <div className="pds-line pds-review-stars" />
                    <div className="pds-line pds-comment" />
                    <div className="pds-line pds-comment pds-comment-short" />
                <div className="pds-review-images">
                  {[1, 2, 3].map((photo) => (
                    <div
                      className="pds-review-image pds-skeleton"
                      key={photo}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile fixed purchase bar */}
      <div className="pds-mobile-bar">
        {/* <div className="pds-line pds-mobile-price" /> */}
        <div className="pds-mobile-button pds-skeleton" />
        <div className="pds-mobile-button pds-skeleton" />
      </div>
    </main>
  );
};

export default ProductDetailsSkeleton;