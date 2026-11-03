
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getId = (product) =>
  String(product?._id || product?.product?._id || product?.product || "");

const useShopActions = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  // Update auth and localStorage together
  const updateAuth = useCallback(
    (updates) => {
      const updatedAuth = {
        ...(auth || {}),
        ...updates,
      };

      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth));

      return updatedAuth;
    },
    [auth, setAuth],
  );

  // Add product to cart / increase quantity
  const addToCart = useCallback(
    (product, quantity = 1, redirect = true) => {
      if (!product?._id) return;

      const cart = auth?.cart || [];
      const existingProduct = cart.find(
        (item) => getId(item) === String(product._id),
      );

      const updatedCart = existingProduct
        ? cart.map((item) =>
            getId(item) === String(product._id)
              ? {
                  ...item,
                  quantity: (item.quantity || 1) + quantity,
                }
              : item,
          )
        : [...cart, { ...product, quantity }];

      updateAuth({ cart: updatedCart });

      if (redirect) {
        navigate("/cart", { state: { product } });
      }

      return true;
    },
    [auth, navigate, updateAuth],
  );

  // Remove product completely from cart
  const removeFromCart = useCallback(
    (productId) => {
      const updatedCart = (auth?.cart || []).filter(
        (item) => getId(item) !== String(productId),
      );

      updateAuth({ cart: updatedCart });
    },
    [auth, updateAuth],
  );

  // Check whether product exists in cart
  const isInCart = useCallback(
    (productId) =>
      (auth?.cart || []).some(
        (item) => getId(item) === String(productId),
      ),
    [auth?.cart],
  );

  // Add or remove product from wishlist
  const toggleWishlist = useCallback(
    (product) => {
      if (!product?._id) return;

      const wishlist = auth?.wishlist || [];
      const exists = wishlist.some(
        (item) => getId(item) === String(product._id),
      );

      const updatedWishlist = exists
        ? wishlist.filter(
            (item) => getId(item) !== String(product._id),
          )
        : [...wishlist, product];

      updateAuth({ wishlist: updatedWishlist });

      return !exists;
    },
    [auth, updateAuth],
  );

  // Remove product from wishlist directly
  const removeFromWishlist = useCallback(
    (productId) => {
      const updatedWishlist = (auth?.wishlist || []).filter(
        (item) => getId(item) !== String(productId),
      );

      updateAuth({ wishlist: updatedWishlist });
    },
    [auth, updateAuth],
  );

  // Check whether product exists in wishlist
  const isInWishlist = useCallback(
    (productId) =>
      (auth?.wishlist || []).some(
        (item) => getId(item) === String(productId),
      ),
    [auth?.wishlist],
  );

  return {
    addToCart,
    removeFromCart,
    isInCart,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};

export default useShopActions;
