import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/Faq";
import ProductDetails from "./pages/ProductDetails";
import Aboutus from "./pages/Aboutus";
import Welcoming from "./pages/Welcoming";
import Login from "./pages/Login";
import CustomerSignupPage from "./components/signupCustomer/CustomerSignupPage";
import SellerSignupPage from "./components/signupSeller/SellerSignupPage";

// Seller Dashboard
import SellerDashboard from "./pages/SellerDashboard";
import ProfilePage from "./components/SellerDashboard/SellerProfile/ProfilePage";
import AddProductPage from "./components/SellerDashboard/AddProduct/AddProductPage";
import AnalyticsPage from "./components/SellerDashboard/Analytics/AnalyticsPage";
import WalletPage from "./components/SellerDashboard/Wallet/WalletPage";
import NotificationsPage from "./components/SellerDashboard/Notifications/NotificationsPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/Welcoming" element={<Welcoming />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CustomerSignup" element={<CustomerSignupPage />} />
          <Route path="/SellerSignup" element={<SellerSignupPage />} />

          {/* Seller Dashboard with nested routes */}
          <Route path="/seller-dashboard" element={<SellerDashboard />}>
            <Route index element={<ProfilePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
