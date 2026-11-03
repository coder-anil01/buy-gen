import { useEffect, useState } from "react";
import "../../style/Orders.css";
import axios from "axios";

import {
  FiShoppingCart,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiEye,
  FiEdit,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";

const apiDomain = import.meta.env.VITE_API_URL;

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Backend pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const limit = 50;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Get orders from backend
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${apiDomain}/api/v1/order/get-all?page=${currentPage}`,
        );

        if (data.success) {
          setOrders(data.orders || []);

          setTotalOrders(data.pagination?.totalOrders || 0);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.log("Order fetch error:", error);
        alert("Unable to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [currentPage]);

  // Update order
  const updateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const { data } = await axios.put(
        `${apiDomain}/api/v1/order/update/${selectedOrder._id}`,
        {
          status: editStatus,
          trackingNumber: trackingNumber,
        },
      );

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? {
                  ...order,
                  status: editStatus,
                  trackingNumber: trackingNumber,
                }
              : order,
          ),
        );

        setSelectedOrder((prev) => ({
          ...prev,
          status: editStatus,
          trackingNumber: trackingNumber,
        }));

        setShowEdit(false);
        setShowDetails(false);
        setSelectedOrder(null);
      } else {
        alert(data.message || "Order update failed");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // Search and filters
  const filteredOrders = orders.filter((order) => {
    const customerName = order.address?.name || "";
    const productName = order.product?.title || "";

    const searchText = search.toLowerCase();

    const matchSearch =
      order._id?.toLowerCase().includes(searchText) ||
      customerName.toLowerCase().includes(searchText) ||
      productName.toLowerCase().includes(searchText);

    const matchStatus =
      statusFilter === "all" || order.status?.toLowerCase() === statusFilter;

    const paymentMethod = order.paymentMethod?.toLowerCase() || "cod";

    const matchPayment =
      paymentFilter === "all" ||
      (paymentFilter === "cod" && paymentMethod === "cod") ||
      (paymentFilter === "online" && paymentMethod !== "cod");

    return matchSearch && matchStatus && matchPayment;
  });

  // Backend pagination: orders already belong to current page
  const currentOrders = filteredOrders;
  const startIndex = (currentPage - 1) * limit;

  // Statistics for currently fetched page
  const deliveredOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "delivered",
  ).length;

  const transitOrders = orders.filter((order) =>
    ["shipped", "processing", "out_for_delivery"].includes(
      order.status?.toLowerCase(),
    ),
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "cancelled",
  ).length;

  // Open edit popup
  const openEdit = (order) => {
    setSelectedOrder(order);
    setEditStatus(order?.status || "placed");
    setTrackingNumber(order?.trackingNumber || "");
    setShowEdit(true);
  };

  // Open details popup
  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status class
  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "delivered") return "delivered";
    if (value === "cancelled") return "cancelled";
    if (value === "shipped") return "shipped";
    if (value === "processing") return "processing";

    return "confirmed";
  };

  // Change page
  const changePage = (page) => {
    if (page < 1 || page > totalPages || loading) return;
    setCurrentPage(page);
  };

  return (
    <>
      <AdminMenu />

      <div className="admin-layout">
        <main className="admin-main orders-content">
          <div className="order-page">
            {/* Page Heading */}
            <div className="categories-heading">
              <div>
                <div className="categories-breadcrumb">
                  <span>Dashboard</span>
                  <b>/</b>
                  <span>Order Management</span>
                </div>

                <h1>Orders</h1>
                <p>View and manage all customer orders.</p>
              </div>
            </div>

            {/* Statistics */}
            <section className="category-stats">
              <div className="category-stat-card">
                <div className="category-stat-icon blue">
                  <FiShoppingCart />
                </div>

                <div>
                  <span>Total Orders</span>
                  <strong>{totalOrders}</strong>
                </div>
              </div>

              <div className="category-stat-card">
                <div className="category-stat-icon green">
                  <FiCheckCircle />
                </div>

                <div>
                  <span>Delivered (Current Page)</span>
                  <strong>{deliveredOrders}</strong>
                </div>
              </div>

              <div className="category-stat-card">
                <div className="category-stat-icon orange">
                  <FiTruck />
                </div>

                <div>
                  <span>In Transit (Current Page)</span>
                  <strong>{transitOrders}</strong>
                </div>
              </div>

              <div className="category-stat-card">
                <div className="category-stat-icon purple">
                  <FiXCircle />
                </div>

                <div>
                  <span>Cancelled (Current Page)</span>
                  <strong>{cancelledOrders}</strong>
                </div>
              </div>
            </section>

            {/* Filters */}
            <div className="order-filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="order confirmed">Order Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out For Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">COD</option>
                <option value="online">Online</option>
              </select>

              <div className="order-search">
                <FiSearch />

                <input
                  type="text"
                  placeholder="Search by Order ID, User, Product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="order-table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Price</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Tracking</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="empty-message">
                        Loading orders...
                      </td>
                    </tr>
                  ) : currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-message">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order, index) => {
                      const product = order?.product || {};

                      return (
                        <tr key={order._id}>
                          {/* Order Number */}
                          <td>
                            #{String(startIndex + index + 1).padStart(3, "0")}
                          </td>

                          {/* Product */}
                          <td>
                            <Link to={`/product/${product._id}`}>
                              <div className="order-product">
                                <img
                                  src={product?.images?.[0]?.url}
                                  alt={product?.title}
                                />

                                <div>
                                  <h4>{product?.title || "Product"}</h4>

                                  {product?.brand && <p>{product?.brand}</p>}
                                </div>
                              </div>
                            </Link>
                          </td>

                          {/* Customer */}
                          <td>
                            <div className="order-customer">
                              <h4>{order?.address?.name}</h4>

                              <p>
                                <FiPhone />
                                {order?.address?.mobile || "No phone"}
                              </p>

                              <p>
                                <FiMapPin />
                                {order?.address?.city +
                                  ", " +
                                  order?.address?.state}
                              </p>
                            </div>
                          </td>

                          {/* Amount */}
                          <td>
                            <div className="order-amount">
                              <h4>
                                ₹{Number(order?.price).toLocaleString("en-IN")}
                              </h4>

                              <p>(Qty: {order.quantity || 1})</p>
                            </div>
                          </td>

                          {/* Payment */}
                          <td>
                            <span
                              className={`payment-badge ${
                                order.paymentMethod?.toLowerCase() === "cod"
                                  ? "cod"
                                  : "online"
                              }`}
                            >
                              {order.paymentMethod || "COD"}
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            <span
                              className={`status-badge ${getStatusClass(
                                order.status,
                              )}`}
                            >
                              {order?.status || "Not Available"}
                            </span>
                          </td>

                          {/* Tracking */}
                          <td>{order?.trackingNumber || "-"}</td>

                          {/* Date */}
                          <td>
                            <div className="order-date">
                              <h4>{formatDate(order?.createdAt)}</h4>
                              <p>{formatTime(order?.createdAt)}</p>
                            </div>
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="order-actions">
                              <button
                                title="View Details"
                                onClick={() => openDetails(order)}
                              >
                                <FiEye />
                              </button>

                              <button
                                title="Edit Order"
                                onClick={() => openEdit(order)}
                              >
                                <FiEdit />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="order-pagination">
              <p>
                Showing {currentOrders.length === 0 ? 0 : startIndex + 1} to{" "}
                {currentOrders.length === 0
                  ? 0
                  : startIndex + currentOrders.length}{" "}
                of {totalOrders} orders
              </p>

              <div className="pagination-buttons">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => changePage(currentPage - 1)}
                >
                  <FiChevronLeft />
                </button>

                <span>
                  {currentPage} / {Math.max(totalPages, 1)}
                </span>

                <button
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => changePage(currentPage + 1)}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Order Details Popup */}
            {showDetails && selectedOrder && (
              <div
                className="order-modal-bg"
                onClick={() => setShowDetails(false)}
              >
                <div
                  className="order-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-heading">
                    <h2>Order Details</h2>

                    <button onClick={() => setShowDetails(false)}>
                      <FiX />
                    </button>
                  </div>

                  <div className="modal-content">
                    <h3>Order ID: #{selectedOrder._id}</h3>

                    <div className="details-product">
                      <img
                        src={selectedOrder.product?.images?.[0]?.url}
                        alt={selectedOrder?.product?.title}
                      />

                      <div>
                        <h3>{selectedOrder.product?.title}</h3>

                        <h5>
                          Total Amount: ₹
                          {selectedOrder.totalAmount || selectedOrder.price}
                        </h5>

                        <p>Quantity: {selectedOrder.quantity || 1}</p>

                        {selectedOrder?.quantity > 1 && (
                          <p>Price: ₹{selectedOrder.price}</p>
                        )}
                      </div>
                    </div>

                    <h3>Customer Information</h3>

                    <p>
                      Name:{" "}
                      {selectedOrder.address?.name || selectedOrder.user?.name}
                    </p>

                    <p>Mobile: {selectedOrder.address?.mobile}</p>

                    <p>Email: {selectedOrder?.user?.email}</p>

                    <h3>Delivery Address</h3>

                    <p>
                      {[
                        selectedOrder.address?.house,
                        selectedOrder.address?.landmark,
                        selectedOrder.address?.city,
                        selectedOrder.address?.state,
                        selectedOrder.address?.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <h3>Payment & Tracking</h3>

                    <p>Payment: {selectedOrder.paymentMethod}</p>
                    <p>Status: {selectedOrder.status}</p>
                    <p>Tracking: {selectedOrder.trackingNumber || "-"}</p>

                    <p>Order Date: {formatDate(selectedOrder.createdAt)}</p>

                    <button
                      className="modal-edit-btn"
                      onClick={() => {
                        setShowDetails(false);
                        openEdit(selectedOrder);
                      }}
                    >
                      <FiEdit /> Update Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Order Popup */}
            {showEdit && selectedOrder && (
              <div
                className="order-modal-bg"
                onClick={() => setShowEdit(false)}
              >
                <div
                  className="order-modal edit-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-heading">
                    <h2>Update Order</h2>

                    <button onClick={() => setShowEdit(false)}>
                      <FiX />
                    </button>
                  </div>

                  <div className="modal-content">
                    <p>Order ID: #{selectedOrder._id}</p>

                    <label>Order Status</label>

                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out For Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <label>Tracking Number</label>

                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />

                    <button className="modal-edit-btn" onClick={updateOrder}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AllOrders;
