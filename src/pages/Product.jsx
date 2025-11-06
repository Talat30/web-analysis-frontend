import React from "react";

export default function Product() {
  const handleClick = () => {
    alert("Product added to cart!");
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          🛍️ Products Page
        </h1>
        <p className="text-gray-300 text-lg">
          Discover our amazing products and interact to generate analytics data!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-200">
          <h3 className="text-xl font-semibold mb-2">Premium Widget</h3>
          <p className="text-gray-300 mb-4">The best widget money can buy</p>
          <button
            onClick={handleClick}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-200">
          <h3 className="text-xl font-semibold mb-2">Super Gadget</h3>
          <p className="text-gray-300 mb-4">Revolutionary technology</p>
          <button
            onClick={() => {
              alert("Gadget added to cart!");
            }}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-200">
          <h3 className="text-xl font-semibold mb-2">Mega Tool</h3>
          <p className="text-gray-300 mb-4">Professional grade equipment</p>
          <button
            onClick={() => {
              alert("Tool added to cart!");
            }}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
