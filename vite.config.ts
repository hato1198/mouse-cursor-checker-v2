import path from "path"
import { defineConfig } from "vite"
import Font from "vite-plugin-font"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    Font.vite({
      scanFiles: ['src/**/*.{vue,js,ts,jsx,tsx}'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
