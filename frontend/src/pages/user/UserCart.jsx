
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../../style/NavCartPage.css'
import { useAuth } from "../../context/auth";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [discount, setDiscount] = useState(0);

  console.log(auth);


  useEffect(()=>{
  const dataReloade = () => {
    if(auth?.cart == null) return;
      setCartItems(auth?.cart);
      const subtotal = auth?.cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),0);
      const mrp = auth?.cart.reduce((total, item) => total + (Number(item.compareAtPrice) || 0) * (Number(item.quantity) || 1),0);
      setSubtotal(subtotal);
      setMrp(mrp);
      setDiscount(mrp - subtotal)
      const total = Math.max(0,subtotal - (Number(couponDiscount) || 0));
      setTotal(total);
    }
    dataReloade();
  },[auth?.cart, couponDiscount]);


  // setCartItems((prev) => prev.map((item) => item._id === id ? { ...item,
  //           quantity: Math.max(1, item.quantity + change),
  //         } : item )
  // );

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map((item) => item._id === id ? {
        ...item, quantity: Math.max(1, item.quantity + change),} : item
        );
      // setCartItems(updatedCart);
      const newData = {...auth, cart:updatedCart};
      setAuth(newData);
      localStorage.setItem("auth", JSON.stringify(newData));
  };

  const removeItem = (id) => {
    // setCartItems((prev) => prev.filter((item) => item._id !== id));
    const updatedCart = cartItems.filter((item) => item._id !== id);
    const newData = {...auth, cart:updatedCart};
      setAuth(newData);
      localStorage.setItem("auth", JSON.stringify(newData));
    setCouponDiscount(0);
    setCouponMessage("");
  };

// useEffect(() => {
//   if (auth?.cart == null) return;
//   const data = () => {

//     const subtotal = auth?.cart.reduce(
//     (total, item) =>
//       total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
//     0
//   );

//   setSubtotal(subtotal);
//   const total = Math.max(0,subtotal - (Number(couponDiscount) || 0));
//   setTotal(total);
// }
// data();
// }, [auth?.cart, couponDiscount]);



  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter coupon code");
      return;
    }

    try {
      setLoading(true);
      setCouponMessage("");

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/coupon/validate",
        {
          code: couponCode.trim().toUpperCase(),
          cartItems: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
        }
      );

      setCouponDiscount(data.discount);
      setCouponMessage(data.message || "Coupon applied successfully");
    } catch (error) {
      setCouponDiscount(0);
      setCouponMessage(
        error.response?.data?.message || "Unable to apply coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="buygen-cart-empty">
        <div className="buygen-cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Discover something you love at Buygen.</p>
        <Link to="/" className="buygen-cart-shop-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="buygen-cart-page">
      <div className="buygen-cart-container">
        <div className="buygen-cart-heading">
          <div>
            <h2>My Cart</h2>
            <p>{cartItems.length} different products in your cart</p>
          </div>

          <Link to="/" className="buygen-cart-continue">
            Continue Shopping
          </Link>
        </div>

        <div className="buygen-cart-layout">
          {cartItems.length > 0 && 
          <div className="buygen-cart-products">
            {cartItems.map((item, index) => (
              <div className="buygen-cart-card" key={index}>
                <Link
                  to={`/product/${item._id}`}
                  className="buygen-cart-image"
                >
                  <img
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.title}
                  />
                </Link>

                <div className="buygen-cart-product-info">
                  <Link
                    to={`/product/${item._id}`}
                    className="buygen-cart-product-title"
                  >
                    {item.title}
                  </Link>

                  <p className="buygen-cart-price">
                    ₹{item.price}
                  </p>

                  {item.offer && (
                    <span className="buygen-cart-offer">
                      🎁 {item.offer}
                    </span>
                  )}

                  <div className="buygen-cart-actions">
                    <div className="buygen-cart-quantity">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="buygen-cart-remove"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="buygen-cart-item-total">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
}
          <aside className="buygen-cart-summary">
            <h3>Price Details</h3>

            <div className="buygen-cart-summary-row">
              <span>MRP (incl. of all taxes)</span>
              <span>₹{mrp.toLocaleString("en-IN")}</span>
            </div>

            <div className="buygen-cart-summary-row">
              <span>Discount</span>
              <span className="buygen-cart-free">- ₹{discount}</span>
            </div>
            <div className="buygen-cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="buygen-cart-summary-row">
              <span>Delivery</span>
              <span className="buygen-cart-free">Free</span>
            </div>

            {couponDiscount > 0 && (
              <div className="buygen-cart-summary-row buygen-cart-savings">
                <span>Coupon discount</span>
                <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* <div className="buygen-cart-coupon">
              <label htmlFor="buygen-coupon">Have a coupon?</label>

              <div className="buygen-cart-coupon-input">
                <input
                  id="buygen-coupon"
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(e.target.value.toUpperCase())
                  }
                />

                <button onClick={applyCoupon} disabled={loading}>
                  {loading ? "..." : "Apply"}
                </button>
              </div>

              {couponMessage && (
                <p
                  className={
                    couponDiscount > 0
                      ? "buygen-cart-coupon-success"
                      : "buygen-cart-coupon-error"
                  }
                >
                  {couponMessage}
                </p>
              )}
            </div> */}

            <div className="buygen-cart-grand-total">
              <strong>Total Amount</strong>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            {/* <p className="buygen-cart-saving-note">
              You save ₹{couponDiscount.toLocaleString("en-IN")} with coupons
            </p> */}

            <Link
              to="/checkout"
              state={{ cartItems, couponCode, couponDiscount }}
              className="buygen-cart-checkout"
            >
              Proceed to Checkout →
            </Link>

            {/* <div className="buygen-cart-trust">
              <span>🔒 Secure checkout</span>
              <span>✓ Easy returns</span>
            </div> */}
          </aside>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;