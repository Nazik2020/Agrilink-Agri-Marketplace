import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000, // ✅ using 3000 as it's the standard dev port
    proxy: {
      '/backend': {
        target: 'http://localhost:80', // Assuming your PHP server runs on port 80
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
