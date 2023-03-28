import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FacebookProvider } from "react-facebook";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <FacebookProvider appId={process.env.FACEBOOK_CLIENT_ID!}>
        <Component {...pageProps} />
      </FacebookProvider>
    </>
  );
}

type AppPropsWithLayout = MyAppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  const Layout = Layouts[Component.Layout] ?? ((page) => page);

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <FacebookProvider appId={process.env.FACEBOOK_CLIENT_ID!}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
	 	  </FacebookProvider>
    </SessionProvider>
  );
}
