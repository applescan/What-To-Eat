import React from "react";
import Link from "next/link";

import Button from "components/Button";

const HeroBanner: React.FC = () => {
  return (
    <div className="bg-green-50 bg-[url('../../public/background.gif')] bg-cover">
      <section className="relative">
        <div className="relative z-10 mx-auto max-w-screen-xl px-10 py-28 md:px-8">
          <div className="mx-auto max-w-4xl space-y-5 text-center">
            <h2 className="mx-auto text-4xl font-extrabold text-gray-700 md:text-5xl">
              <span className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] bg-clip-text text-6xl text-transparent">
                What to eat?
              </span>
              <br />
              Find Your Next Meal with Us
            </h2>

            <p className="mx-auto max-w-2xl font-semibold text-gray-800">
              Personalized recipes for your plate, based on what you have and love to
              taste!
            </p>

            <div className="flex items-center justify-center gap-x-3">
              <Link href={{ pathname: "/get-started" }}>
                <Button name="Get Started" isTeal />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 m-auto h-[357px] max-w-xs blur-[118px] sm:max-w-md md:max-w-lg"
          style={{
            background:
              "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        />
      </section>
    </div>
  );
};

export default HeroBanner;
