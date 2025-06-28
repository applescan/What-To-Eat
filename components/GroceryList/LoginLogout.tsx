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
      <div>
        <div className="min-h-[65vh] bg-[url('../../public/background-3.png')] bg-cover bg-no-repeat px-10 py-14 md:px-8">
          <div className="mx-auto max-w-screen-xl px-4  text-gray-600 md:px-8">
            <div className="relative mx-auto max-w-2xl space-y-5 text-center sm:text-center">
              <h2 className="mx-auto pb-6 text-4xl font-extrabold text-gray-700 md:text-5xl">
                Create a grocery list from{" "}
                <span className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">
                  your favorite recipe
                </span>
                ✨
              </h2>
            </div>
            <p className="mx-auto max-w-2xl pb-16 text-center font-semibold text-gray-800">
              Plan your grocery shopping according to your favorite recipes
            </p>
            <button
              type="button"
              className="mx-auto block items-center rounded-md bg-indigo-600 px-6 py-3 text-center font-bold text-white hover:bg-neutral-700"
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
