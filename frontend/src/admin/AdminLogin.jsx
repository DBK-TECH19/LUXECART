import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    // Temporary admin login for development
    if (
      formData.email === "admin@luxecart.com" &&
      formData.password === "Admin12345"
    ) {
      localStorage.setItem("luxecartAdmin", "true");

      navigate("/admin");

      return;
    }

    setMessage("Invalid admin email or password.");
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <p>LUXECART ADMIN</p>

          <h1>Admin Login</h1>

          <span>
            Sign in to manage your store.
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="admin-login-field">
            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Admin email"
              required
            />
          </div>

          <div className="admin-login-field">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Admin password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In
          </button>

        </form>

        {message && (
          <p className="admin-login-message">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}

export default AdminLogin;