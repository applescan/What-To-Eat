import Image, { StaticImageData } from "next/image";

import Diet from "../../public/dietary.png";
import Food from "../../public/food.png";
import Kitchen from "../../public/kitchen.png";

interface StepsItem {
  alt: string;
  desc: string;
  src: StaticImageData;
  title: string;
}

const steps: StepsItem[] = [
  {
    title: "Choose your dietary preferences",
    desc: "Pick the dietary filter that fits how you eat.",
    src: Diet,
    alt: "Dietary icon",
  },
  {
    title: "Tell us what you have in your kitchen",
    desc: "List ingredients or describe your meal in simple language.",
    src: Kitchen,
    alt: "Kitchen icon",
  },
  {
    title: "Get recipe recommendations",
    desc: "See recipe ideas that match your ingredients and your intent.",
    src: Food,
    alt: "Food icon",
  },
];

const Diets: React.FC = () => {
  return (
    <section className="app-page pt-0">
      <div className="mb-8 max-w-xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">How it works</h2>
        <p className="mt-2 text-base text-slate-600">Get recommendations in three simple steps.</p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((item) => (
          <li key={item.title} className="app-panel p-6">
            <Image src={item.src} width={96} height={56} alt={item.alt} />
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Diets;
