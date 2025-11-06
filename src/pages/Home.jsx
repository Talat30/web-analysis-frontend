// -import React, { useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
 
 export default function Home() {
  const navigate = useNavigate();

   const handleClick = () => {
    navigate("/products");
   };
  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg text-center">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to the Web Analytics Dashboard
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Navigate through different pages to generate analytics data. Your interactions are being tracked in real-time!
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleClick}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🚀 Explore Products
        </button>
        <p className="text-sm text-gray-400">
          Click to trigger an event and see it in the analytics!
        </p>
      </div>
    </div>
  );
}
