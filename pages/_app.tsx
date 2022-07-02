import type { AppProps } from "next/app";
import Navigation from "./navigation";
import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider loginUrl="http://localhost:3000">
      <Navigation />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
