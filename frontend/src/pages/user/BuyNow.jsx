// import axios from 'axios';
// import { useEffect, useState } from 'react'
// import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../../context/auth';
// import { FaHome, FaUser,FaPhoneAlt } from "react-icons/fa";
// import axios from 'axios';
// import '../../style/PaymentBuy.css'
// import { Collapse } from 'antd';
// import { toast } from 'react-toastify';
// import { Modal } from "antd";
// import Coungraculation from "../../image/right.png";
// import SeoHelmet from '../../components/SeoHelmet';

// const PaymentBuy = () => {
//   const apiDomain = import.meta.env.VITE_API_URL;

//     const params = useParams();
//     const loacation = useLocation()
//     const navigate = useNavigate();
//     const[auth] = useAuth();
//     const [product, setProduct] = useState("");
//     const [showkay, setShowkey] = useState(2)
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // All Product
//     useEffect(()=>{
//       const getProduct = async () => {
//       try {
//         const { data } = await axios.get(`${apiDomain}/api/v1/product/get/${params.id}`);
//         setProduct(data.product)
//       } catch (error) {
//         console.log(error);
//      }
//     };

//     getProduct();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[])

//   const conformOrder =async()=> {
//     try {
//       const {data} = await axios.post(`${apiDomain}/api/v1/order/createone`, {cart: product?._id, id: auth?.user?._id, price: product?.price });
//       if(data.success){
//         setIsModalOpen(true);
//         setTimeout(() => {
//           handleCancel();
//         }, 5000);
//       }else{
//         toast.warn(data.message)
//       }
//     } catch (error) {
//       toast.error("Internal Server Error")
//       error;
//     }
//   }

//   const login = () => {
//     navigate('/login', {state: loacation.pathname})
//   }
//   const register = () => {
//     navigate('/register', {state: loacation.pathname})
//   }
//   const editProfile = () => {
//     navigate('/dashbord/profile', {state: loacation.pathname})
//   }
//   const handleCancel = ()=> {
//     setIsModalOpen(false)
//     navigate('/dashbord/order')
//   }

//   return (
//     <>
//     <SeoHelmet title="💸(COD) Order Product" description="Cash on Delivery,' a hassle-free way to complete your purchase. With this method, you can finalize your order by paying in cash upon the delivery of your chosen items. Enjoy the flexibility and peace of mind knowing that you can inspect your products before making the payment. It's a simple, reliable way to shop, ensuring your satisfaction every step of the way. Select 'Cash on Delivery' at checkout and indulge in a seamless shopping experience, where convenience meets trust."/>
//     {auth?.user ? <>
//         <div className='payment-buy'>
//         <Collapse accordion={true} expandIconPosition='right' activeKey={[showkay]} size='small' >
//             <Collapse.Panel className='payment-collapse' key={"1"} header={<div className='payment-collapse-header'><div className='payment-collapse-number'>1</div> LOGIN</div>}>
//                 <div>login success </div>
//             </Collapse.Panel>

//             <Collapse.Panel className='payment-collapse' key={"2"} header={<div className='payment-collapse-header'><div className='payment-collapse-number'>2</div>DELIVERY ADDRESS</div>}>
//             <div className='payment-collapse-auth'>
//               <div>
//                 <div><FaUser/> {auth?.user?.name}</div>
//                 <div><FaPhoneAlt/> {auth?.user?.phone}</div>
//                 <div><FaHome/> {auth?.user?.address}</div>
//               </div>
//               <div onClick={editProfile} className='payment-collapse-change'>Edit</div>
//             </div>
//                 <button onClick={()=> setShowkey(3)} className='payment-collapse-order-button'>DELIVER HERE</button>
//             </Collapse.Panel>
//             <Collapse.Panel className='payment-collapse' key={"3"} header={<div className='payment-collapse-header'> <div className='payment-collapse-number'>3</div>ORDER SUMMERY</div>}>
//             <div className='payment-collapse-product-card'>
//                 <img className='payment-collapse-product-image' src={product.image} alt={product?.title?.slice(0, 8)} />
//                 <div className='payment-collapse-product-title'>
//                     <div>{product?.title?.slice(0, 20)}</div>
//                     <div className='payment-collapse-product-price'><strong>Price:- </strong>₹{product.price}</div>
//                     <button onClick={()=> setShowkey(4)} className='payment-collapse-order-button'>CONTINUE</button>
//                 </div>
//             </div>
//             </Collapse.Panel>

