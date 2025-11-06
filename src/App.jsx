import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { initTracker } from "./utils/tracker";
import Home from "./pages/Home";
import Product from "./pages/Product";
import About from "./pages/About";
import Analytics from "./pages/Analytics";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

/* ---------------- Page Time Tracker Hook ---------------- */
function usePageTimer() {
  const location = useLocation();
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const prevPage = sessionStorage.getItem("currentPage");
    const now = Date.now();
    const timeSpent = (now - startTime) / 1000;

    // Skip sending time spent data for analytics page
    if (prevPage && prevPage !== "/analytics" && timeSpent > 0.5) {
      fetch(`${API_BASE}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: prevPage, timeSpent }),
      }).catch((e) => console.error("Error sending duration:", e));
    }

    sessionStorage.setItem("currentPage", location.pathname);
    setStartTime(now);
  }, [location]);
}



/* ---------------- Wrapper for Router Context ---------------- */
function PageTrackerWrapper() {
  usePageTimer();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/about" element={<About />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

/* ---------------- Main App ---------------- */
function App() {
  const [type, setType] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    initTracker();
    sessionStorage.setItem("currentPage", window.location.pathname);
  }, []);

  const sendEvent = async () => {
    if (!type.trim()) return alert("Please enter an event type!");
    try {
      await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          details: { data },
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          referrer: document.referrer || null,
        }),
      });
      setType("");
      setData("");
      alert("Event sent successfully!");
    } catch (err) {
      alert("Failed to send event — check backend connection!");
      console.error(err);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              📈 Big Data Web Analytics
            </h1>
            <p className="text-gray-300 text-lg">Track user interactions and page analytics in real-time</p>
          </header>

          <nav className="flex justify-center space-x-6 mb-8">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-white font-medium"
            >
              🏠 Home
            </Link>
            <Link
              to="/products"
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-white font-medium"
            >
              🛍️ Products
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-white font-medium"
            >
              ℹ️ About
            </Link>
            <Link
              to="/analytics"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors duration-200 text-white font-medium"
            >
              📊 Analytics
            </Link>
          </nav>

          

          <PageTrackerWrapper />
        </div>
      </div>
    </Router>
  );
}

export default App;
