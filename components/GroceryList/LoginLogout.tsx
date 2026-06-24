import React from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

//local imports
import Loading from "components/Loading";
import Discord from "../../public/discord.png";
import Image from "next/image";

const LoginLogout: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <main className="flex flex-col items-center pt-4">
        <Loading></Loading>
      </main>
    );
  }

  if (session) {
    router.push("/grocery-list");
  }

  return (
    <>
      <div className="app-page">
        <div className="app-panel min-h-[65vh] px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-screen-xl px-4  text-gray-600 md:px-8">
            <div className="relative mx-auto max-w-2xl space-y-5 text-center sm:text-center">
              <h2 className="mx-auto pb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
                Create a grocery list from{" "}
                <span className="text-emerald-600">
                  your favorite recipe
                </span>
              </h2>
            </div>
            <p className="mx-auto max-w-2xl pb-16 text-center font-semibold text-slate-700">
              Plan your grocery shopping according to your favorite recipes
            </p>
            <button
              type="button"
              className="mx-auto block items-center rounded-lg bg-slate-900 px-6 py-3 text-center font-bold text-white transition hover:bg-slate-800"
              onClick={() => {
                signIn("discord").catch(console.log);
              }}
            >
              <Image
                className="w-32 sm:mx-auto"
                src={Discord}
                width={150}
                height={50}
                alt="What to eat logo"
              />
              Login with Discord
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginLogout;
