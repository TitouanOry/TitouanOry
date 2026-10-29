import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Configuration Vite : React + Tailwind v4 (plugin officiel, pas de fichier tailwind.config)
// Le mode "artifact" produit un aperçu autonome (chemins relatifs) publiable comme page de prévisualisation
export default defineConfig(({ mode }) => ({
  base: mode === "artifact" ? "./" : "/",
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
}));
