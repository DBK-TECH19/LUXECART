import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const { settings } = useStoreSettings();
  const location = useLocation();

  const [user, setUser] = useState(null);

  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/admin-login";

  useEffect(() => {
    function loadUser() {
      const savedUser =
        localStorage.getItem("luxecartUser");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error(
            "Unable to read saved user:",
            error
          );
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("luxecartUser");
    setUser(null);
  }

  if (isAdminPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          {settings.storeName}
        </Link>

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Shop
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>
        </div>

        <div className="nav-actions">

          {user ? (
            <>
              <span className="welcome-user">
                Hi, {user.name}
              </span>

              <Link
                to="/my-orders"
                className="my-orders-link"
              >
                My Orders
              </Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-link"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="register-link"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link
            to="/cart"
            className="cart-link"
          >
            🛒
            <span className="cart-count">
              {cartCount}
            </span>
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;