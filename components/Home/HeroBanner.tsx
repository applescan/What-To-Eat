import React from 'react'
import Link from 'next/link'
import Button from 'components/Button'

const HeroBanner: React.FC = () => {

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

                            <Link href={{ pathname: "/get-started" }}>
                                <Button name="Get Started" isTeal={true} /> </Link>

                        </form>
                    </div>
                </div>
                <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
            </section>
        </div>
    )
}

export default HeroBanner