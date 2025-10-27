import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        landing: resolve(__dirname, "src/pages/landing.html"),
        countdown: resolve(__dirname, "src/pages/countdown.html"),
      },
    },
  },
  server: {
    port: 4173,
  },
});
