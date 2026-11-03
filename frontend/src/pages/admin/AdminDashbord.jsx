import "../../style/Dashbord.css";
import AdminMenu from "./AdminMenu";

const stats = [
  {
    title: "Total Orders",
    value: "1,248",
    change: "+12%",
    icon: "🛒",
    type: "green",
  },
  {
    title: "Total Revenue",
    value: "₹3,48,720",
    change: "+18%",
    icon: "₹",
    type: "blue",
  },
  {
    title: "Total Customers",
    value: "892",
    change: "+10%",
    icon: "👤",
    type: "purple",
  },
  {
    title: "Total Products",
    value: "246",
    change: "+5%",
    icon: "📦",
    type: "orange",
  },
  {
    title: "Pending Reviews",
    value: "34",
    change: "-8%",
    icon: "★",
    type: "pink",
  },
];

const orders = [
  {
    id: "#GB-10248",
    customer: "Aarav Sharma",
    amount: "₹2,499",
    status: "Delivered",
    date: "30 Sep 2026",
  },
  {
    id: "#GB-10247",
    customer: "Priya Singh",
    amount: "₹1,799",
    status: "Processing",
    date: "29 Sep 2026",
  },
  {
    id: "#GB-10246",
    customer: "Rahul Verma",
    amount: "₹3,999",
    status: "Shipped",
    date: "29 Sep 2026",
  },
  {
    id: "#GB-10245",
    customer: "Sneha Patel",
    amount: "₹1,299",
    status: "Delivered",
    date: "28 Sep 2026",
  },
  {
    id: "#GB-10244",
    customer: "Karan Mehta",
    amount: "₹2,199",
    status: "Cancelled",
    date: "28 Sep 2026",
  },
];

const customers = [
  {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    orders: 5,
  },
  {
    name: "Priya Singh",
    email: "priya@example.com",
    orders: 3,
  },
  {
    name: "Rahul Verma",
    email: "rahul@example.com",
    orders: 2,
  },
  {
    name: "Sneha Patel",
    email: "sneha@example.com",
    orders: 4,
  },
  {
    name: "Karan Mehta",
    email: "karan@example.com",
    orders: 1,
  },
];

