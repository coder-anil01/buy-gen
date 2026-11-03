// import { useEffect, useState } from 'react'
// import axios from 'axios';
// import { useAuth } from '../../context/auth';
// // import { Link } from 'react-router-dom';
// import "../../style/UserOrder.css";
// import { IoIosArrowForward } from "react-icons/io";
// import { Link } from "react-router-dom";
// import ProductReviews from '../ProductReviews';

// const UserOrder = () => {
//   const apiDomain = import.meta.env.VITE_API_URL;
//   const[orders, setOrders] = useState([]);
//   const [auth] = useAuth();
//   const [activeFilter, setActiveFilter] = useState("All Orders");
//   const[orderDetails, setOrderDetails] = useState();
//   const [reviewModel, setReviewModel] = useState(false);

//   const filters = [
//     "All Orders",
//     "Shipped",
//     "Processing",
//     "Delivered",
//     "Cancelled",
//   ];

//   const handleOk = async () => {
//     try {
//       const confirmDelete = window.confirm("Are you sure you want to cancelled this Order?");
//       if (confirmDelete) {
//         const data = await axios.put(`${apiDomain}/api/v1/order/update/${orderDetails?._id}`, {status: "cancelled"})
//         getAllOrders();
//         setReviewModel(false);
//         console.log(data.update)
//         setOrderDetails(null);
//         alert("Order cancelled successfully!");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getAllOrders = async()=> {
//     try {
//       const {data} = await axios.post(`${apiDomain}/api/v1/order/user-order`, {id: auth?.user._id})
//       setOrders(data.orders);
//       console.log(data.orders);
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   useEffect(()=>{
//     getAllOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[auth])
//   return (
//   <>
//     <div className="user-order">
//       <div className="user-order-container">
//         <div className="user-order-filter-button">
//           {filters.map((filter) => (
//           <div key={filter} className={`user-order-filter-item ${ activeFilter === filter ? "active" : ""}`}onClick={() => setActiveFilter(filter)}>
//               {filter}
//         </div>
//       ))}
//     </div>
//     {orders.length>0 ?
//       <div>
//         {orders.map((order, index)=>(
//         <div className='user-order-card-main'>
//           <div className="user-order-card" key={index} onClick={() => {setReviewModel(false); setOrderDetails((prev) =>prev?._id === order._id ? null : order)}}>
//               <img className="user-order-card-image" src={order?.product?.images[0]?.url} alt={order?.product?.title}/>
//             <div className="user-order-card-details">
//               {/* <strong className="user-order-card-id">Order no: #{order._id}</strong> */}
//               <div>
//                 <strong className="user-order-card-status">{order?.status}</strong>
//               </div>
//               <div className="user-order-card-delivery-date">Deliver Before{" "}{order?.estimatedDelivery? new Date(order.estimatedDelivery).toLocaleDateString("en-GB", {day: "2-digit",month: "short",}): "Date unavailable"}</div>
//               {/* <div className="user-order-card-delivery-date">Delivery by 04 oct</div> */}
//               <div className="user-order-card-sub-details">
//                 {/* <strong>Size: XL</strong> */}
//                 <strong>Qty: 1</strong>
//                 <strong>Cash: ₹{order?.price}</strong>
//               </div>
//             </div>
//             <div className="user-order-card-arrow">
//               <IoIosArrowForward
//                 size={25}
//                 color="#0a9c5a"
//                 style={{ color: "#0a9c5a", fill: "#0a9c5a" }}/>
//             </div>
//           </div>

//           {orderDetails?._id === order._id && (
//           <div className="user-order-details">
//             <div className="user-order-button">
//               <div onClick={() => alert("After Shipped Track order!")}>Track Order</div>
//               <div onClick={handleOk}>Cancle Order</div>
//               {/* <Link></Link> */}
//               <Link to={`/product/${orderDetails?.product?._id}`}><div>Buy Again</div></Link>
//               <div onClick={()=> setReviewModel((prev) => !prev)}>{reviewModel ? "Close Review box": "Write a Product Reviews"}</div>
//             </div>
//               <div className="user-order-address">
//                 <strong className="user-order-address-heading">Delivery Address</strong>
//                 <div>{orderDetails?.address?.name} {orderDetails?.address?.mobile}</div>
//                 <div>{orderDetails?.address?.house}</div>
//                 <div>{orderDetails?.address?.landmark}</div>
//                 <div>{orderDetails?.address?.city+" "+orderDetails?.address?.state+", "+orderDetails?.address?.pincode}</div>
//               </div>

//               {reviewModel &&
//                 <ProductReviews
//                   productId={orderDetails?.product?._id}
//                   userId={auth?.user?._id}
//                   token={auth?.token}/>
//               }
//             </div>
//           )}
//         </div>
//       ))}
//       </div>
//       : "Loding"}
//       </div>
//     </div>
//   </>
//   )
// }

// export default UserOrder

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import "../../style/UserOrder.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import ProductReviews from "../ProductReviews";

const UserOrder = () => {
  const apiDomain = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [orderDetails, setOrderDetails] = useState(null);
  const [reviewModel, setReviewModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const filters = [
    // `All Orders ${orders.length}`,
    "All Orders",
    "Shipped",
    "Processing",
    "Delivered",
    "Cancelled",
  ];

  // Fetch all orders
  useEffect(() => {
    const getAllOrders = async () => {
      if (!auth?.user?._id) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${apiDomain}/api/v1/order/user-order`,
          { id: auth.user._id },
        );
        setOrders(data?.orders || []);
      } catch (error) {
        console.log("Get orders error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?._id]);

  // Filter orders by status
  const getFilterStatus = (status) => {
    if (
      ["shipped", "in_transit", "on_the_way", "out_for_delivery"].includes(
        status,
      )
    ) {
      return "Shipped";
    }

    if (["placed", "confirmed", "processing", "packed"].includes(status)) {
      return "Processing";
    }

    if (status === "delivered") return "Delivered";
    if (["cancelled", "returned"].includes(status)) return "Cancelled";

    return "";
  };

  const orderData =
    activeFilter === "All Orders"
      ? orders
      : orders.filter(
          (order) =>
            getFilterStatus(order?.status?.toLowerCase()) === activeFilter,
        );

  // Display readable order status
  const getStatusLabel = (status) => {
    const labels = {
      placed: "Order Placed",
      confirmed: "Confirmed",
      processing: "Processing",
      packed: "Packed",
      shipped: "Shipped",
      in_transit: "On the Way",
      on_the_way: "On the Way",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      return_requested: "Return Requested",
      returned: "Returned",
    };

    return labels[status] || status || "Status unavailable";
  };

  // Allow cancellation before dispatch
  const canCancel = (status) =>
    ["placed", "confirmed", "processing", "order confirmed"].includes(
      status?.toLowerCase(),
    );

  // Delivery timeline
  const trackingSteps = [
    { label: "Ordered", icon: FiPackage },
    { label: "Shipped", icon: FiTruck },
    { label: "On the Way", icon: FiTruck },
    { label: "Out for Delivery", icon: FiMapPin },
    { label: "Delivered", icon: FiCheckCircle },
  ];

  const getCurrentStep = (status) => {
    if (status === "delivered") return 4;
    if (status === "out_for_delivery") return 3;
    if (["in_transit", "on_the_way"].includes(status)) return 2;
    if (status === "shipped") return 1;
    return 0;
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

  // Open/close order details
  const handleOrderClick = (order) => {
    setOrderDetails((previous) => (previous?._id === order._id ? null : order));
    setReviewModel(false);
  };

  // Confirm and cancel selected order

  const handleOk = async () => {
    if (!orderDetails?._id || cancelling) return;
    if (!canCancel(orderDetails.status)) {
      alert("This order can no longer be cancelled.");
      return;
    }
    try {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?",
      );
      if (!confirmCancel) return;
      if (confirmCancel) {
        setCancelling(true);
        const data = await axios.put(
          `${apiDomain}/api/v1/order/update/${orderDetails?._id}`,
          { status: "cancelled" },
        );
        setReviewModel(false);
        console.log(data.update);
        setOrderDetails(null);
        setCancelling(false);

        // Update local state only after successful API response
        const updatedOrder = {
          ...orderDetails,
          ...(data?.update || {}),
          status: "cancelled",
        };
        setOrders((previous) =>
          previous.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order,
          ),
        );
        setOrderDetails(updatedOrder);
        alert("Order cancelled successfully!");
      }
      setReviewModel(false);
    } catch (error) {
      console.log(error);
      setCancelling(false);
    }
  };

  // const handleOk = async (event) => {
  //   event?.stopPropagation();

  //   if (!orderDetails?._id || cancelling) return;

  //   if (!canCancel(orderDetails.status)) {
  //     alert("This order can no longer be cancelled.");
  //     return;
  //   }

  //   const confirmCancel = window.confirm(
  //     "Are you sure you want to cancel this order?"
  //   );

  //   if (!confirmCancel) return;

  //   try {
  //     setCancelling(true);

  //     const response = await axios.put(
  //       `${apiDomain}/api/v1/order/update/${orderDetails._id}`,
  //       { status: "cancelled" },
  //       auth?.token
  //         ? {
  //             headers: {
  //               Authorization: `Bearer ${auth.token}`,
  //             },
  //           }
  //         : {}
  //     );

  //     const data = response.data;

  //     if (
  //       data?.success === false ||
  //       data?.updated === false
  //     ) {
  //       alert(data?.message || "Order cancellation failed.");
  //       return;
  //     }

  //     // Update local state only after successful API response
  //     const updatedOrder = {
  //       ...orderDetails,
  //       ...(data?.order || {}),
  //       status: "cancelled",
  //     };

  //     setOrders((previous) =>
  //       previous.map((order) =>
  //         order._id === updatedOrder._id ? updatedOrder : order
  //       )
  //     );

  //     setOrderDetails(updatedOrder);
  //     setReviewModel(false);

  //     alert("Order cancelled successfully!");
  //   } catch (error) {
  //     console.log("Cancel order error:", error);
  //     alert(
  //       error?.response?.data?.message ||
  //         "Unable to cancel the order. Please try again."
  //     );
  //   } finally {
  //     setCancelling(false);
  //   }
  // };

  return (
    <div className="user-order">
      <div className="user-order-container">
        <div className="user-order-heading">
          <div>
            <h2>My Orders</h2>
            {/* <p>Manage your orders and check delivery progress.</p> */}
          </div>
        </div>

        {/* Filters */}
        <div className="user-order-filter-button">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={`user-order-filter-item ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => {
                setActiveFilter(filter);
                setOrderDetails(null);
                setReviewModel(false);
              }}
            >
              {filter}
              {filter === "All Orders" && (
                <span className="order-count">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="user-order-message">
            <div className="user-order-loader" />
            <p>Loading your orders...</p>
          </div>
        ) : !auth?.user?._id ? (
          <div className="user-order-message">
            <FiPackage size={42} />
            <h3>Please log in</h3>
            <p>Log in to view your orders.</p>
            <Link to="/login" className="user-order-shop-btn">
              Login
            </Link>
          </div>
        ) : orderData.length === 0 ? (
          <div className="user-order-message">
            <FiPackage size={44} />
            <h3>No orders found</h3>
            <p>
              {activeFilter === "All Orders"
                ? "You have not placed any orders yet."
                : `No ${activeFilter.toLowerCase()} orders found.`}
            </p>
            <Link to="/" className="user-order-shop-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="user-order-list">
            {orderData.map((order) => {
              const isOpen = orderDetails?._id === order._id;
              const status = order?.status?.toLowerCase();
              const isCancelled = status === "cancelled";
              const isReturned = status === "returned";
              const isDelivered = status === "delivered";
              const currentStep = getCurrentStep(status);
              const productImage = order?.product?.images?.[0]?.url;

              return (
                <div className="user-order-card-main" key={order._id}>
                  {/* Order card */}
                  <div
                    className={`user-order-card ${
                      isOpen ? "user-order-card-open" : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOrderClick(order)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleOrderClick(order);
                    }}
                  >
                    {productImage ? (
                      <img
                        className="user-order-card-image"
                        src={productImage}
                        alt={order?.product?.title || "Product"}
                      />
                    ) : (
                      <div className="user-order-image-placeholder">
                        <FiPackage size={28} />
                      </div>
                    )}

                    <div className="user-order-card-details">
                      <span
                        className={`user-order-card-status ${
                          isCancelled
                            ? "status-cancelled"
                            : isDelivered
                              ? "status-delivered"
                              : "status-active"
                        }`}
                      >
                        {getStatusLabel(status)}
                      </span>

                      <h3 className="user-order-product-title">
                        {order?.product?.title || "Product"}
                      </h3>

                      <div className="user-order-card-delivery-date">
                        {isDelivered
                          ? `Delivered on ${formatDate(order?.updatedAt)}`
                          : isCancelled
                            ? "Order cancelled"
                            : `Deliver before ${formatDate(
                                order?.estimatedDelivery,
                              )}`}
                      </div>

                      <div className="user-order-card-sub-details">
                        <span>Qty: {order?.quantity || 1}</span>
                        <strong>
                          ₹{formatPrice(order?.totalAmount ?? order?.price)}
                        </strong>
                      </div>
                    </div>

                    <div className="user-order-card-arrow">
                      <IoIosArrowForward
                        size={24}
                        className={isOpen ? "arrow-open" : ""}
                      />
                    </div>
                  </div>

                  {/* Order details */}
                  {isOpen && (
                    <div className="user-order-details">
                      {/* Delivery timeline */}
                      {!isCancelled && !isReturned && (
                        <div className="user-order-tracking">
                          <div className="user-order-section-heading">
                            <div>
                              <h3>Delivery Progress</h3>
                              <p>Current status of your order</p>
                            </div>
                            <span className="user-order-tracking-status">
                              {getStatusLabel(status)}
                            </span>
                          </div>

                          <div className="user-order-timeline">
                            <div className="user-order-timeline-line">
                              <div
                                className="user-order-timeline-line-active"
                                style={{
                                  width: `${(currentStep / 4) * 100}%`,
                                }}
                              />
                            </div>

                            {trackingSteps.map((step, index) => {
                              const StepIcon = step.icon;
                              const completed = index <= currentStep;

                              return (
                                <div
                                  className="user-order-timeline-step"
                                  key={step.label}
                                >
                                  <div
                                    className={`user-order-step-icon ${
                                      completed ? "completed" : ""
                                    }`}
                                  >
                                    <StepIcon size={18} />
                                  </div>
                                  <span
                                    className={`user-order-step-label ${
                                      completed ? "completed" : ""
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {[
                            "placed",
                            "confirmed",
                            "processing",
                            "packed",
                          ].includes(status) && (
                            <p className="user-order-tracking-note">
                              Your order is being prepared for dispatch.
                            </p>
                          )}

                          {[
                            "shipped",
                            "in_transit",
                            "on_the_way",
                            "out_for_delivery",
                          ].includes(status) && (
                            <p className="user-order-tracking-note">
                              Your order is on its way. Delivery progress
                              depends on the latest status update.
                            </p>
                          )}
                        </div>
                      )}

                      {(isCancelled || isReturned) && (
                        <div className="user-order-cancelled-info">
                          <FiXCircle size={22} />
                          <span>
                            {isCancelled
                              ? "This order has been cancelled."
                              : "This order has been returned."}
                          </span>
                        </div>
                      )}

                      {/* Delivery address */}
                      <div className="user-order-address">
                        <div className="user-order-section-heading">
                          <div>
                            <h3>Delivery Address</h3>
                            {/* <p>Shipping address for this order</p> */}
                          </div>
                          <FiMapPin size={22} />
                        </div>

                        <strong className="user-order-address-name">
                          {order?.address?.name} {order.address.mobile}
                        </strong>
                        <p>
                          {order.address.house}, {order.address.landmark},{" "}
                        </p>
                        <p>
                          {order?.address?.city}, {order?.address?.state},{" "}
                          {order?.address?.pincode}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="user-order-actions">
                        {canCancel(status) && (
                          <button
                            type="button"
                            className="user-order-action-btn cancel-btn"
                            disabled={cancelling}
                            onClick={handleOk}
                          >
                            {cancelling ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}

                        {order?.product?._id && (
                          <Link
                            to={`/product/${order.product._id}`}
                            className="user-order-action-btn buy-again-btn"
                            onClick={(event) => event.stopPropagation()}
                          >
                            Buy Again
                          </Link>
                        )}

                        {/* {isDelivered && ( */}
                        <button
                          type="button"
                          className="user-order-action-btn review-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            setReviewModel((previous) => !previous);
                          }}
                        >
                          {reviewModel ? "Close Reviews" : "Write a Review"}
                        </button>
                        {/* )} */}
                      </div>

                      {/* {reviewModel && isDelivered && ( */}
                      {reviewModel && (
                        <div className="user-order-review">
                          <ProductReviews
                            productId={order?.product?._id}
                            userId={auth?.user?._id}
                            token={auth?.token}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
