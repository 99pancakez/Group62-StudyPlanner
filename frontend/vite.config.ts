import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // keep parity with the old CRA dev server in startfrontlayer.bat
    // leave open to change, but not silent-swap ports on conflicts
    strictPort: true,
  },
  build: {
    outDir: "dist", // Vite default, called out here because CRA used 'build/'
    sourcemap: true, // matches CRA build behavior
  },
  // no proxy needed — the app calls http://localhost:3000 directly across origins
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