//             <Collapse.Panel className='payment-collapse' key={"4"} header={<div className='payment-collapse-header'><div className='payment-collapse-number'>4</div>PAYMENT OPTION</div>}>
//                 <img className='payment-collapse-cod' src="https://i.postimg.cc/br9ntbrT/cod.png" alt="" />
//                 <button onClick={conformOrder} style={{float: "right"}} className='payment-collapse-order-button'>CONFORM ORDER</button>
//             </Collapse.Panel>
//         </Collapse>
//         <div className='payment-buy-right'>
//             <div className='payment-buy-price-heading'>Payment-details</div>
//             <div className='payment-buy-line'/>
//             <div className='payment-buy-item'>
//                 <div>Price( 1 item )</div>
//                 <div>{product.price}</div>
//             </div>
//             <div className='payment-buy-item'>
//                 <div>Delivery Charges</div>
//                 <div className='payment-buy-delivery-free'>FREE</div>
//             </div>
//             <div className='payment-buy-line'/>
//             <div className='payment-buy-item-total-price'>
//                 <div>Total Payable:- </div>
//                 <div>₹{product.price}</div>
//             </div>
//         </div>
//         </div>
//         </> : <>
//           <div className='user-routes'>
//             <div className='user-routes-card'>
//               <div className='user-routes-text'>I have an account</div>
//               <div className='user-routes-button' onClick={login} >Login</div>

//               <div className='user-routes-text'>I don't have an account</div>
//               <div className='user-routes-button' onClick={register}>Create</div>
//             </div>
//           </div>
//         </>}

//         <Modal className='model-container' open={isModalOpen} maskClosable={false} footer={null} onCancel={handleCancel}>
//           <div className='model-order-placed'>
//             <div className='model-order-placed-coungration'>Coungraculation</div>
//             <div className='model-order-placed-image-main'>
//               <img className='model-order-placed-image' src={Coungraculation} alt="" />
//             </div>
//             <div className='model-order-placed-text'>YOUR ORDER HAS BEEN CONFORMED</div>
//             <div className='model-order-placed-thanks'>THANKS</div>
//           </div>
//         </Modal>
//     </>
//   )
// }

// export default PaymentBuy

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
  const [addressType, setAddressType] = useState("Home");
  // const [placeOrder, setPlaceOrder] = useState(true);
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

  const deliveryCharge = 0;
  // const productPrice = product?.price || 0;
  // const productMRP = product?.compareAtPrice || 0;
  // const discount =(product?.compareAtPrice - product?.price);
  // const totalAmount = productPrice + deliveryCharge;

  const placeOrder = async () => {
    // if (Object.values(address).some((value) => !String(value).trim())) {
    //   toast.error("Please fill all address details");
    //   return;
    // }

    try {
      setLoading(true);

      const orderData = {
        productid: product?._id,
        paymentMethod: "COD",
        userid: auth?.user?._id || null,
        ...(!addressExist || addressModel
          ? {
              name: address.name,
              mobile: address.mobile,
              pincode: address.pincode,
              house: address.house,
              landmark: address.landmark,
              city: address.city,
              state: address.state,
            }
          : auth?.address?._id
            ? { addressid: auth.address._id }
            : {}),
      };

      console.log(orderData);
      const { data } = await axios.post(
        `${apiDomain}/api/v1/order/create-one-order`,
        orderData,
      );
      console.log(data);
      setPlacedOrderId(data.order?._id || data.orderId || "");
      setShowOrderSuccess(true);
      setLoading(true);

      const updatedAuth = {
        ...auth,
        user: data?.user ?? auth?.user,
        token: data?.token ?? auth?.token,
        address: data?.address ?? auth?.address,
      };
      setAuth(updatedAuth);
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
    } catch (error) {
      console.log(error);
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