const products = [
  {
    name: "GenBy Hoodie",
    sold: 248,
    price: "₹1,499",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100",
  },
  {
    name: "Casual Sneakers",
    sold: 210,
    price: "₹1,999",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
  },
  {
    name: "Wireless Earbuds",
    sold: 183,
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100",
  },
  {
    name: "Laptop Backpack",
    sold: 142,
    price: "₹1,799",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100",
  },
  {
    name: "GenBy T-Shirt",
    sold: 128,
    price: "₹999",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
];

function AdminDashboard() {


  return (
    <>
          <AdminMenu/>
    <div className="admin-dashbord-layout">
    {/* <div className="admin-layout"> */}


        {/* ================= CONTENT ================= */}

        <div className="dashboard-content">
          {/* Page heading */}

          <div className="dashboard-heading">
            <div>
              <h1>Dashboard</h1>

              <p>
                Welcome back, Admin! Here's what's happening with your store
                today.
              </p>
            </div>

            <button className="date-filter">
              ▣ &nbsp; Mon, 30 Sep 2026 &nbsp;⌄
            </button>
          </div>

          {/* ================= STATS ================= */}

          <section className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.title}>
                <div className={`stat-icon ${stat.type}`}>{stat.icon}</div>

                <div className="stat-content">
                  <span>{stat.title}</span>

                  <strong>{stat.value}</strong>

                  <small
                    className={stat.change.startsWith("-") ? "negative" : ""}
                  >
                    {stat.change}
                    <em> vs. last 7 days</em>
                  </small>
                </div>
              </div>
            ))}
          </section>

          {/* ================= CHARTS ================= */}

          <section className="dashboard-grid">
            {/* Sales chart */}

            <div className="dashboard-card sales-card">
              <div className="card-header">
                <div>
                  <h2>Sales Overview</h2>
                </div>

                <select>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="sales-chart">
                <div className="chart-y-axis">
                  <span>40K</span>
                  <span>30K</span>
                  <span>20K</span>
                  <span>10K</span>
                  <span>0</span>
                </div>

                <div className="chart-area">
                  <div className="grid-line line-1" />
                  <div className="grid-line line-2" />
                  <div className="grid-line line-3" />
                  <div className="grid-line line-4" />
                  <div className="grid-line line-5" />

                  <svg
                    viewBox="0 0 700 250"
                    preserveAspectRatio="none"
                    className="chart-svg"
                  >
                    <defs>
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopOpacity="0.25" />
                        <stop offset="100%" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <polygon
                      points="
                      0,150
                      110,190
                      220,135
                      330,155
                      440,80
                      550,105
                      650,45
                      700,40
                      700,250
                      0,250
                      "
                      fill="url(#salesGradient)"
                    />

                    <polyline
                      points="
                      0,150
                      110,190
                      220,135
                      330,155
                      440,80
                      550,105
                      650,45
                      700,40
                      "
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />

                    {[0, 110, 220, 330, 440, 550, 650, 700].map((x, index) => {
                      const y = [150, 190, 135, 155, 80, 105, 45, 40][index];

                      return (
                        <circle
                          key={x}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="white"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      );
                    })}
                  </svg>

                  <div className="chart-dates">
                    <span>24 Sep</span>
                    <span>25 Sep</span>
                    <span>26 Sep</span>
                    <span>27 Sep</span>
                    <span>28 Sep</span>
                    <span>29 Sep</span>
                    <span>30 Sep</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}

            <div className="dashboard-card order-status-card">
              <div className="card-header">
                <h2>Order Status</h2>
              </div>

              <div className="order-status">
                <div className="donut-chart">
                  <div className="donut-center">
                    <strong>1,248</strong>
                    <span>Total Orders</span>
                  </div>
                </div>

                <div className="status-list">
                  <div>
                    <span className="status-dot delivered" />
                    <span>Delivered</span>
                    <strong>72%</strong>
                  </div>

                  <div>
                    <span className="status-dot processing" />
                    <span>Processing</span>
                    <strong>12%</strong>
                  </div>

                  <div>
                    <span className="status-dot shipped" />
                    <span>Shipped</span>
                    <strong>9%</strong>
                  </div>

                  <div>
                    <span className="status-dot cancelled" />
                    <span>Cancelled</span>
                    <strong>5%</strong>
                  </div>

                  <div>
                    <span className="status-dot returned" />
                    <span>Returned</span>
                    <strong>2%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}

            <div className="dashboard-card top-products-card">
              <div className="card-header">
                <h2>Top Selling Products</h2>
                <a href="/admin/products">View All →</a>
              </div>

              <div className="top-products">
                {products.map((product, index) => (
                  <div className="top-product" key={product.name}>
                    <span className="product-rank">{index + 1}</span>

                    <img src={product.image} alt={product.name} />

                    <div className="top-product-info">
                      <strong>{product.name}</strong>
                      <span>{product.sold} sold</span>
                    </div>

                    <b>{product.price}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= LOWER GRID ================= */}

          <section className="lower-grid">
            {/* Recent Orders */}

            <div className="dashboard-card recent-orders">
              <div className="card-header">
                <h2>Recent Orders</h2>
                <a href="/admin/orders">View All →</a>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.id}</strong>
                        </td>

                        <td>{order.customer}</td>

                        <td>{order.amount}</td>

                        <td>
                          <span
                            className={`order-badge ${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latest Customers */}

            <div className="dashboard-card customers-card">
              <div className="card-header">
                <h2>Latest Customers</h2>

                <a href="/admin/customers">View All →</a>
              </div>

              <div className="customer-list">
                {customers.map((customer, index) => (
                  <div className="customer" key={customer.email}>
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>

                    <div className="customer-info">
                      <strong>{customer.name}</strong>

                      <span>{customer.email}</span>
                    </div>

                    <b>{customer.orders}</b>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}

            <div className="dashboard-card quick-actions">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>

              <div className="quick-grid">
                <a href="/admin/products">
                  <span>🎁</span>
                  Add Product
                </a>

                <a href="/admin/orders">
                  <span>🛒</span>
                  Manage Orders
                </a>

                <a href="/admin/categories">
                  <span>▦</span>
                  Add Category
                </a>

                <a href="/admin/customers">
                  <span>👤</span>
                  View Customers
                </a>

                <a href="/admin/coupons">
                  <span>◇</span>
                  Create Coupon
                </a>

                <a href="/admin/reports">
                  <span>▥</span>
                  View Reports
                </a>
              </div>
            </div>
          </section>

          {/* ================= ALERTS ================= */}

          <section className="alerts-grid">
            <div className="alert-card low-stock">
              <div className="alert-icon">📦</div>

              <div className="alert-content">
                <h3>Low Stock Alert</h3>

                <p>
                  12 products are running out of stock. Restock now to avoid
                  losing sales.
                </p>

                <a href="/admin/products">View Products →</a>
              </div>

              <span className="low-stock-badge">Low Stock</span>
            </div>

            <div className="alert-card special-offer">
              <div className="alert-icon">📢</div>

              <div className="alert-content">
                <h3>Special Offer</h3>

                <p>
                  Get 20% off on Electronics products. Valid till 5 Oct 2026.
                </p>

                <a href="/admin/discounts">Manage Offer →</a>
              </div>

              <span className="offer-badge">20% OFF</span>
            </div>
          </section>
      </div>
    </div>
        </>

  );
}

export default AdminDashboard;
