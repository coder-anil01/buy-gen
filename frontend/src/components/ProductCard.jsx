// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FiHeart, FiShoppingCart } from "react-icons/fi";
// import "../style/ProductCard.css";
// import { useAuth } from "../context/auth";

// const ProductCard = ({ product }) => {

//   const [auth, setAuth] = useAuth();
//   const navigate = useNavigate();

//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [wishlist, setWishlist] = useState([]);

//   useEffect(() => {
//     const reload = () => {
//       if (!auth?.wishlist) return;
//       setIsWishlisted(auth?.wishlist?.some((item) => String(item._id) === String(product?._id),) || false,);
//       setWishlist(auth?.wishlist);
//       console.log(auth?.wishlist)
//     };

//     reload();
//   }, [auth?.wishlist, product]);

//   if (!product) return null;

//   const image = product.images?.[0]?.url || product.image || "";
//   const price = Number(product.price) || 0;
//   const oldPrice = Number(product.compareAtPrice) || 0;

//   const discount =
//     oldPrice > price && oldPrice > 0
//       ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

// const formatPrice = (price) => {
//   const amount = Number(price);
//   if (price == null || price === "" || !Number.isFinite(amount)) {
//     return "Price unavailable";
//   }
//   return `₹${amount.toLocaleString("en-IN")}`;
// };

// // Remove from Wishlist
// const removeFromWishlist = (productId) => {
//     if (!productId) return;
//     const updatedWishlist = wishlist.filter((item) => item !== String(productId),);
//     const updatedAuth = { ...auth, wishlist: updatedWishlist,};

//     setAuth(updatedAuth);

//     try {
//       localStorage.setItem("auth", JSON.stringify(updatedAuth));
//     } catch (error) {
//       console.error("Failed to update wishlist in localStorage:", error);
//     }
//   };

//   return (
//     <>
//       <div
//         // to={`/product/${product._id}`}
//         className="product-card"
//         draggable="false"
//       >
//         <div className="product-card-image">
//           {image ? (
//             <img
//               src={image}
//               alt={product.title || "Product"}
//               loading="lazy"
//               draggable="false"
//             />
//           ) : (
//             <div className="product-card-no-image">No Image</div>
//           )}

//           {discount > 0 && (
//             <span className="product-card-discount">{discount}% OFF</span>
//           )}

//           <button
//             type="button"
//             className={`product-card-heart ${isWishlisted ? "active" : ""}`}
//             // onClick={handleWishlist}
//             // aria-label={
//             //   isWishlisted ? "Remove from wishlist" : "Add to wishlist"
//             // }
//             title="Remove from wishlist"
//             aria-label={`Remove from wishlist`}
//             onClick={(event) => {
//               event.stopPropagation();
//               removeFromWishlist({productId:product?._id});
//             }}
//           >
//             <FiHeart fill={isWishlisted ? "currentColor" : "none"} />
//           </button>
//         </div>

//         <div className="product-card-info">
//           <Link to={`/product/${product._id}`} className="product-card-title">
//             {product.title}
//           </Link>

//           <div className="product-card-prices">
//             <span className="product-card-price">
//               {formatPrice(price.toLocaleString("en-IN"))}
//             </span>

//             {oldPrice > price && <del>{formatPrice(oldPrice.toLocaleString("en-IN"))}</del>}
//           </div>
//           {product?.averageRating > 0 ? (
//             <div className="product-card-rating">
//               {product?.averageRating}
//               <span>★</span> ({product?.totalReviews})
//               <small> · Rated by Buyers</small>
//             </div>
//           ) : (
//             <div className="product-card-rating">
//               <small>Not Rated by any Buyers</small>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductCard;

import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import "../style/ProductCard.css";
import { useAuth } from "../context/auth";
import "../style/ProductCard.css"

const ProductCard = ({ product }) => {
  const [auth, setAuth] = useAuth();

  if (!product) return null;

  const wishlist = Array.isArray(auth?.wishlist) ? auth.wishlist : [];

  // Wishlist item se product ID nikalo
  const getProductId = (item) => {
    if (item == null) return "";

    // Wishlist item directly ID string ho
    if (typeof item === "string" || typeof item === "number") {
      return String(item);
    }

    // Wishlist item product object ya populated reference ho
    const productItem = item.product ?? item;

    if (typeof productItem === "string" || typeof productItem === "number") {
      return String(productItem);
    }

    return String(productItem?._id ?? "");
  };

  // Check whether product is wishlisted
  const isWishlisted = wishlist.some(
    (item) => getProductId(item) === String(product._id),
  );

  const image = product.images?.[0]?.url || product.image || "";
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.compareAtPrice) || 0;

  const discount =
    oldPrice > price && oldPrice > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const formatPrice = (value) => {
    const amount = Number(value);

    if (value == null || value === "" || !Number.isFinite(amount)) {
      return "Price unavailable";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Remove product from wishlist
  const removeFromWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const productId = String(product._id);

    const updatedWishlist = wishlist.filter(
      (item) => getProductId(item) !== productId,
    );

    const updatedAuth = {
      ...auth,
      wishlist: updatedWishlist,
    };

    setAuth(updatedAuth);

    try {
      // Use the actual localStorage key used by your AuthContext
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card" draggable={false}>
      <div className="product-card-image">
        {image ? (
          <img
            src={image}
            alt={product.title || "Product"}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="product-card-no-image">No Image</div>
        )}

        {discount > 0 && (
          <span className="product-card-discount">{discount}% OFF</span>
        )}

        <button
          type="button"
          className={`product-card-heart ${isWishlisted ? "active" : ""}`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={removeFromWishlist}
          disabled={!isWishlisted}
        >
          <FiHeart fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-card-info">
        <Link to={`/product/${product._id}`} className="product-card-title">
          {product.title}
        </Link>

        <div className="product-card-prices">
          <span className="product-card-price">{formatPrice(price)}</span>

          {oldPrice > price && <del>{formatPrice(oldPrice)}</del>}
        </div>

        {product.averageRating > 0 ? (
          <div className="product-card-rating">
            {product.averageRating}
            <span>★</span> ({product.totalReviews})
            <small> · Rated by Buyers</small>
          </div>
        ) : (
          <div className="product-card-rating">
            <small>Not Rated by any Buyers</small>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
