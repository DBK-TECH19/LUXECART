import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  getUsers,
  getOrders,
} from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadDashboardData() {
    try {
      setError("");

      const [
        productsData,
        usersData,
        ordersData,
      ] = await Promise.all([
        getProducts(),
        getUsers(),
        getOrders(),
      ]);

      const productsList =
        productsData?.value || productsData || [];

      const usersList =
        usersData?.value || usersData || [];

      const ordersList =
        ordersData?.value || ordersData || [];

      setProducts(
        Array.isArray(productsList)
          ? productsList
          : []
      );

      setUsers(
        Array.isArray(usersList)
          ? usersList
          : []
      );

      setOrders(
        Array.isArray(ordersList)
          ? ordersList
          : []
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        "Unable to load dashboard data:",
        error
      );

      setError(
        "Unable to load live dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalProducts = products.length;

  const productsInStock = products.filter(
    (product) =>
      Number(product.stockQuantity || 0) > 0
  ).length;

  const totalCustomers = users.length;

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      String(
        order.deliveryStatus || "Pending"
      ).toLowerCase() === "pending"
  );

  const processingOrders = orders.filter(
    (order) =>
      String(
        order.deliveryStatus || "Pending"
      ).toLowerCase() === "processing"
  );

  const shippedOrders = orders.filter(
    (order) =>
      String(
        order.deliveryStatus || "Pending"
      ).toLowerCase() === "shipped"
  );

  const deliveredOrders = orders.filter(
    (order) =>
      String(
        order.deliveryStatus || "Pending"
      ).toLowerCase() === "delivered"
  );

  const paidOrders = orders.filter(
    (order) =>
      String(
        order.paymentStatus || "Pending"
      ).toLowerCase() === "paid"
  );

  const totalSales = paidOrders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const salesData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const dateKey = date
      .toISOString()
      .split("T")[0];

    const daySales = paidOrders
      .filter((order) => {
        if (!order.createdAt) {
          return false;
        }

        const orderDate = new Date(
          order.createdAt
        )
          .toISOString()
          .split("T")[0];

        return orderDate === dateKey;
      })
      .reduce(
        (sum, order) =>
          sum + Number(order.totalAmount || 0),
        0
      );

    salesData.push({
      label: date.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),
      sales: daySales,
    });
  }

  const highestSale = Math.max(
    ...salesData.map(
      (day) => day.sales
    ),
    1
  );

  const stockPercentage =
    totalProducts > 0
      ? (productsInStock /
          totalProducts) *
        100
      : 0;

  const pendingPercentage =
    totalOrders > 0
      ? (pendingOrders.length /
          totalOrders) *
        100
      : 0;

  const deliveredPercentage =
    totalOrders > 0
      ? (deliveredOrders.length /
          totalOrders) *
        100
      : 0;

  function formatCurrency(amount) {
    return `GHS ${Number(
      amount || 0
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function getDeliveryStatus(order) {
    return order.deliveryStatus || "Pending";
  }

  function getStatusClass(status) {
    return String(status || "pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          LUXECART
          <span>ADMIN</span>
        </div>

       <nav className="admin-nav">

  <Link
    to="/admin"
    className="active"
  >
    Dashboard
  </Link>

  <Link to="/admin/products">
    Products
  </Link>

  <Link to="/admin/orders">
    Orders
  </Link>

  <Link to="/admin/customers">
    Customers
  </Link>

  <Link to="/admin/messages">
    Messages
  </Link>

  <Link to="/admin/testimonials">
    Testimonials
  </Link>

  <Link to="/admin/settings">
    Settings
  </Link>

</nav>

        <div className="admin-sidebar-bottom">

          <Link to="/">
            ← Back to Store
          </Link>

        </div>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              Dashboard
            </h1>

            <p className="analytics-updated">
              {lastUpdated
                ? `Live data · Updated ${lastUpdated.toLocaleTimeString()}`
                : "Loading live data..."}
            </p>

          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div>

              <strong>
                Administrator
              </strong>

              <span>
                Store Manager
              </span>

            </div>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div className="analytics-error">
            {error}
          </div>
        )}

        {/* STATS */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <span>
              TOTAL SALES
            </span>

            <strong>
              {loading
                ? "..."
                : formatCurrency(
                    totalSales
                  )}
            </strong>

            <small>
              From paid orders
            </small>

          </div>

          <div className="admin-stat-card">

            <span>
              ORDERS
            </span>

            <strong>
              {loading
                ? "..."
                : totalOrders}
            </strong>

            <small>
              {pendingOrders.length} pending
            </small>

          </div>

          <div className="admin-stat-card">

            <span>
              PRODUCTS
            </span>

            <strong>
              {loading
                ? "..."
                : totalProducts}
            </strong>

            <small>
              {productsInStock} in stock
            </small>

          </div>

          <div className="admin-stat-card">

            <span>
              CUSTOMERS
            </span>

            <strong>
              {loading
                ? "..."
                : totalCustomers}
            </strong>

            <small>
              Registered customers
            </small>

          </div>

        </section>

        {/* SALES ANALYTICS */}

        <section className="analytics-section">

          <div className="analytics-section-header">

            <div>

              <p className="admin-eyebrow">
                PERFORMANCE
              </p>

              <h2>
                Sales Analytics
              </h2>

            </div>

            <span className="analytics-live">
              ● LIVE
            </span>

          </div>

          <div className="sales-chart">

            {salesData.map((day, index) => {

              const height =
                day.sales > 0
                  ? Math.max(
                      (day.sales /
                        highestSale) *
                        100,
                      8
                    )
                  : 4;

              return (
                <div
                  className="sales-day"
                  key={`${day.label}-${index}`}
                >

                  <div className="sales-value">
                    {day.sales > 0
                      ? Math.round(
                          day.sales
                        )
                      : "0"}
                  </div>

                  <div className="sales-bar-container">

                    <div
                      className="sales-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                  </div>

                  <span>
                    {day.label}
                  </span>

                </div>
              );

            })}

          </div>

        </section>

        {/* LOWER ANALYTICS */}

        <section className="analytics-grid">

          {/* RECENT ORDERS */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>

                <p className="admin-eyebrow">
                  ORDERS
                </p>

                <h2>
                  Recent Orders
                </h2>

              </div>

              <Link to="/admin/orders">
                View All
              </Link>

            </div>

            {recentOrders.length === 0 ? (

              <div className="analytics-empty">

                <h3>
                  No orders yet
                </h3>

                <p>
                  New customer orders
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="recent-orders">

                {recentOrders.map(
                  (order) => {

                    const deliveryStatus =
                      getDeliveryStatus(
                        order
                      );

                    return (
                      <div
                        className="recent-order"
                        key={order.id}
                      >

                        <div>

                          <strong>
                            #{order.id}
                          </strong>

                          <span>
                            {order.customerName ||
                              "Customer"}
                          </span>

                        </div>

                        <div className="recent-order-right">

                          <strong>
                            {formatCurrency(
                              order.totalAmount
                            )}
                          </strong>

                          <span
                            className={`order-status ${getStatusClass(
                              deliveryStatus
                            )}`}
                          >
                            {deliveryStatus}
                          </span>

                        </div>

                      </div>
                    );

                  }
                )}

              </div>

            )}

          </div>

          {/* STORE HEALTH */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>

                <p className="admin-eyebrow">
                  STORE HEALTH
                </p>

                <h2>
                  Overview
                </h2>

              </div>

            </div>

            <div className="health-item">

              <div>

                <span>
                  Products in stock
                </span>

                <strong>
                  {productsInStock} /{" "}
                  {totalProducts}
                </strong>

              </div>

              <div className="health-bar">

                <span
                  style={{
                    width: `${stockPercentage}%`,
                  }}
                />

              </div>

            </div>

            <div className="health-item">

              <div>

                <span>
                  Pending orders
                </span>

                <strong>
                  {pendingOrders.length}
                </strong>

              </div>

              <div className="health-bar">

                <span
                  style={{
                    width: `${pendingPercentage}%`,
                  }}
                />

              </div>

            </div>

            <div className="health-item">

              <div>

                <span>
                  Processing orders
                </span>

                <strong>
                  {processingOrders.length}
                </strong>

              </div>

              <div className="health-bar">

                <span
                  style={{
                    width:
                      totalOrders > 0
                        ? `${
                            (processingOrders.length /
                              totalOrders) *
                            100
                          }%`
                        : "0%",
                  }}
                />

              </div>

            </div>

            <div className="health-item">

              <div>

                <span>
                  Shipped orders
                </span>

                <strong>
                  {shippedOrders.length}
                </strong>

              </div>

              <div className="health-bar">

                <span
                  style={{
                    width:
                      totalOrders > 0
                        ? `${
                            (shippedOrders.length /
                              totalOrders) *
                            100
                          }%`
                        : "0%",
                  }}
                />

              </div>

            </div>

            <div className="health-item">

              <div>

                <span>
                  Delivered orders
                </span>

                <strong>
                  {deliveredOrders.length}
                </strong>

              </div>

              <div className="health-bar">

                <span
                  style={{
                    width: `${deliveredPercentage}%`,
                  }}
                />

              </div>

            </div>

            <div className="health-last-update">

              Dashboard refreshes every
              30 seconds.

            </div>

          </div>

        </section>

        {/* WELCOME */}

        <section className="admin-welcome">

          <div>

            <p className="admin-eyebrow">
              LUXECART OVERVIEW
            </p>

            <h2>
              Welcome to your{" "}
              <span>store.</span>
            </h2>

            <p>
              Manage your products, orders
              and customers from one
              central dashboard.
            </p>

          </div>

          <Link
            to="/admin/products"
            className="admin-primary-button"
          >
            Manage Products →
          </Link>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;