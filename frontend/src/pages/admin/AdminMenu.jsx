import "../../style/AdminSidebar.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function AdminMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const menuItems = [
    { icon: "⌂", label: "Dashboard", path: "/admin" },
    { icon: "▦", label: "Categories", path: "/admin/categories" },
    { icon: "◇", label: "Products", path: "/admin/products" },
    { icon: "🛒", label: "Orders", path: "/admin/orders" },
    { icon: "☆", label: "Reviews", path: "/admin/reviews" },
    { icon: "👤", label: "Customers", path: "/admin/customers" },
    { icon: "♔", label: "Admins", path: "/admin/admins" },
    { icon: "◇", label: "Coupons", path: "/admin/coupons" },
    { icon: "%", label: "Discounts", path: "/admin/discounts" },
    { icon: "▥", label: "Reports", path: "/admin/reports" },
    { icon: "⚙", label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="admin-layout">
      {/* ================= SIDEBAR ================= */}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="admin-logo">
            Gen<span>By</span>
          </NavLink>

          <span className="admin-badge">Admin</span>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="store-card">
            <strong>👑 GenBy Store</strong>
            <span>Better Products. Brighter You.</span>
          </div>

          <button className="logout-btn">
            ↪<span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN ================= */}

      <main className="admin-main">
        {/* TOPBAR */}

        <header className="admin-topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <div className="admin-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <button className="notification-btn">
              ♧<b>3</b>
            </button>

            <div className="admin-profile">
              <div className="profile-avatar">A</div>

              <div className="profile-info">
                <strong>Admin</strong>
                <span>Super Admin</span>
              </div>

              <span>⌄</span>
            </div>
          </div>
        </header>
      </main>
    </div>
  );
}

export default AdminMenu;
