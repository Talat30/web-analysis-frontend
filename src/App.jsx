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

// ✅ Use environment variable from .env
const API_BASE = import.meta.env.VITE_API_URL || "https://web-analysis-backend-server.onrender.com";



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
      }).catch((e) => console.error("⚠️ Error sending duration:", e));
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
  const [backendStatus, setBackendStatus] = useState("checking"); // ✅ For status indicator

  useEffect(() => {
    initTracker();
    sessionStorage.setItem("currentPage", window.location.pathname);

    // ✅ Check backend connection on startup
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE.replace(/\/api$/, "")}/`);
        if (res.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch {
        setBackendStatus("offline");
      }
    };
    checkBackend();
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
      alert("✅ Event sent successfully!");
    } catch (err) {
      alert("❌ Failed to send event — check backend connection!");
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
            <p className="text-gray-300 text-lg">
              Track user interactions and page analytics in real-time
            </p>

            {/* ✅ Backend connection status indicator */}
            <div className="mt-4">
              {backendStatus === "checking" && (
                <span className="text-yellow-400">⏳ Checking backend...</span>
              )}
              {backendStatus === "online" && (
                <span className="text-green-400">🟢 Backend Connected</span>
              )}
              {backendStatus === "offline" && (
                <span className="text-red-400">🔴 Backend Offline</span>
              )}
            </div>
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

          {/* ✅ Optional: quick event sender (for manual testing) */}
          <div className="mt-10 bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-3">Send Custom Event</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Event type (e.g. button_click)"
                className="p-2 rounded-md text-black flex-1"
              />
              <input
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Event data (optional)"
                className="p-2 rounded-md text-black flex-1"
              />
              <button
                onClick={sendEvent}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold"
              >
                🚀 Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
