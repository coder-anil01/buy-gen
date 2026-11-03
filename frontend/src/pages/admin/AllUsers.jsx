import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiCalendar,
  FiEye,
  FiLock,
  FiUnlock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../style/AllUsers.css";
import AdminMenu from "./AdminMenu";

const apiDomain = import.meta.env.VITE_API_URL;

function AllUsers() {
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    blockedCustomers: 0,
    newThisMonth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 50,
  });

  // Fetch customers
  const getCustomers = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 50,
        search,
        status,
        dateFilter,
        sort,
      };

      if (dateFilter === "custom") {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const { data } = await axios.get(
        `${apiDomain}/api/v1/auth/get-allusers`,
        { params },
      );
      console.log(data);

      if (data.success) {
        setUsers(data.users || []);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.log(
        "Customers API Error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // Search debounce and filters
  useEffect(() => {
    if (dateFilter === "custom" && (!startDate || !endDate)) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(
      () => {
        getCustomers();
      },
      search ? 400 : 0,
    );

    return () => clearTimeout(timer);
  }, [page, search, status, dateFilter, startDate, endDate, sort]);

  // Reset page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, dateFilter, startDate, endDate, sort]);

  // Block / Unblock
  const toggleStatus = async (user) => {
    const nextStatus = !user.isBlocked;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus ? "block" : "unblock"
      } this customer?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user._id);

      const { data } = await axios.put(
        `${apiDomain}/api/v1/auth/update-status/${user._id}`,
        { isBlocked: nextStatus },
      );

      if (data.success) {
        setUsers((prev) =>
          prev.map((item) =>
            item._id === user._id
              ? { ...item, isBlocked: data.user.isBlocked }
              : item,
          ),
        );

        setStats((prev) => ({
          ...prev,
          activeCustomers: prev.activeCustomers + (nextStatus ? -1 : 1),
          blockedCustomers: prev.blockedCustomers + (nextStatus ? 1 : -1),
        }));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update customer");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const changeDateFilter = (value) => {
    setDateFilter(value);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <>
    <AdminMenu />
    <div className="admin-dashbord-layout">
      
    {/* ================= CONTENT ================= */}
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage and monitor your customers</p>
        </div>

        <button
          className="customers-refresh"
          onClick={getCustomers}
          disabled={loading}
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="customers-stats">
        <StatCard
          icon={<FiUsers />}
          title="Total Customers"
          value={stats.totalCustomers}
        />

        <StatCard
          icon={<FiUserPlus />}
          title="New This Month"
          value={stats.newThisMonth}
        />

        <StatCard
          icon={<FiUserCheck />}
          title="Active Customers"
          value={stats.activeCustomers}
        />

        <StatCard
          icon={<FiUserX />}
          title="Blocked Customers"
          value={stats.blockedCustomers}
        />
      </div>

      {/* Filters */}
      <div className="customers-filter-box">
        <div className="customers-filter-top">
          <div className="customers-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Date filters */}
        <div className="customers-date-filter">
          <span>
            <FiCalendar />
            Joined Date:
          </span>

          {[
            ["all", "All Time"],
            ["today", "Today"],
            ["last7Days", "Last 7 Days"],
            ["thisMonth", "This Month"],
            ["lastMonth", "Last Month"],
            ["custom", "Custom Range"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={dateFilter === value ? "active" : ""}
              onClick={() => changeDateFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom date range */}
        {dateFilter === "custom" && (
          <div className="customers-custom-date">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={new Date().toLocaleDateString("en-CA")}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="customers-table-container">
        <div className="customers-table-header">
          <div>
            <h3>All Customers</h3>
            <p>{pagination.total} customers found</p>
          </div>

          <span>Showing maximum 50 per page</span>
        </div>

        <div className="customers-table-scroll">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Orders Amount</th>
                <th>Delivered Spent</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="customers-message">
                    Loading customers...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="customers-message">
                    No customers found
                  </td>
                </tr>
              ) : (
                users?.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="customer-info">
                        {/* <div className="customer-avatar">
                          {(user?.name || user?.email)}
                        </div> */}

                        <div>
                          <strong>{user?.name || "Customer"}</strong>
                          <span>{user?.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{user?.mobile || "-"}</td>

                    <td>{user?.totalOrders || 0}</td>

                    <td>{formatPrice(user?.totalOrderAmount) || 0}</td>

                    <td>{formatPrice(user?.deliveredOrderAmount) || 0}</td>

                    <td>{formatDate(user?.createdAt)}</td>

                    <td>
                      <span
                        className={`customer-status ${
                          user?.isBlocked ? "blocked" : "active"
                        }`}
                      >
                        {user?.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td>
                      <div className="customer-actions">
                        <Link
                          to={`/admin/customers/${user?._id}`}
                          title="View Customer"
                        >
                          <FiEye />
                        </Link>

                        <button
                          title={user?.isBlocked ? "Unblock" : "Block"}
                          disabled={updatingId === user?._id}
                          onClick={() => toggleStatus(user)}
                          className={
                            user?.isBlocked ? "unblock-action" : "block-action"
                          }
                        >
                          {user?.isBlocked ? <FiUnlock /> : <FiLock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="customers-pagination">
          <p>
            Page {page} of {pagination.totalPages || 1}
          </p>

          <div>
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <FiChevronLeft />
              Previous
            </button>

            <button
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="customer-stat-card">
      <div className="customer-stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h2>{Number(value || 0).toLocaleString("en-IN")}</h2>
      </div>
    </div>
  );
}

export default AllUsers;
