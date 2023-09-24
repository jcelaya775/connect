import "../styles/globals.css";
import { MyAppProps } from "../components/types";
import { Layouts } from "../components/Layouts";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FacebookProvider } from "react-facebook";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = MyAppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) {
  const Layout = Layouts[Component.Layout] ?? ((page) => page);

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <QueryClientProvider client={queryClient}>
        <FacebookProvider appId={process.env.FACEBOOK_CLIENT_ID!}>
          <Layout>
            <Component {...pageProps} />
            <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
          </Layout>
        </FacebookProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
