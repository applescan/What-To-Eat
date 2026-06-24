import React, { FC } from "react";
import Link from "next/link";

interface LetCookButtonProps {
    href: string;
}

const LetCookButton: FC<LetCookButtonProps> = ({ href }) => {
    return (
        <Link
            href={`/recipes${href}`}
            className="block rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
        >
            Let&apos;s cook
        </Link >
    );
};

export default LetCookButton;
