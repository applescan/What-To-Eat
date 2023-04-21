import React from 'react'
import Link from 'next/link'

export default function HeroBanner() {
    return (
        <div className="bg-green-50 bg-[url('../../public/background.gif')] bg-cover ">
            <section className="relative">
                <div className="relative z-10 max-w-screen-xl mx-auto px-10 py-28 md:px-8">
                    <div className="space-y-5 max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl text-gray-700 font-extrabold mx-auto md:text-5xl">
                            <span className="text-transparent text-6xl bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"> What to eat? </span>
                            <br></br>Find Your Next Meal with Us
                        </h2>
                        <br></br>
                        <p className="max-w-2xl mx-auto text-gray-800 font-semibold">
                        Personalized recipes for your plate, based on what you have and love to taste!
                        </p>
                        <br></br>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="justify-center items-center gap-x-3 sm:flex">

                            <button className="flex items-center justify-center gap-x-2 py-2.5 px-4 mt-3 w-full text-sm text-white font-medium bg-teal-500 hover:bg-teal-400 active:bg-teal-600 duration-150 rounded-lg sm:mt-0 sm:w-auto">
                                <Link href={{ pathname: "/get-started" }}>
                                    Get Started </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                                </svg>
                            </button>

                        </form>
                    </div>
                </div>
                <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
            </section>
        </div>
    )
}
