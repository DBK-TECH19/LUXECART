import { Link } from "react-router-dom";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./Footer.css";

function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            {settings.storeName}
          </Link>

          <p>
            Discover quality products, timeless style,
            and a shopping experience designed with you in mind.
          </p>
        </div>

        <div className="footer-column">
          <h3>QUICK LINKS</h3>

          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div className="footer-column">
          <h3>MY ACCOUNT</h3>

          <Link to="/login">Log In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/cart">My Cart</Link>
        </div>

        <div className="footer-column footer-contact">
          <h3>CONTACT US</h3>

          <p>
            Have a question or need assistance?
            We're here to help.
          </p>

          <a href="mailto:bderrick674@gmail.com">
            bderrick674@gmail.com
          </a>

          <Link to="/admin-login" className="footer-admin-link">
            Admin Panel
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
        </p>

        <p>
          Accra, Ghana
        </p>
      </div>
    </footer>
  );
}

export default Footer;