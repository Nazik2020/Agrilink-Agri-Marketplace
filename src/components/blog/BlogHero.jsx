import React from 'react';
import Image from '../../assets/blog/blog.jpg';
const ContactHero = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-50 to-green-400 py-40 w-full min-w-screen">
  <div 
    className="absolute inset-0 bg-cover bg-center opacity-20 w-full"
    style={{ backgroundImage: `url(${Image})` }}
  ></div>
  <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-4">
       <div className=" min-w-screen bg-gradient-to-r via-gray-50 p-5">
      Insights and Updates
   </div> </h1>
    <p className="text-base md:text-xl text-gray-700 max-w-2xl">
     Join a trusted platform that connects farmers, sellers, and buyers with ease. At AgriLink, 
     we support your success through reliable service and smooth market access.
    </p>
  </div>
</div>

  );
};

export default ContactHero;