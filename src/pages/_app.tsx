import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Header from 'components/Header'
import Footer from 'components/Footer'

import { api } from "~/utils/api";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Header></Header>
      <title>What to Eat - A Recipe Recommendation Engine</title>
      <meta name="google-site-verification" content="05TP2khEkfynfrDrUulbuRogUrTIRmHnh8aGuuor-Us" />
      <Component {...pageProps} />
      <Footer></Footer>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
