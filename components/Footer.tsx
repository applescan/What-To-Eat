import Image from "next/image";
import Link from "next/link";

import Logo from "../public/logo.png";
import Button from "./Button";

interface NavigationItem {
  href: string;
  id: number;
  name: string;
}

const footerNavs: NavigationItem[] = [
  {
    href: "https://felicia-portfolio.netlify.app/",
    name: "Portfolio",
    id: 1,
  },
  {
    href: "https://nz-locum-network.netlify.app/",
    name: "NZ Veterinary Locum Network",
    id: 2,
  },
  {
    href: "https://mixtape-me.herokuapp.com/",
    name: "Spotify app integration",
    id: 3,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto max-w-7xl px-4 py-10 text-slate-600 md:px-8">
        <div className="space-y-6 sm:mx-auto sm:max-w-md sm:text-center">
          <Image
            className="w-32 sm:mx-auto"
            src={Logo}
            width={120}
            height={50}
            alt="What to eat logo"
          />
          <p>Cook up your perfect dish, with recipes tailored just for you.</p>
          <div className="items-center gap-x-3 space-y-3 sm:flex sm:justify-center sm:space-y-0">
            <Link href={{ pathname: "/get-started" }}>
              <Button name="Get Recipes" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-500">© 2023 Felicia Fel. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-4 text-sm">
            {footerNavs.map((item) => (
              <li key={item.id} className="text-slate-700 transition hover:text-slate-900">
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
