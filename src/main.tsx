import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from "./App";
import "./lib/i18n";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_eGUA8bz6s",
  client_id: "5c3m5pbhagf094ms0jnrvkbpa",
  redirect_uri: "https://s3-cobra-web.s3.eu-west-1.amazonaws.com/index.html",
  response_type: "code",
  scope: "openid profile email phone",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <HashRouter>
        <AuthProvider {...cognitoAuthConfig}>
          <App />
        </AuthProvider>
        <Toaster />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
