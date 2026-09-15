import { useState } from "react";
import {
  createProduct,
  updateProduct,
} from "../services/api";
import "./ProductForm.css";

function ProductForm({
  onClose,
  onProductCreated,
  onProductUpdated,
  product = null,
}) {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    imageUrl: product?.imageUrl || "",
    category: product?.category || "Fashion",
    stockQuantity: product?.stockQuantity ?? "",
    isFeatured: product?.isFeatured || false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category,
        stockQuantity: Number(formData.stockQuantity),
        isFeatured: formData.isFeatured,
      };

      if (isEditing) {
        const updatedProduct = await updateProduct(
          product.id,
          productData
        );

        onProductUpdated(updatedProduct);
      } else {
        const newProduct = await createProduct(productData);

        onProductCreated(newProduct);
      }

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        isEditing
          ? "Unable to update product. Please try again."
          : "Unable to create product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="product-form-overlay">

      <div className="product-form-modal">

        <div className="product-form-header">

          <div>
            <p className="admin-eyebrow">
              INVENTORY
            </p>

            <h2>
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>
          </div>

          <button
            type="button"
            className="close-form-button"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Classic Leather Bag"
              required
            />

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product..."
              rows="4"
              required
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Price (GHS)</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="850"
                min="0"
                step="0.01"
                required
              />

            </div>

            <div className="form-group">

              <label>Stock Quantity</label>

              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="20"
                min="0"
                required
              />

            </div>

          </div>

          <div className="form-group">

            <label>Image URL</label>

            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              required
            />

          </div>

          <div className="form-group">

            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Fashion">
                Fashion
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Footwear">
                Footwear
              </option>
            </select>

          </div>

          <label className="featured-checkbox">

            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />

            <span>
              Feature this product on the homepage
            </span>

          </label>

          {error && (
            <div className="product-form-error">
              {error}
            </div>
          )}

          <div className="product-form-actions">

            <button
              type="button"
              className="cancel-form-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-product-button"
              disabled={saving}
            >
              {saving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ProductForm;