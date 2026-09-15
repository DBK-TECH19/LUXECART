import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import {
  createOrder,
  updateUser,
  initializePayment,
} from "../services/api";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal } = useCart();
  const { settings } = useStoreSettings();

  const savedUser =
    localStorage.getItem("luxecartUser");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Unable to read saved user:",
        error
      );
      user = null;
    }
  }

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    shippingAddress: user?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function getCurrencySymbol(currency) {
    if (currency === "USD - US Dollar") {
      return "USD";
    }

    if (currency === "GBP - British Pound") {
      return "GBP";
    }

    if (currency === "EUR - Euro") {
      return "EUR";
    }

    return "GHS";
  }

  const currencySymbol =
    getCurrencySymbol(settings.currency);

  function formatPrice(amount) {
    return `${currencySymbol} ${Number(
      amount || 0
    ).toLocaleString()}`;
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setMessage("");

    if (!user || !user.id) {
      setMessage(
        "Please log in again before placing your order."
      );
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const customerName =
      formData.customerName.trim();

    const customerEmail =
      formData.customerEmail.trim();

    const customerPhone =
      formData.customerPhone.trim();

    const shippingAddress =
      formData.shippingAddress.trim();

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress
    ) {
      setMessage(
        "Please complete all delivery details."
      );
      return;
    }

    setLoading(true);

    try {
      // Save the customer's latest details.
      const updatedUser =
        await updateUser(user.id, {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: shippingAddress,
        });

      if (updatedUser?.user) {
        localStorage.setItem(
          "luxecartUser",
          JSON.stringify(
            updatedUser.user
          )
        );
      }

      // Create the order as Pending.
      const order = {
        userId: user.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount: cartTotal,
        paymentStatus: "Pending",
        deliveryStatus: "Pending",
      };

      const createdOrder =
        await createOrder(order);

      localStorage.setItem(
        "luxecartLastOrderId",
        String(createdOrder.id)
      );

      setMessage(
        "Preparing secure payment..."
      );

      // Initialize Paystack through ASP.NET.
      const payment =
        await initializePayment({
          email: customerEmail,
          amount: Number(cartTotal),
          orderId: createdOrder.id,
        });

      if (!payment?.authorizationUrl) {
        throw new Error(
          "Paystack payment URL was not returned."
        );
      }

      // Send the customer to Paystack.
      window.location.href =
        payment.authorizationUrl;
    } catch (error) {
      console.error(
        "Unable to start payment:",
        error
      );

      setMessage(
        error.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <p>CHECKOUT</p>

          <h1>
            Your cart is empty
          </h1>

          <button
            type="button"
            className="checkout-back-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <p>
          {settings.storeName} • SECURE CHECKOUT
        </p>

        <h1>
          Complete Your Order
        </h1>

        <span>
          Enter your delivery details below
          to continue to secure payment.
        </span>
      </section>

      <div className="checkout-layout">
        <section className="checkout-form-section">
          <h2>
            Delivery Details
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="checkout-field">
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="checkout-field">
              <label>
                Email Address
              </label>

              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="checkout-field">
              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="checkout-field">
              <label>
                Shipping Address
              </label>

              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                placeholder="Enter your delivery address"
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading
                ? "Preparing Payment..."
                : `Pay ${formatPrice(
                    cartTotal
                  )}`}
            </button>
          </form>

          {message && (
            <p className="checkout-message">
              {message}
            </p>
          )}
        </section>

        <aside className="checkout-summary">
          <p>ORDER SUMMARY</p>

          <h2>
            Your Order
          </h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >
                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty: {item.quantity}
                  </span>
                </div>

                <strong>
                  {formatPrice(
                    item.price *
                      item.quantity
                  )}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>
              Total
            </span>

            <strong>
              {formatPrice(cartTotal)}
            </strong>
          </div>

          <div className="checkout-payment-note">
            Secure payment powered by Paystack.
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;