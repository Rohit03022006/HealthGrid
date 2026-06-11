import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    react(),
    tailwindcss(),
    babel({
      presets: [reactCompilerPreset()],
    }),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
        type: "module",
      },

      includeAssets: ["icons/*.png"],

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:5000\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300,
              },
            },
          },

          {
            urlPattern: /\.(?:js|css|html|png|svg|ico)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 86400,
              },
            },
          },
        ],
      },

      manifest: {
        name: "HealthGrid OPD",
        short_name: "HealthGrid",
        description: "Hospital OPD Management System",
        theme_color: "#1447e6",
        background_color: "#0A0F1E",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});