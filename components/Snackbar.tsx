import Link from "next/link";
import React, { FC } from "react";

type SnackbarProps = {
  message: string;
  link: string;
};

const Snackbar: FC<SnackbarProps> = ({ message, link }) => {
  return (
    <div className="mb-8 flex items-start gap-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
      <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 114 4.5 8 8 0 0118 10zm-8.75-3.25a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7.5a.875.875 0 100 1.75.875.875 0 000-1.75z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <div className="flex-1">
        <p className="text-sm leading-6">{message}</p>
        <Link className="mt-2 inline-flex text-sm font-semibold underline underline-offset-4" href={link}>
          Go back
        </Link>
      </div>
    </div>
  );
};

export default Snackbar;
