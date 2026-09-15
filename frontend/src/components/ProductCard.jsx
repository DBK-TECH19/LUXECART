import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();

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

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <button
          type="button"
          className="quick-add"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
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