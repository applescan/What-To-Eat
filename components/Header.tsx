import React from 'react'
import Image from 'next/image';
import Logo from "public/logo.png"
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession();

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/">
            <Image src={Logo} width={120} height={50} alt="What to eat logo" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(true)}>
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link href={{ pathname: '/recipes' }} className="flex items-center justify-center px-6 text-gray-700 font-medium hover:text-indigo-500 active:text-indigo-600 rounded-lg md:inline-flex">
            Recipe Suggestions
          </Link>
          <Link href={{ pathname: '/grocery-list' }} className="flex items-center justify-center px-6 text-gray-700 font-medium hover:text-indigo-500 active:text-indigo-600 rounded-lg md:inline-flex">
            Favorites & Groceries
          </Link>
        </Popover.Group>
        {session ? (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button className="flex items-center justify-center py-3 px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg md:inline-flex" onClick={() => signOut()}>
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button className="flex items-center justify-center py-3 px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg md:inline-flex" onClick={() => signIn()}>
              Login
            </button>
          </div>
        )}
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-3/4 overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-2xl">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href={{ pathname: "/recipes" }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Recipe suggestions
                </Link>
                <Link
                  href={{ pathname: "/grocery-list" }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  My groceries
                </Link>
              </div>
              {session ? (
                <div className="py-6">
                  <button
                    className="flex items-center justify-center py-3 px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg md:inline-flex"
                    onClick={() => signOut()}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <button
                    className="flex items-center justify-center py-3 px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg md:inline-flex"
                    onClick={() => signIn()}>
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 right-0 mr-6 mb-6">
            <Image
              src={Logo}
              width={120}
              height={50}
              alt="Your image"
            />
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}


