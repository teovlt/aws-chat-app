import { Home } from "@/pages/Home";
import { useAuth } from "react-oidc-context";
import { Navbar } from "./components/customs/navbar";
import { Footer } from "./components/customs/footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const App = () => {
  const auth = useAuth();

  const navigate = useNavigate();
  // Nettoyer l'URL après login
  useEffect(() => {
    if (auth.isAuthenticated && window.location.search.includes("code=")) {
      navigate("/", { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
};
