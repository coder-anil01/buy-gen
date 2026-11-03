
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import "../style/Footer.css";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Newsletter subscription feature coming soon!");
  };

  return (
    <footer className="buygen-footer">
      {/* Newsletter */}
      <div className="buygen-newsletter">
        <div className="buygen-newsletter-content">
          <h2>Get the best deals in your inbox!</h2>
          <p>
            Subscribe to receive exclusive offers, new arrivals
            and special discounts.
          </p>
        </div>

        <form
          className="buygen-newsletter-form"
          onSubmit={handleSubscribe}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            required
          />
          <button type="submit">
            Subscribe <FaArrowRight />
          </button>
        </form>
      </div>

      {/* Main footer */}
      <div className="buygen-footer-main">
        {/* Brand */}
        <div className="buygen-footer-brand">
          <Link to="/" className="buygen-footer-logo">
            Buy<span>gen</span>
          </Link>

          <p>
            Your one-stop destination for quality products,
            amazing deals and a better shopping experience.
          </p>

          <div className="buygen-footer-socials">
            <a href="https://www.facebook.com/" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://x.com/" aria-label="X">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="buygen-footer-column">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/categories">All Categories</Link>
          <Link to="/wishlist">My Wishlist</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/login">My Account</Link>
        </div>

        {/* Categories */}
        <div className="buygen-footer-column">
          <h3>Shop Categories</h3>
          <Link to="/category/men">Men</Link>
          <Link to="/category/women">Women</Link>
          <Link to="/category/kids">Kids</Link>
          <Link to="/category/beauty">Beauty</Link>
          <Link to="/category/home-and-living">Home & Living</Link>
        </div>

        {/* Customer support */}
        <div className="buygen-footer-column buygen-footer-contact">
          <h3>Customer Support</h3>

          <a href="mailto:support@buygen.com">
            <FaEnvelope />
            <span>support@buygen.com</span>
          </a>

          <a href="tel:+911234567890">
            <FaPhoneAlt />
            <span>+91 12345 67890</span>
          </a>

          <div>
            <FaMapMarkerAlt />
            <span>India</span>
          </div>

          <Link to="/orders">Track Your Order</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="buygen-footer-bottom">
        <p>
          © {new Date().getFullYear()} Buygen. All rights reserved.
        </p>

        <div className="buygen-footer-legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <Link to="/return-policy">Return Policy</Link>
        </div>

        {/* <div className="buygen-payment-methods">
          <span>UPI</span>
          <span>VISA</span>
          <span>Mastercard</span>
          <span>COD</span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
