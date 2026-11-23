import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();

  const [showNotification, setShowNotification] = useState(false);

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

  function handleAddToCart() {
    addToCart(product);

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  }

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />

        <button
          type="button"
          className="quick-add"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        {showNotification && (
          <div className="cart-notification">
            <span className="notification-check">✓</span>

            <div>
              <strong>Added to cart</strong>
              <p>{product.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="product-info">
        <p className="product-category">
          {product.category}
        </p>

        <h3>{product.name}</h3>

        <p className="product-price">
          {currencySymbol}{" "}
          {Number(product.price || 0).toLocaleString()}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;