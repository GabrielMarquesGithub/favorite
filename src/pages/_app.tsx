import "../../styles/globals.scss";
import type { AppProps } from "next/app";
import Navigation from "./navigation";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
