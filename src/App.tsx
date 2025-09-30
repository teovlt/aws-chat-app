import { Home } from "@/pages/Home";
import { useAuth } from "react-oidc-context";
import { Navbar } from "./components/customs/navbar";
import { Footer } from "./components/customs/footer";

export const App = () => {
  const auth = useAuth();

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
