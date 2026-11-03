
import "../../style/Checkout.css";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import OrderSuccessModal from "../../components/OrderSuccessModal";
import { TbTruckDelivery } from "react-icons/tb";



const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const apiDomain = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);


  
  // const items = state?.cartItems ||
  //   (state?.product ? [{ product: state.product, quantity: 1 }] : []);

  const [address, setAddress] = useState({
    name: auth?.address?.name || "",
    mobile: auth?.address?.mobile || null,
    pincode: auth?.address?.pincode || null,
    house: auth?.address?.house || "",
    landmark: auth?.address?.landmark || "",
    city: auth?.address?.city || "",
    state: auth?.address?.state || "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addressExist, setAddressExist] = useState(false);
  const [addressModel, setAddressModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  

  useEffect(()=>{
    const dataReloade = () => {
      if(auth?.cart == null) return;
        setItems(auth?.cart);
        setAddressExist(auth?.address ? true : false);
      }
      dataReloade();
    },[auth?.cart]);


  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const deliveryCharge = total >= 499 ? 0 : 40;
  const finalAmount = total + deliveryCharge;


  const placeOrder = async () => {
    if (!items.length) {
      toast.error("Your checkout is empty");
      navigate("/cart");
      return;
    }

    // if (Object.values(address).some((value) => !String(value).trim())) {
    //   toast.error("Please fill all address details");
    //   return;
    // }

    try {
      setLoading(true);

      const orderData = { product: items, paymentMethod: "COD", userid: auth?.user?._id || null,
        ...(!addressExist || addressModel ?
          {
            name: address.name,
            mobile: address.mobile,
            pincode: address.pincode,
            house: address.house,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
          }
        : auth?.address?._id ? { addressid: auth.address._id }: {}),
      };

    const { data } = await axios.post(`${apiDomain}/api/v1/order/create`, orderData);
      console.log(data)
      setPlacedOrderId(data.order?._id || data.orderId || "");
      setShowOrderSuccess(true);
      setLoading(true)

      const updatedAuth = { ...auth,
        user: data?.user ?? auth?.user,
        token: data?.token ?? auth?.token,
        address: data?.address ?? auth?.address,
      };
      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth));

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="buygen-checkout">
      <div className="checkout-heading">
        {/* <span className="checkout-brand">buygen</span> */}
        <h2>Secure Checkout</h2>
        <p>Complete your order in a few easy steps.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-left">
          <section className="checkout-card">
            <div className="checkout-section-title">
              <div >
                <h3 className="checkout-delivery-address-heading"><TbTruckDelivery /> Delivery Addressm</h3>
                <p>Where should we deliver your order?</p>
              </div>
                {addressExist && !addressModel && <button
                  type="button"
                  className="change-address-btn"
                  onClick={() => setAddressModel((prev) => !prev)}>
                    Change Address
                </button>}
                {addressModel && <button
                  type="button"
                  className="change-address-btn"
                  onClick={() => setAddressModel((prev) => !prev)}>
                    Previous Address
                </button>}

            </div>

            {/* Existing Address */}
            {addressExist && !addressModel && 
            <div className="checkout-exist-address">
                <strong>{auth?.address?.name}, {auth?.address?.mobile}</strong>
                <div>{auth?.address?.house}, {auth?.address?.landmark}, {auth?.address?.city}, {auth?.address?.state}, {auth?.address?.pincode}</div>
              </div> 
            }
            {(!addressExist || addressModel) && 
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
            }

          </section>

          <section className="checkout-card">
            <div className="checkout-section-title">
              <div>
                <h3>Payment Method</h3>
                {/* <p>Choose how you want to pay.</p> */}
              </div>
            </div>

            <label className={`checkout-payment-option ${
              paymentMethod === "COD" ? "selected" : ""
            }`}>
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

          <section className="checkout-card">
            <div className="checkout-section-title">
              <div>
                <h3>Order Items ({items.length})</h3>
                <p>Review your products before ordering.</p>
              </div>
            </div>

            {items.map((item, index) => {
              const product = item.product || item;

              return (
                <div className="checkout-product" key={product._id || index}>
                  <img
                    src={
                      product.images?.[0]?.url ||
                      product.image?.[0]?.url ||
                      product.image ||
                      ""
                    }
                    alt={product.title || "Product"}
                  />

                  <div className="checkout-product-info">
                    <h4>{product.title}</h4>
                    <p>Qty: {item.quantity || 1}</p>
                    <strong>
                      ₹{Number(product.price || item.price || 0) *
                        Number(item.quantity || 1)}
                    </strong>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        {/* Price Details */}
        <aside className="checkout-card checkout-summary">
          <h3>Price Details</h3>

          <div className="checkout-price-row">
            <span>Price ({items.length} items)</span>
            <span>₹{total}</span>
          </div>

          <div className="checkout-price-row">
            <span>Discount</span>
            <span className={deliveryCharge === 0 ? "checkout-free" : ""}>
              {/* {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`} */}
              - ₹ 565
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
            <strong>₹{finalAmount}</strong>
          </div>

          <p className="checkout-savings-message">
            {/* <span>✓</span> Safe and secure checkout */}
            💵 You will save ₹ 565
          </p>

          <button
            className="checkout-place-btn"
            onClick={placeOrder}
            disabled={loading || !items.length}
          >
            {loading ? "Placing Order..." : `Place Order · ₹${finalAmount}`}
          </button>

          <p className="checkout-terms">🔒 Safe and secure checkout</p>
        </aside>
      </div>
    </div>

    <OrderSuccessModal
        isOpen={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        orderId={placedOrderId}
        estimatedDelivery="5-7 days business days"
      />

  </>
  );
};

export default Checkout;
