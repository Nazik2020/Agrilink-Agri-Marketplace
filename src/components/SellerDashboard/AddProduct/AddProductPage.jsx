import React, { useState } from "react";
//import Sidebar from '../MainSidebar/Sidebar';
import AddProductForm from "./AddProductForm";

const AddProductPage = () => {
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    price: "",
    specialOffer: "",
    stock: 1, // Default to 1 so stock is never undefined
    category: ""
  });

  const handleProductChange = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  const handleFileUpload = (file) => {
    console.log("Product image uploaded:", file.name);
  };

  // Get sellerId from sessionStorage (or your auth context)
  const sellerId = sessionStorage.getItem("seller_id");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/*<Sidebar />*/}
      <div className="flex-1 p-6">
        <AddProductForm
          product={product}
          onChange={handleProductChange}
          onUpload={handleFileUpload}
          sellerId={sellerId}
        />
      </div>
    </div>
  );
};

export default AddProductPage;
