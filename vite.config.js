import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Detect environment (local vs Render)
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: !isProduction
      ? {
          "/api": {
            target: "http://localhost:5001", // local backend
            changeOrigin: true,
          },
        }
      : undefined, // No proxy in production
  },
});
