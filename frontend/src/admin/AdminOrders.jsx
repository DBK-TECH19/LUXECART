import { useEffect, useState } from "react";
import {
  getOrders,
  updateDeliveryStatus,
  deleteOrder,
} from "../services/api";
import AdminSidebar from "./AdminSidebar";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.value)) {
        setOrders(data.value);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Unable to load orders:", err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function handleDeliveryChange(orderId, newStatus) {
    try {
      setUpdatingOrderId(orderId);

      const updatedOrder = await updateDeliveryStatus(
        orderId,
        newStatus
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                deliveryStatus:
                  updatedOrder.deliveryStatus || newStatus,
                shippedAt: updatedOrder.shippedAt,
                deliveredAt: updatedOrder.deliveredAt,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Unable to update delivery status:",
        err
      );

      alert("Unable to update delivery status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleDelete(orderId) {
    const confirmed = window.confirm(
      `Are you sure you want to delete Order #${orderId}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );
    } catch (err) {
      console.error(
        "Unable to delete order:",
        err
      );

      alert("Unable to delete order.");
    }
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

  function getStatusClass(status) {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  const pendingOrders = orders.filter(
    (order) =>
      (order.deliveryStatus || "Pending") === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      (order.deliveryStatus || "Pending") === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      (order.deliveryStatus || "Pending") === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      (order.deliveryStatus || "Pending") === "Delivered"
  ).length;

  return (
    <div className="admin-orders-layout">

      {/* SHARED ADMIN SIDEBAR */}

      <AdminSidebar />

      {/* MAIN */}

      <main className="admin-orders-main">

        <header className="admin-orders-header">

          <div>
            <p className="admin-eyebrow">
              ORDER MANAGEMENT
            </p>

            <h1>
              Orders
            </h1>

            <p>
              View, manage and update customer deliveries.
            </p>
          </div>

          <button
            type="button"
            className="refresh-orders-button"
            onClick={loadOrders}
            disabled={loading}
          >
            ↻ {loading ? "Loading..." : "Refresh"}
          </button>

        </header>

        {/* SUMMARY */}

        <section className="orders-summary">

          <div className="order-summary-card">
            <span>
              TOTAL ORDERS
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

          <div className="order-summary-card">
            <span>
              PENDING
            </span>

            <strong>
              {pendingOrders}
            </strong>
          </div>

          <div className="order-summary-card">
            <span>
              PROCESSING
            </span>

            <strong>
              {processingOrders}
            </strong>
          </div>

          <div className="order-summary-card">
            <span>
              SHIPPED
            </span>

            <strong>
              {shippedOrders}
            </strong>
          </div>

          <div className="order-summary-card">
            <span>
              DELIVERED
            </span>

            <strong>
              {deliveredOrders}
            </strong>
          </div>

        </section>

        {/* ORDERS */}

        <section className="orders-table-section">

          <div className="orders-table-header">

            <div>
              <p className="admin-eyebrow">
                CUSTOMER ORDERS
              </p>

              <h2>
                All Orders
              </h2>
            </div>

          </div>

          {loading && (
            <div className="admin-orders-message">
              Loading orders...
            </div>
          )}

          {!loading && error && (
            <div className="admin-orders-message error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="admin-orders-message">

                <h3>
                  No orders yet
                </h3>

                <p>
                  Customer orders will appear here.
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            orders.length > 0 && (

              <div className="orders-table-wrapper">

                <table className="orders-table">

                  <thead>

                    <tr>
                      <th>ORDER</th>
                      <th>CUSTOMER</th>
                      <th>CONTACT</th>
                      <th>AMOUNT</th>
                      <th>DELIVERY STATUS</th>
                      <th>DATE</th>
                      <th>ACTION</th>
                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => {

                      const deliveryStatus =
                        order.deliveryStatus || "Pending";

                      return (
                        <tr key={order.id}>

                          <td>
                            <strong className="order-id">
                              #{order.id}
                            </strong>
                          </td>

                          <td>
                            <div className="order-customer">

                              <strong>
                                {order.customerName ||
                                  "Unknown Customer"}
                              </strong>

                              <span>
                                {order.shippingAddress ||
                                  "No address provided"}
                              </span>

                            </div>
                          </td>

                          <td>
                            <div className="order-contact">

                              <span>
                                {order.customerEmail ||
                                  "No email"}
                              </span>

                              <span>
                                {order.customerPhone ||
                                  "No phone"}
                              </span>

                            </div>
                          </td>

                          <td>
                            <strong>
                              GHS{" "}
                              {Number(
                                order.totalAmount || 0
                              ).toLocaleString("en-GH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </td>

                          <td>

                            <select
                              className={`order-status-select ${getStatusClass(
                                deliveryStatus
                              )}`}
                              value={deliveryStatus}
                              disabled={
                                updatingOrderId ===
                                order.id
                              }
                              onChange={(event) =>
                                handleDeliveryChange(
                                  order.id,
                                  event.target.value
                                )
                              }
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Processing">
                                Processing
                              </option>

                              <option value="Shipped">
                                Shipped
                              </option>

                              <option value="Delivered">
                                Delivered
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>

                            </select>

                          </td>

                          <td>
                            <span className="order-date">
                              {formatDate(
                                order.createdAt
                              )}
                            </span>
                          </td>

                          <td>

                            <button
                              type="button"
                              className="delete-order-button"
                              onClick={() =>
                                handleDelete(order.id)
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default AdminOrders;