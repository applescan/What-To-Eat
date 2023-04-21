import Image from "next/image";
import Diet from "../../public/dietary.png"
import Kitchen from "../../public/kitchen.png"
import Food from "../../public/food.png"

export default function Diets(): JSX.Element {

    interface StepsItem {
        title: string;
        desc: string;
        src: any;
        alt: string;
    }

    const steps: StepsItem[] = [
        {
            title: "Choose your dietary preferences",
            desc: "We have many dietary options to suit your needs!",
            src: Diet,
            alt: "Dietary icon"

        }, {
            title: "Tell us what you have in your kitchen",
            desc: "Calamary? Lettuce? Banana? Nothing is off limit",
            src: Kitchen,
            alt: "Kitchen icon"

        }, {
            title: "Get reccomendation",
            desc: "No more browsing mindlessly 🔥",
            src: Food,
            alt: "Food icon"

        },
    ]

    return (
        < section className="pb-16 pt-8" >
            <div className="max-w-screen-xl mx-auto px-10 md:px-8">
                <div className="max-w-md">
                    <h1 className="text-gray-700 text-xl font-extrabold sm:text-2xl">Easy Steps</h1>
                    <p className="text-gray-600 mt-2">Get reccomendations in 3 easy steps</p>
                </div>
                <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {
                        steps.map((item, idx) => (
                            <li key={idx} className="border rounded-lg">
                                <div className="flex items-start justify-between p-4">
                                    <div className="space-y-2">
                                        <Image
                                            src={item.src}
                                            width={100}
                                            height={50}
                                            alt={item.alt}
                                        />
                                        <h4 className="text-gray-800 font-semibold">{item.title}</h4>
                                        <p className="text-gray-600 text-sm">{item.desc}</p>
                                    </div>
                                </div>

                            </li>
                        ))
                    }
                </ul>
            </div>
        </section>
    )
}