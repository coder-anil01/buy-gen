
import { useState } from "react";
import "../style/OptimizedImage.css";

function OptimizedImage({
  src,
  alt = "Product image",
  className = "",
  priority = false,
  aspectRatio = "1 / 1",
  objectFit = "contain",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`optimized-image ${className}`}
      style={{ aspectRatio }}
    >
      {!loaded && !error && (
        <div className="image-placeholder" />
      )}

      {error ? (
        <div className="image-error">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={loaded ? "image-loaded" : "image-hidden"}
          style={{ objectFit }}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
