import { useEffect, useState } from "react";
// import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../style/PaymentBuy.css";
import { useAuth } from "../../context/auth";
import OrderSuccessModal from "../../components/OrderSuccessModal";
import { TbTruckDelivery } from "react-icons/tb";
import OptimizedImage from "../../components/OptimizedImage";
import optimizeImage from "../../utils/optimizeImage";

// const BuyNow = ({ product }) => {
const BuyNow = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [auth, setAuth] = useAuth();
  const [addressExist, setAddressExist] = useState(false);
  const [addressModel, setAddressModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const apiDomain = import.meta.env.VITE_API_URL;
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const deliveryCharge = 0;
  const [address, setAddress] = useState({
    name: auth?.address?.name || "",
    mobile: auth?.address?.mobile || null,
    pincode: auth?.address?.pincode || null,
    house: auth?.address?.house || "",
    landmark: auth?.address?.landmark || "",
    city: auth?.address?.city || "",
    state: auth?.address?.state || "",
  });

  useEffect(() => {
    const dataReloade = () => {
      if (auth?.user == null) return;
      setAddressExist(auth?.address ? true : false);
    };
    dataReloade();
  }, [auth?.user]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Place order function
  const placeOrder = async () => {
    if (loading) return;

    // Decide which address to use
    const useNewAddress = !addressExist || addressModel;

    // Validate address only when adding or editing address
    if (useNewAddress) {
      const fields = [
        ["name", "Full Name"],
        ["mobile", "Mobile Number"],
        ["pincode", "PIN Code"],
        ["house", "House / Street Address"],
        ["landmark", "Landmark"],
        ["city", "City"],
        ["state", "State"],
      ];

      const emptyField = fields.find(
        ([field]) => !String(address?.[field] ?? "").trim(),
      );

      if (emptyField) {
        alert(`Please enter ${emptyField[1]}`);
        return;
      }

      // Mobile validation
      if (!/^[6-9]\d{9}$/.test(String(address.mobile).trim())) {
        alert("Please enter a valid 10-digit mobile number");
        return;
      }

      // Pincode validation
      if (!/^\d{6}$/.test(String(address.pincode).trim())) {
        alert("Please enter a valid 6-digit PIN code");
        return;
      }
    } else if (!auth?.address?._id) {
      alert("Please add a delivery address first");
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        productid: product?._id,
        paymentMethod: "COD",
        userid: auth?.user?._id || null,

        ...(useNewAddress
          ? {
              name: address.name.trim(),
              mobile: address.mobile.trim(),
              pincode: address.pincode.trim(),
              house: address.house.trim(),
              landmark: address.landmark.trim(),
              city: address.city.trim(),
              state: address.state.trim(),
            }
          : {
              addressid: auth.address._id,
            }),
      };

      // Create order API
      const { data } = await axios.post(
        `${apiDomain}/api/v1/order/create-one-order`,
        orderData,
      );

      // Update authentication data
      const updatedAuth = {
        ...auth,
        user: data?.user ?? auth?.user,
        token: data?.token ?? auth?.token,
        address: data?.address ?? auth?.address,
      };

      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth));

      // Show order success
      setPlacedOrderId(data.order?._id || data.orderId);
      setShowOrderSuccess(true);
    } catch (error) {
      console.error("Order placing error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while placing your order",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="buygen-checkout">
        <div className="checkout-heading">
          <h2>Secure Checkout</h2>
          <p>Complete your order in a few easy steps.</p>
        </div>
        <div className="checkout-layout">
          <div className="checkout-left">
            <section className="checkout-card">
              <div className="checkout-section-title">
                <div>
                  <h3 className="checkout-delivery-address-heading">
                    <TbTruckDelivery /> Delivery Address
                  </h3>
                  <p>Where should we deliver your order?</p>
                </div>
                {addressExist && !addressModel && (
                  <button
                    type="button"
                    className="change-address-btn"
                    onClick={() => setAddressModel((prev) => !prev)}
                  >
                    Change Address
                  </button>
                )}
                {addressModel && (
                  <button
                    type="button"
                    className="change-address-btn"
                    onClick={() => setAddressModel((prev) => !prev)}
                  >
                    Previous Address
                  </button>
                )}
              </div>
              {/* Existing Address */}
              {addressExist && !addressModel && (
                <div className="checkout-exist-address">
                  <strong>
                    {auth?.address?.name}, {auth?.address?.mobile}
                  </strong>
                  <div>
                    {auth?.address?.house}, {auth?.address?.landmark},{" "}
                    {auth?.address?.city}, {auth?.address?.state},{" "}
                    {auth?.address?.pincode}
                  </div>
                </div>
              )}
              {(!addressExist || addressModel) && (
                <form className="checkout-address-form">
                  {[
                    ["name", "Full Name"],
                    ["mobile", "Mobile Number"],
                    ["pincode", "PIN Code"],
                    ["house", "House / Street Address"],
                    ["landmark", "Landmark"],
                    ["city", "City"],
                    ["state", "State"],
                  ].map(([name, label]) => (
                    <label className="checkout-field" key={name}>
                      <span>{label}</span>
                      <input
                        name={name}
                        value={address[name]}
                        onChange={handleChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        required
                      />
                    </label>
                  ))}
                </form>
              )}
            </section>

            <section className="checkout-card">
              <div className="checkout-section-title">
                <div>
                  <h3>Payment Method</h3>
                  {/* <p>Choose how you want to pay.</p> */}
                </div>
              </div>

              <label
                className={`checkout-payment-option ${
                  paymentMethod === "COD" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="checkout-payment-icon">₹</span>
                <span>
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
                {/* <span className="checkout-radio-dot" /> */}
              </label>
            </section>

            {/* PRODUCT DETAILS */}
            <section className="checkout-card">
              <div className="checkout-section-title">
                <div>
                  <h3>Order Summary</h3>
                  <p>Review your products before ordering.</p>
                </div>
              </div>

              {/* {items.map((item, index) => {
              const product = item.product || item;

              return ( */}
              <div className="checkout-product">
                <OptimizedImage
                  className="checkout-product-image"
                  src={optimizeImage(product?.images?.[0]?.url, 150)}
                  alt={product?.title}
                  objectFit="cover"
                />

                <div className="checkout-product-info">
                  <h4>{product.title}</h4>
                  <p>Qty: {product?.quantity || 1}</p>
                  <strong>
                    ₹
                    {Number(product?.price || 0) *
                      Number(product?.quantity || 1)}
                  </strong>
                </div>
              </div>
              {/* );
            })} */}
            </section>
          </div>

          {/* Price Details */}
          <aside className="checkout-card checkout-summary">
            <h3>Price Details</h3>

            <div className="checkout-price-row">
              <span>MRP </span>
              <span>₹{product?.compareAtPrice}</span>
            </div>

            <div className="checkout-price-row">
              <span>Discount</span>
              <span className={deliveryCharge === 0 ? "checkout-free" : ""}>
                {/* {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`} */}
                {/* - ₹ 565 */}- ₹{product?.compareAtPrice - product?.price}
              </span>
            </div>
            <div className="checkout-price-row">
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? "checkout-free" : ""}>
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="checkout-price-row checkout-savings">
              <span>Payment</span>
              <span>Cash on Delivery</span>
            </div>

            <div className="checkout-total-row">
              <strong>Total Amount</strong>
              <strong>₹{product?.price}</strong>
            </div>

            <p className="checkout-savings-message">
              {/* <span>✓</span> Safe and secure checkout */}
              💵 You will save ₹ 565
            </p>

            <button
              className="checkout-place-btn"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : `Place Order · ₹${product?.price}`}
            </button>

            <p className="checkout-terms">🔒 Safe and secure checkout</p>
          </aside>
        </div>
      </div>

      {/* Order Confirm */}
      <OrderSuccessModal
        isOpen={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        orderId={placedOrderId}
        estimatedDelivery="4-6 days business days"
      />
    </>
  );
};

export default BuyNow;
