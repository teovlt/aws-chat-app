import { Home } from "@/pages/Home";
import { useAuth } from "react-oidc-context";

export const App = () => {
  const auth = useAuth();

  // const signOutRedirect = () => {
  //   const clientId = "5c3m5pbhagf094ms0jnrvkbpa";
  //   const logoutUri = "https://s3-cobra-web.s3.eu-west-1.amazonaws.com/index.html";
  //   const cognitoDomain = "https://eu-west-1egua8bz6s.auth.eu-west-1.amazoncognito.com";
  //   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  // };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return <Home />;
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
};
