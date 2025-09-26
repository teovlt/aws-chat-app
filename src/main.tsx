import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from "./App";
import "./lib/i18n";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <HashRouter>
        <App />
        <Toaster />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
