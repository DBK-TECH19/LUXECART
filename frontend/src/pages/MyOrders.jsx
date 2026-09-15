import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCustomerOrders } from "../services/api";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const { settings } = useStoreSettings();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("luxecartUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser?.id) {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (err) {
      console.error("Unable to read customer account:", err);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomerOrders(user.id);

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data?.value)) {
          setOrders(data.value);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Unable to load customer orders:", err);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();

    const interval = setInterval(loadOrders, 15000);

    return () => clearInterval(interval);
  }, [user]);

  function getDeliveryStatus(order) {
    return order.deliveryStatus || "Pending";
  }

  function getPaymentStatus(order) {
    return order.paymentStatus || "Pending";
  }

  function getStatusClass(status) {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function formatDate(date) {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatCurrency(amount) {
    let currency = "GHS";

    if (settings.currency === "USD - US Dollar") {
      currency = "USD";
    }

    if (settings.currency === "GBP - British Pound") {
      currency = "GBP";
    }

    if (settings.currency === "EUR - Euro") {
      currency = "EUR";
    }

    return `${currency} ${Number(amount || 0).toLocaleString(
      "en-GH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="my-orders-page">
      <div className="my-orders-container">

        <div className="my-orders-header">
          <div>
            <p className="my-orders-eyebrow">
              MY ACCOUNT
            </p>

            <h1>
              My Orders
            </h1>

            <p>
              Welcome back, {user.name || "Customer"}.
              Your orders are saved to your account.
            </p>
          </div>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Continue Shopping
          </Link>
        </div>

        {loading && (
          <div className="my-orders-message">
            <div className="orders-loading-spinner" />

            <p>
              Loading your orders...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="my-orders-message error">
            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="my-orders-empty">
              <div className="empty-orders-icon">
                🛍
              </div>

              <h2>
                No orders yet
              </h2>

              <p>
                When you place an order, it will appear
                here and remain linked to your account.
              </p>

              <Link
                to="/products"
                className="start-shopping-button"
              >
                Start Shopping →
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="my-orders-list">

              {orders.map((order) => {
                const deliveryStatus =
                  getDeliveryStatus(order);

                const paymentStatus =
                  getPaymentStatus(order);

                return (
                  <article
                    className="customer-order-card"
                    key={order.id}
                  >

                    <div className="customer-order-top">

                      <div>
                        <span className="customer-order-label">
                          ORDER
                        </span>

                        <h2>
                          #{order.id}
                        </h2>
                      </div>

                      <span
                        className={`customer-delivery-badge ${getStatusClass(
                          deliveryStatus
                        )}`}
                      >
                        {deliveryStatus}
                      </span>

                    </div>

                    <div className="customer-order-details">

                      <div className="customer-order-detail">
                        <span>
                          ORDER DATE
                        </span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>
                      </div>

                      <div className="customer-order-detail">
                        <span>
                          TOTAL
                        </span>

                        <strong>
                          {formatCurrency(
                            order.totalAmount
                          )}
                        </strong>
                      </div>

                      <div className="customer-order-detail">
                        <span>
                          PAYMENT
                        </span>

                        <strong
                          className={`payment-${getStatusClass(
                            paymentStatus
                          )}`}
                        >
                          {paymentStatus}
                        </strong>
                      </div>

                      <div className="customer-order-detail">
                        <span>
                          DELIVERY
                        </span>

                        <strong>
                          {deliveryStatus}
                        </strong>
                      </div>

                    </div>

                    <div className="customer-order-address">
                      <span>
                        DELIVERY ADDRESS
                      </span>

                      <p>
                        {order.shippingAddress ||
                          "No shipping address provided"}
                      </p>
                    </div>

                    <div className="customer-order-actions">

                      <Link
                        to={`/track-order/${order.id}`}
                        className="track-order-button"
                      >
                        Track Order →
                      </Link>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </div>
    </main>
  );
}

export default MyOrders;