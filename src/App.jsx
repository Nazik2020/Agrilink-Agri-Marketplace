import { Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import Navbar from "./components/common/Navbar"; //"./components/common/Navbar";
//import Hero from "./components/Hero";

import { CartProvider } from "./components/cart/CartContext";
import { WishlistProvider } from "./components/wishlist/WishlistContext";
import CartModal from "./components/cart/CartModal";
import authService from "./services/AuthService";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import ProductDetails from "./pages/ProductDetails";
import Aboutus from "./pages/Aboutus";
import Welcoming from "./pages/Welcoming";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/AdminDashboard";
import BlogDetail from "./components/blog/BlogDetail";
import CustomerSignup from "./pages/CustomerSignup";
import SellerSignup from "./pages/SellerSignup";
import AdminDashboard from "./components/AdminDashboard/Dashboard";
// Seller Dashboard
import SellerDashboard from "./pages/SellerDashboard";
import ProfilePage from "./components/SellerDashboard/SellerProfile/ProfilePage";
import AddProductPage from "./components/SellerDashboard/AddProduct/AddProductPage";
import AnalyticsPage from "./components/SellerDashboard/Analytics/AnalyticsPage";
import WalletPage from "./components/SellerDashboard/Wallet/WalletPage";
import NotificationsPage from "./components/SellerDashboard/Notifications/NotificationsPage";
import MyStorePage from "./components/SellerDashboard/Mystore/MyStorePage"; 

// Customer Dashboard
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfilePage from "./components/CustomerDashboard/CustomerProfile/CustomerProfilePage";
import WishlistPage from "./components/CustomerDashboard/CustomerWishlist/WishlistPage";
import OrderHistoryPage from "./components/CustomerDashboard/CustomerOrderHistory/OrderHistoryPage";
import CustomerNotificationsPage from "./components/CustomerDashboard/CustomerNotifications/NotificationsPage";
import CustomizedProducts from "./pages/CustomizedProducts";
import CustomizedProductsSection from "./components/RequestCustomization/CustomizedProductsSection";
import Logout from "./pages/Logout";

function App() {
  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    const run = async () => {
      // Respect logout guard: if set, skip immediate auth check to avoid flicker
      try {
        const flag = sessionStorage.getItem('logout_in_progress');
        if (flag) {
          const ts = parseInt(flag, 10);
          const ageMs = Date.now() - (Number.isFinite(ts) ? ts : 0);
          if (!Number.isNaN(ageMs) && ageMs < 5000) return;
        }
      } catch (_) {}
      authService.checkAuthStatus();
    };
    run();
  }, []);

  // Check if we are in seller or customer dashboard
  const hideNavbar =
    location.pathname.startsWith("/seller-dashboard") ||
    location.pathname.startsWith("/customer-dashboard") ||
    location.pathname.startsWith("/admin-dashboard");

  return (
    <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {!hideNavbar && <Navbar />}
          {!hideNavbar && <CartModal />}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/Welcoming" element={<Welcoming />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/CustomerSignup" element={<CustomerSignup />} />
              <Route path="/SellerSignup" element={<SellerSignup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/customized-products" element={<CustomizedProducts />} />
              <Route path="/logout" element={<Logout />} />

              {/* Seller Dashboard with nested routes */}
              <Route path="/seller-dashboard" element={<SellerDashboard />}>
                <Route index element={<ProfilePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="add-product" element={<AddProductPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="my-store" element={<MyStorePage />} /> 
              </Route>

              {/* Customer Dashboard Routes */}
              <Route path="/customer-dashboard" element={<CustomerDashboard />}>
                <Route index element={<CustomerProfilePage />} />
                <Route path="profile" element={<CustomerProfilePage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="orders" element={<OrderHistoryPage />} />
                <Route path="customized-products" element={<CustomizedProductsSection customerId={sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).id : null} />} />
                <Route
                  path="notifications"
                  element={<CustomerNotificationsPage />}
                />
              </Route>
            </Routes>
          </main>
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
