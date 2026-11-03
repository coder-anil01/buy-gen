import "../../style/Wishlist.css";
import { useAuth } from "../../context/auth";
import ProductCard from "../../components/ProductCard";

import { FaHeart, FaShoppingBag, FaArrowRight,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Wishlist = () => {
  const [auth] = useAuth();
    const navigate = useNavigate();

  // Handle null or undefined wishlist
  const wishlist = Array.isArray(auth?.wishlist) ? auth.wishlist : [];

  return (
    <>
      <main className="category-products-page">
        <div className="category-products-heading">
          <div>
            <h1>My Wishlist</h1>
            <p>All the products you love, in one place.</p>
          </div>

          <span className="category-product-count">
            {wishlist.length} Products
          </span>
        </div>

        {/* Empty wishlist */}
        {wishlist.length === 0 ? (
          <section className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <FaHeart size={38} />
            </div>

            <h2>Your wishlist is waiting</h2>

            <p>
              You haven't saved any products yet. Explore our collection and add
              your favourite products to your wishlist.
            </p>

            <button
              type="button"
              className="wishlist-shop-btn"
              onClick={() => navigate("/")}
            >
              <FaShoppingBag size={17} />
              Explore Products
              <FaArrowRight size={15} />
            </button>
          </section>
        ) : (
          <div className="category-products-grid">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Wishlist;
