import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../services/api";
import AdminSidebar from "./AdminSidebar";
import "./AdminProducts.css";
import ProductForm from "./ProductForm";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      const productsList =
        data?.value || data || [];

      setProducts(
        Array.isArray(productsList)
          ? productsList
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load products:",
        error
      );

      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleAddProduct() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  function handleProductCreated(newProduct) {
    setProducts((currentProducts) => [
      newProduct,
      ...currentProducts,
    ]);

    setShowForm(false);
    setEditingProduct(null);
  }

  function handleProductUpdated(updatedProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    setShowForm(false);
    setEditingProduct(null);
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Unable to delete product:",
        error
      );

      alert(
        "Unable to delete product. Please try again."
      );
    }
  }

  return (
    <div className="admin-products-layout">

      {/* SHARED ADMIN SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <main className="admin-products-main">

        <header className="admin-products-header">

          <div>

            <p className="admin-eyebrow">
              INVENTORY MANAGEMENT
            </p>

            <h1>
              Products
            </h1>

            <p>
              Manage your LUXECART product collection.
            </p>

          </div>

          <button
            type="button"
            className="add-product-button"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>

        </header>

        {/* SUMMARY */}

        <section className="products-summary">

          <div className="summary-card">

            <span>
              TOTAL PRODUCTS
            </span>

            <strong>
              {products.length}
            </strong>

          </div>

          <div className="summary-card">

            <span>
              FEATURED
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.isFeatured
                ).length
              }
            </strong>

          </div>

          <div className="summary-card">

            <span>
              IN STOCK
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    Number(
                      product.stockQuantity || 0
                    ) > 0
                ).length
              }
            </strong>

          </div>

        </section>

        {/* PRODUCTS TABLE */}

        <section className="products-table-section">

          <div className="products-table-header">

            <h2>
              All Products
            </h2>

            <button
              type="button"
              className="refresh-button"
              onClick={loadProducts}
              disabled={loading}
            >
              ↻ {loading ? "Loading..." : "Refresh"}
            </button>

          </div>

          {loading && (
            <div className="admin-products-message">
              Loading products...
            </div>
          )}

          {!loading && error && (
            <div className="admin-products-message error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="admin-products-message">
                No products found.
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (

              <div className="products-table-wrapper">

                <table className="products-table">

                  <thead>

                    <tr>
                      <th>PRODUCT</th>
                      <th>CATEGORY</th>
                      <th>PRICE</th>
                      <th>STOCK</th>
                      <th>FEATURED</th>
                      <th>ACTIONS</th>
                    </tr>

                  </thead>

                  <tbody>

                    {products.map(
                      (product) => (

                        <tr key={product.id}>

                          <td>

                            <div className="admin-product-info">

                              <img
                                src={
                                  product.imageUrl
                                }
                                alt={
                                  product.name
                                }
                              />

                              <div>

                                <strong>
                                  {
                                    product.name
                                  }
                                </strong>

                                <span>
                                  ID #
                                  {
                                    product.id
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          <td>

                            <span className="category-badge">
                              {
                                product.category ||
                                "Uncategorized"
                              }
                            </span>

                          </td>

                          <td>

                            <strong>
                              GHS{" "}
                              {Number(
                                product.price ||
                                  0
                              ).toLocaleString(
                                "en-GH"
                              )}
                            </strong>

                          </td>

                          <td>

                            <span
                              className={
                                Number(
                                  product.stockQuantity ||
                                    0
                                ) > 0
                                  ? "stock-in"
                                  : "stock-out"
                              }
                            >
                              {Number(
                                product.stockQuantity ||
                                  0
                              ) > 0
                                ? `${product.stockQuantity} in stock`
                                : "Out of stock"}
                            </span>

                          </td>

                          <td>

                            {product.isFeatured ? (
                              <span className="featured-badge">
                                ★ Featured
                              </span>
                            ) : (
                              <span className="not-featured">
                                Not featured
                              </span>
                            )}

                          </td>

                          <td>

                            <div className="product-actions">

                              <button
                                type="button"
                                className="edit-button"
                                onClick={() =>
                                  handleEdit(
                                    product
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="delete-button"
                                onClick={() =>
                                  handleDelete(
                                    product.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </section>

      </main>

      {/* PRODUCT FORM */}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onProductCreated={
            handleProductCreated
          }
          onProductUpdated={
            handleProductUpdated
          }
        />
      )}

    </div>
  );
}

export default AdminProducts;