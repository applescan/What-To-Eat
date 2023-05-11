import React, { FC } from 'react';
import Link from 'next/link';

interface LetCookButtonProps {
    href: string;
}

const LetCookButton: FC<LetCookButtonProps> = ({ href }) => {
    return (
        <Link
            href={`/recipes${href}`}
            className="text-white block rounded-lg text-center font-medium leading-6 px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] hover:bg-teal-400 hover:text-white"
        >
            Let's Cook 🍳
        </Link >
    );
};

export default LetCookButton;
