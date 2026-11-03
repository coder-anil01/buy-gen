import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/OrderSuccessModal.css";

function OrderSuccessModal({
  isOpen,
  onClose,
  orderId,
  estimatedDelivery = "5 business days",
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleViewOrders = () => {
    onClose?.();
    navigate("/dashbord/order");
  };

  const handleContinueShopping = () => {
    onClose?.();
    navigate("/");
  };

  return (
    <div
      className="bg-order-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="bg-order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bg-order-title"
      >
        {/* <button
          type="button"
          className="bg-order-close"
          onClick={onClose}
          aria-label="Close order confirmation"
        >
          &times;
        </button> */}

        <div className="bg-order-confetti" aria-hidden="true">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>
        </div>

        <div className="bg-order-success-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5L9.5 17L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="bg-order-eyebrow">ORDER PLACED SUCCESSFULLY</span>

        <h2 id="bg-order-title">Order Confirmed!</h2>

        <p className="bg-order-message">
          Thank you for shopping with <strong>ByGenz</strong>.
          <br />
          Great choice! We’re preparing your order.
        </p>

        <div className="bg-order-summary">
          <div className="bg-order-summary-row">
            <span>Order ID</span>
            <strong>{orderId || "Available in My Orders"}</strong>
          </div>

          <div className="bg-order-summary-divider" />

          <div className="bg-order-summary-row">
            <span>Estimated delivery</span>
            <strong>{estimatedDelivery}</strong>
          </div>
        </div>

        <div className="bg-order-delivery-note">
          <span className="bg-order-truck" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <circle
                cx="7.5"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle
                cx="17.5"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
          </span>

          <div>
            <strong>What's next?</strong>
            <p>We’ll keep you updated as your order moves toward delivery.</p>
          </div>
        </div>

        <div className="bg-order-actions">
          <button
            type="button"
            className="bg-order-primary"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
          <button
            type="button"
            className="bg-order-secondary"
            onClick={handleViewOrders}
          >
            View My Orders <span>→</span>
          </button>

        </div>

        <p className="bg-order-footer">Thank you for choosing ByGenz ♥</p>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
