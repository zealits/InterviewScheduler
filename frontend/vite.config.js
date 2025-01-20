import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Set to false if using self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Rewrite URL if needed
      },
    },
  },
});
