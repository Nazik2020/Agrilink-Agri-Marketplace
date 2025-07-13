import { Route, Routes } from "react-router";
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

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/Welcoming" element={<Welcoming />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/CustomerSignup" element={<CustomerSignupPage />} />
            <Route path="/SellerSignup" element={<SellerSignupPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
