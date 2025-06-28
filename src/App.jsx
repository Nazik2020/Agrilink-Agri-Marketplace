import { Route, Routes } from "react-router";
import Navbar from "./components/common/Navbar"; //"./components/common/Navbar";
//import Hero from "./components/Hero";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/marketplace" element={<Marketplace />} />

            <Route path="/faq" element={<Faq />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
