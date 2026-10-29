import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Configuration Vite : React + Tailwind v4 (plugin officiel, pas de fichier tailwind.config)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
});
