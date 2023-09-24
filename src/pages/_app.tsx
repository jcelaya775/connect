import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FacebookProvider } from "react-facebook";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <FacebookProvider appId={process.env.FACEBOOK_CLIENT_ID!}>
        <Component {...pageProps} />
      </FacebookProvider>
    </>
  );
}
