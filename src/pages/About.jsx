import React from "react";

export default function About() {

  return (
    <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          ℹ️ About Us
        </h1>
        <p className="text-gray-300 text-lg">
          Learn more about our web analytics platform and how we track user interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">📊 Real-time Analytics</h3>
            <p className="text-gray-300">
              Track page visits, user interactions, and time spent on each page in real-time.
              Our system captures every click, scroll, and navigation event.
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-green-400">🎯 Event Tracking</h3>
            <p className="text-gray-300">
              Custom event tracking allows you to monitor specific user actions like button clicks,
              form submissions, and product interactions.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-400">📈 Data Visualization</h3>
            <p className="text-gray-300">
              Beautiful dashboards with charts and tables showing your website's performance
              metrics and user behavior patterns.
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-orange-400">🔧 Developer Friendly</h3>
            <p className="text-gray-300">
              Easy-to-use API endpoints and React components make it simple to integrate
              analytics tracking into any web application.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Navigate through the pages and interact with elements to see analytics data being generated!
        </p>
      </div>
    </div>
  );
}
