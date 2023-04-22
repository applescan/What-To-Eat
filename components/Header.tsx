import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from "public/logo.png"
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [state, setState] = useState<boolean>(false);
  const { data: session, status } = useSession();

  // Replace / paths with your paths
  interface NavigationItem {
    title: string;
    path: string;
  }

  const navigation: NavigationItem[] = [
    // { title: "Today's Recipe", path: "/today-recipe" }
  ];

  useEffect(() => {
    document.onclick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-btn')) setState(false);
    };
  }, []);

  return (
    <nav className="bg-white w-full border-b">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:px-8">
        <div className="py-3">
          <div className='flex justify-between'>
            <Link href="/">
              <Image
                src={Logo}
                width={120}
                height={50}
                alt="What to eat logo"
              />
            </Link>
            {session ? (
              <div className="flex">
                <Link
                  href={{ pathname: "/login" }}
                  className="flex items-center justify-center px-6 text-gray-700 font-medium hover:text-indigo-500 active:text-indigo-600 rounded-lg md:inline-flex">
                  My groceries
                </Link>
                <button
                  className="flex items-center justify-center px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg md:inline-flex"
                  onClick={() => signOut()}>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href={{ pathname: "/login" }}
                className="flex items-center justify-center px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg md:inline-flex">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}



