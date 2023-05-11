import { signIn, useSession } from "next-auth/react";
import Loading from "components/Loading";
import Discord from "../../public/discord.png"
import Image from "next/image";
import React from 'react'
import { useRouter } from 'next/router';

const LoginLogout: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <main className="flex flex-col items-center pt-4">
            <Loading></Loading>
        </main>;
    }

    if (session) {
        router.push('/grocery-list');
    }

    return (
        <>
            <div>
                <div className="py-14 px-10 md:px-8 bg-[url('../../public/background-3.png')] bg-cover bg-no-repeat min-h-[65vh]">
                    <div className="max-w-screen-xl mx-auto px-4  text-gray-600 md:px-8">
                        <div className="relative max-w-2xl mx-auto sm:text-center space-y-5 text-center">
                            <h2 className="text-4xl text-gray-700 font-extrabold mx-auto pb-6 md:text-5xl">
                                Create a grocery list from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#14b8a6]" >your favorite recipe</span>✨
                            </h2>
                        </div>
                        <p className="max-w-2xl mx-auto text-gray-800 font-semibold text-center pb-16">
                            Plan your grocery shopping according to your favorite recipes
                        </p>
                        <button
                            type="button"
                            className="mx-auto block rounded-md bg-indigo-600 px-6 py-3 text-center items-center font-bold text-white hover:bg-neutral-700"
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

export default LoginLogout