const API_BASE = "/api";

/**
 * Send an event to backend
 */
async function sendEvent(type, details = {}) {
  try {
    await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        page: details.page || window.location.pathname, // ensure page is always sent
        details,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || null,
      }),
    });
  } catch (err) {
    console.error("Tracking failed:", err);
  }
}

/**
 * Initialize automatic tracking for page views, clicks, and time on page
 */
export const initTracker = () => {
  const page = window.location.pathname;

  // Skip tracking on analytics page
  if (page === "/analytics") return;

  // --- Log page view ---
  sendEvent("page_view", {
    page,
    url: window.location.href,
    referrer: document.referrer,
  });

  // --- Log all button or link clicks ---
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, a");
    if (target) {
      sendEvent("click", {
        page,
        tag: target.tagName,
        text: target.innerText?.trim() || "(no text)",
        href: target.href || null,
      });
    }
  });

  // --- Log time spent before leaving ---
  const start = Date.now();
  window.addEventListener("beforeunload", () => {
    const duration = Date.now() - start;
    sendEvent("time_on_page", {
      page,
      duration,
    });
  });
};


