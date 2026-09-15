import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <aside className="admin-sidebar">

      <div className="admin-logo">
        LUXECART
        <span>ADMIN</span>
      </div>

      <nav className="admin-nav">

        <Link
          to="/admin"
          className={
            isActive("/admin")
              ? "active"
              : ""
          }
        >
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className={
            isActive("/admin/products")
              ? "active"
              : ""
          }
        >
          Products
        </Link>

        <Link
          to="/admin/orders"
          className={
            isActive("/admin/orders")
              ? "active"
              : ""
          }
        >
          Orders
        </Link>

        <Link
          to="/admin/customers"
          className={
            isActive("/admin/customers")
              ? "active"
              : ""
          }
        >
          Customers
        </Link>

        <Link
          to="/admin/messages"
          className={
            isActive("/admin/messages")
              ? "active"
              : ""
          }
        >
          Messages
        </Link>

        <Link
          to="/admin/testimonials"
          className={
            isActive("/admin/testimonials")
              ? "active"
              : ""
          }
        >
          Testimonials
        </Link>

        <Link
          to="/admin/settings"
          className={
            isActive("/admin/settings")
              ? "active"
              : ""
          }
        >
          Settings
        </Link>

      </nav>

      <div className="admin-sidebar-bottom">

        <Link to="/">
          ← Back to Store
        </Link>

      </div>

    </aside>
  );
}

export default AdminSidebar;