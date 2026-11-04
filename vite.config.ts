import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative asset paths work on both GitHub project pages and a future custom domain.
  base: "./",
  plugins: [react(), tailwindcss()],
});
