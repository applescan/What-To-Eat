import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

//local imports
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
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header></Header>
        <title>What to Eat - A Recipe Recommendation Engine</title>
        <main className="app-shell flex-1">
          <Component {...pageProps} />
        </main>
        <Footer></Footer>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
