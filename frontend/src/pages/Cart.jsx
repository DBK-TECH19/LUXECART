import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  const { settings } = useStoreSettings();

  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");

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

  const currencySymbol = getCurrencySymbol(settings.currency);

  function formatPrice(amount) {
    return `${currencySymbol} ${Number(amount || 0).toLocaleString()}`;
  }

  function handleCheckout() {
    const savedUser = localStorage.getItem("luxecartUser");

    if (!savedUser) {
      setLoginMessage(
        "Please log in or create an account before proceeding to checkout."
      );

      return;
    }

    navigate("/checkout");
  }

  return (
    <main className="cart-page">
      <section className="cart-header">
        <p>YOUR BAG</p>
        <h1>Shopping Cart</h1>
      </section>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart to see them here.
          </p>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">

            {cartItems.map((item) => (
              <article
                className="cart-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <p>{item.category}</p>

                  <h3>{item.name}</h3>

                  <strong>
                    {formatPrice(item.price)}
                  </strong>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-item-total">
                  {formatPrice(
                    item.price * item.quantity
                  )}
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <p>ORDER SUMMARY</p>

            <h2>Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span>
                Calculated at checkout
              </span>
            </div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            {loginMessage && (
              <div className="login-required-message">
                <p>
                  {loginMessage}
                </p>

                <div className="login-required-links">
                  <Link to="/login">
                    Log In
                  </Link>

                  <Link to="/register">
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;