// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

registerSW({
  immediate: true,
  onRegistered(registration) {
    console.log("PWA registered:", registration);
  },
  onRegisterError(error) {
    console.error("PWA register error:", error);
  },
});