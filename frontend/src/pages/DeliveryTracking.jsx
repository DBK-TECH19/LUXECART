import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../services/api";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./DeliveryTracking.css";

function DeliveryTracking() {
  const { id } = useParams();
  const { settings } = useStoreSettings();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      const data = await getOrder(id);

      setOrder(data);
      setError("");
    } catch (error) {
      console.error("Unable to load order:", error);
      setError("We could not find this order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    loadOrder();

    const interval = setInterval(() => {
      loadOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  function getStatusIndex(status) {
    const normalizedStatus = String(
      status || "Pending"
    ).toLowerCase();

    const statuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
    ];

    return statuses.indexOf(normalizedStatus);
  }

  function getStatusText(status) {
    const normalizedStatus = String(
      status || "Pending"
    ).toLowerCase();

    if (normalizedStatus === "processing") {
      return "Processing";
    }

    if (normalizedStatus === "shipped") {
      return "Shipped";
    }

    if (normalizedStatus === "delivered") {
      return "Delivered";
    }

    if (normalizedStatus === "cancelled") {
      return "Cancelled";
    }

    return "Pending";
  }

  function formatPrice(amount) {
    const currency =
      settings.currency === "USD - US Dollar"
        ? "USD"
        : settings.currency === "GBP - British Pound"
        ? "GBP"
        : settings.currency === "EUR - Euro"
        ? "EUR"
        : "GHS";

    return `${currency} ${Number(
      amount || 0
    ).toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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

  if (loading) {
    return (
      <main className="delivery-page">
        <div className="delivery-loading">
          Loading delivery information...
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="delivery-page">
        <div className="delivery-error">
          <p>DELIVERY TRACKING</p>

          <h1>Order Not Found</h1>

          <span>
            {error || "This order could not be found."}
          </span>

          <Link
            to="/products"
            className="delivery-back-button"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /*
    IMPORTANT:
    Delivery status comes from order.deliveryStatus,
    not order.status.
  */

  const currentStatus = String(
    order.deliveryStatus || "Pending"
  ).toLowerCase();

  const currentIndex = getStatusIndex(
    currentStatus
  );

  const steps = [
    {
      key: "pending",
      title: "Order Received",
      description:
        "Your order has been received successfully.",
    },
    {
      key: "processing",
      title: "Processing",
      description:
        "Your order is being prepared for delivery.",
    },
    {
      key: "shipped",
      title: "Shipped",
      description:
        "Your order is on its way to you.",
    },
    {
      key: "delivered",
      title: "Delivered",
      description:
        "Your order has been delivered.",
    },
  ];

  return (
    <main className="delivery-page">

      {/* HEADER */}

      <section className="delivery-header">

        <p>
          {settings.storeName} • DELIVERY TRACKING
        </p>

        <h1>
          Track Your Order
        </h1>

        <span>
          Monitor your order status from confirmation
          to delivery.
        </span>

      </section>

      <div className="delivery-container">

        {/* ORDER INFO */}

        <section className="delivery-order-card">

          <div className="delivery-order-top">

            <div>

              <p className="delivery-label">
                ORDER NUMBER
              </p>

              <h2>
                #{order.id}
              </h2>

            </div>

            <div
              className={`delivery-current-status ${currentStatus}`}
            >
              {getStatusText(
                order.deliveryStatus
              )}
            </div>

          </div>

          <div className="delivery-order-details">

            <div>
              <span>
                Customer
              </span>

              <strong>
                {order.customerName || "Customer"}
              </strong>
            </div>

            <div>
              <span>
                Order Total
              </span>

              <strong>
                {formatPrice(
                  order.totalAmount
                )}
              </strong>
            </div>

            <div>
              <span>
                Ordered
              </span>

              <strong>
                {formatDate(
                  order.createdAt
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* TRACKING TIMELINE */}

        <section className="delivery-tracking-card">

          <div className="delivery-section-heading">

            <div>

              <p className="delivery-label">
                LIVE UPDATES
              </p>

              <h2>
                Delivery Progress
              </h2>

            </div>

            <span className="delivery-live">
              ● LIVE
            </span>

          </div>

          {currentStatus === "cancelled" ? (

            <div className="delivery-cancelled">

              <strong>
                Order Cancelled
              </strong>

              <p>
                This order has been cancelled.
                Please contact support if you need
                assistance.
              </p>

            </div>

          ) : (

            <div className="delivery-timeline">

              {steps.map((step, index) => {

                const isComplete =
                  currentIndex >= index;

                const isCurrent =
                  currentIndex === index;

                return (
                  <div
                    className={`delivery-step ${
                      isComplete
                        ? "completed"
                        : ""
                    } ${
                      isCurrent
                        ? "current"
                        : ""
                    }`}
                    key={step.key}
                  >

                    <div className="delivery-step-marker">
                      {isComplete
                        ? "✓"
                        : index + 1}
                    </div>

                    <div className="delivery-step-content">

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {isCurrent
                          ? step.description
                          : isComplete
                          ? "Completed"
                          : "Waiting for update"}
                      </p>

                      {step.key === "pending" &&
                        order.createdAt && (
                          <span>
                            {formatDate(
                              order.createdAt
                            )}
                          </span>
                        )}

                      {step.key === "shipped" &&
                        order.shippedAt && (
                          <span>
                            {formatDate(
                              order.shippedAt
                            )}
                          </span>
                        )}

                      {step.key === "delivered" &&
                        order.deliveredAt && (
                          <span>
                            {formatDate(
                              order.deliveredAt
                            )}
                          </span>
                        )}

                    </div>

                    {index <
                      steps.length - 1 && (
                      <div
                        className={`delivery-line ${
                          currentIndex > index
                            ? "active"
                            : ""
                        }`}
                      />
                    )}

                  </div>
                );
              })}

            </div>

          )}

        </section>

        {/* DELIVERY DETAILS */}

        <section className="delivery-details-card">

          <p className="delivery-label">
            DELIVERY INFORMATION
          </p>

          <h2>
            Shipping Details
          </h2>

          <div className="shipping-details">

            <div>

              <span>
                Name
              </span>

              <strong>
                {order.customerName ||
                  "Customer"}
              </strong>

            </div>

            <div>

              <span>
                Phone
              </span>

              <strong>
                {order.customerPhone ||
                  "Not provided"}
              </strong>

            </div>

            <div className="shipping-address">

              <span>
                Delivery Address
              </span>

              <strong>
                {order.shippingAddress ||
                  "No address provided"}
              </strong>

            </div>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="delivery-actions">

          <Link
            to="/my-orders"
            className="delivery-home-button"
          >
            ← My Orders
          </Link>

          <Link
            to="/products"
            className="delivery-shop-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}

export default DeliveryTracking;