import Link from 'next/link';
import React, { FC } from 'react';

type SnackbarProps = {
    message: string;
    link: string;
};

const Snackbar: FC<SnackbarProps> = ({ message, link }) => {
    return (
        <div className="flex flex-row pl-4 my-28 py-2 gap-2 items-center border rounded-lg shadow overflow-hidden border-indigo-400">
            <span className="flex-shrink-0 inline-flex mx-3 item-center justify-center leading-none rounded-full bg-teal-400 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-8 w-8">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
            </span>
            <div className="flex-1 p-2">
                <p className="text-sm dark:text-gray-100">{message}</p>
                <Link className="text-sm font-bold underline text-indigo-400" href={link}>Go back</Link>
            </div>
        </div>
    );
};

export default Snackbar;

