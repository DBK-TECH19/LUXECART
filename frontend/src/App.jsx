import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AdminLogin from "./admin/AdminLogin";
import AdminSettings from "./admin/AdminSettings";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";
import MyOrders from "./pages/MyOrders";
import DeliveryTracking from "./pages/DeliveryTracking";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import AdminMessages from "./admin/AdminMessages";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import PaymentCallback from "./pages/PaymentCallback";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";
import { CartProvider } from "./context/CartContext";
import AdminTestimonials from "./admin/AdminTestimonials";
import "./App.css";

function AppContent() {
  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/admin-login";

  return (
    <>
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* STORE */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
  path="/payment-callback"
  element={<PaymentCallback />}
/>

        {/* DELIVERY TRACKING */}
        <Route
          path="/track-order/:id"
          element={<DeliveryTracking />}
        />

        {/* CUSTOMER AUTHENTICATION */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/my-orders"
  element={<MyOrders />}
/>

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
  path="/admin/testimonials"
  element={<AdminTestimonials />}
/>
        <Route
  path="/admin/messages"
  element={<AdminMessages />}
/>

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/customers"
          element={<AdminCustomers />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />
        <Route
  path="/contact"
  element={<Contact />}
/>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <StoreSettingsProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </StoreSettingsProvider>
  );
}

export default App;