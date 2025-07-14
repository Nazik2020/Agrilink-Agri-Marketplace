import React, { useState } from 'react';
//import Sidebar from '../MainSidebar/Sidebar';
import AddProductForm from './AddProductForm';

const AddProductPage = () => {
  const [product, setProduct] = useState({
    productName: '',
    productDescription: '',
    price: '',
    specialOffer: '',
  });

  const handleProductChange = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  const handleFileUpload = (file) => {
    console.log('Product image uploaded:', file.name);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/*<Sidebar />*/}
      <div className="flex-1 p-6">
        <AddProductForm 
          product={product} 
          onChange={handleProductChange} 
          onUpload={handleFileUpload} 
        />
      </div>
    </div>
  );
};

export default AddProductPage;