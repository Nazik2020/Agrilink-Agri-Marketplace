import React from 'react';
import Logo from '../../assets/login/AgriLink.png';
import { Link } from 'react-router-dom';

export default function RightSection() {
  return (
    <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        
        <div className="flex items-center justify-center mb-6">
          <img
            src={Logo}
            alt="Agricultural Marketplace Logo"
            className="h-12 sm:h-16 w-auto"
          />
          <div className="h-12 sm:h-16 border-l border-gray-300 mx-4"></div>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-light text-gray-600">
              Agricultural<br/>Marketplace
            </h2>
          </div>
        </div>
        <div className="bg-gray-100 bg-opacity-30 rounded-lg p-6" style={{
          background: 'rgba(239, 243, 240, 0.06)', 
          backdropFilter: 'blur(10px)',            
          WebkitBackdropFilter: 'blur(10px)',     
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '4px 10px 10px 0 rgba(31, 135, 71, 0.1)'
        }}>
          <div className="text-center mb-6" style={{ paddingTop: '10px ' }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              Welcome Back!
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-green-500">
              Log In
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-4" style={{ padding: '10px 30px 20px 30px' }}>
            <div>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <a href="#" className="text-green-600 text-sm block text-right">
              Forgot Password?
            </a>
            <button type="submit" className="w-full bg-gray-200 text-gray-500 p-2 sm:p-3 rounded-lg  hover:bg-green-600 hover:text-white shadow-lg hover:shadow-xl">
              Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Don't have an account? <Link to ="/Welcoming" className="text-green-600 font-bold">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}