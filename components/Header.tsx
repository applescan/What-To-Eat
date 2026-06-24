import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, Popover } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import Button from "../components/Button";
import Logo from "public/logo.png";

const navLinks = [
  { href: "/get-started", label: "Search" },
  { href: "/recipes", label: "Recipe Suggestions" },
  { href: "/grocery-list", label: "Favorites & Groceries" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <Image src={Logo} width={120} height={50} alt="What to eat logo" />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <Popover.Group className="hidden lg:flex lg:gap-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </Popover.Group>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session ? (
            <Button
              name="Logout"
              onClick={() => {
                void signOut();
              }}
            />
          ) : (
            <Button
              name="Login"
              onClick={() => {
                void signIn();
              }}
            />
          )}
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10 bg-slate-900/20 backdrop-blur-sm" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-3/4 overflow-y-auto border-l border-slate-200 bg-white px-6 py-6 shadow-2xl sm:max-w-sm">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            {session ? (
              <Button
                name="Logout"
                onClick={() => {
                  void signOut();
                }}
              />
            ) : (
              <Button
                name="Login"
                onClick={() => {
                  void signIn();
                }}
              />
            )}
          </div>

          <div className="mt-12">
            <Image src={Logo} width={120} height={50} alt="What to eat logo" />
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
