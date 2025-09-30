import { Home } from "@/pages/Home";
import { useAuth } from "react-oidc-context";
import { Navbar } from "./components/customs/navbar";
import { Footer } from "./components/customs/footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { WormIcon } from "lucide-react";
import { Button } from "./components/ui/button";

export const App = () => {
  const auth = useAuth();

  const navigate = useNavigate();
  // Nettoyer l'URL après login
  useEffect(() => {
    if (auth.isAuthenticated && window.location.search.includes("code=")) {
      window.history.replaceState({}, document.title, "/");
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 text-center px-4">
      <div className="max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
        <WormIcon className="mx-auto h-16 w-16 text-indigo-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Bienvenue sur Cobra Chat !</h1>
        <p className="mt-2 text-gray-600">
          Cobra Chat est un chat global, fun et interactif. Discute avec des utilisateurs du monde entier et partage tes idées
          instantanément !
        </p>
        <p className="mt-2 text-gray-600">Rejoins l’aventure et connecte-toi pour commencer à chatter dès maintenant.</p>

        <Button
          onClick={() => auth.signinRedirect()}
          className="mt-6 w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
        >
          Se connecter
        </Button>
      </div>

      <footer className="mt-8 text-sm text-gray-500">Cobra Chat © 2025 – Amusez-vous en toute sécurité</footer>
    </div>
  );
};
