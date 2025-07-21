import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";

// Pages
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Blog from "./pages/Blog";
import BlogDetail from "./components/blog/BlogDetail";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import ProductDetails from "./pages/ProductDetails";
import Aboutus from "./pages/Aboutus";
import Welcoming from "./pages/Welcoming";
import CinnamonTea from "./components/blog/BlogContents/CinnamonTea"; // ✅ Added
import Spice from "./components/blog/BlogContents/Spice"; // ✅ Added
import Sustainability from "./components/blog/BlogContents/Sustainability"; // ✅ Added
import Tomato from "./components/blog/BlogContents/Tomato"; // ✅ Added
import SamplePosts from "./components/blog/SamplePosts";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/cinnamon-tea" element={<CinnamonTea />} /> {/* ✅ Specific Route First */}
          <Route path="/blog/spice" element={<Spice />} /> {/* ✅ Specific Route First */}
          <Route path="/blog/sustainability" element={<Sustainability />} /> {/* ✅ Specific Route First */}
          <Route path="/blog/tomato" element={<Tomato />} /> {/* ✅ Specific Route First */}
          <Route path="/blog/:id" element={<BlogDetail />} /> {/* ✅ Dynamic Route After Specific Routes */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/Welcoming" element={<Welcoming />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
