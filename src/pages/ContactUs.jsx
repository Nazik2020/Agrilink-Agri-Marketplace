import React from "react";
import Navbar from "../components/common/Navbar";
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";  
import Footer from "../components/common/Footer";
const ContactUs = () => {
  return (
    <div className="flex flex-col items-start max-w-3xl gap-5">
     <Navbar />
      <ContactHero />
      <ContactInfo />
      <Footer />
    </div>
  );
};

export default ContactUs;

