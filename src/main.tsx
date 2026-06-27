import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent("sw-update-ready", { detail: reg }));
            }
          });
        });
        // verifica atualização a cada foco na aba
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update();
        });
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorSchemeScript />
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
