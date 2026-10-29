import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router";
import App from "./App";
import "./index.css";

// En aperçu (mode "artifact"), l'URL de la page ne peut pas changer : la navigation reste en mémoire
const Router = import.meta.env.MODE === "artifact" ? MemoryRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
