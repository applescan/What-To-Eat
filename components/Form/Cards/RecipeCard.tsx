import React from 'react';
import Image from 'next/image';

interface RecipeCardProps {
    title: string;
    img: string;
    href: string;
}


const RecipeCard: React.FC<RecipeCardProps> = ({ title, img, href }) => {
    return (
        <div className="max-w-xs rounded-md shadow-md bg-indigo-50 ">
            <div className='flex justify-center rounded-xl'>
                <Image src={img}
                    height={800}
                    width={800}
                    loading="lazy"
                    alt={title}
                    className="object-cover object-center w-ful h-56 border-8 border-indigo-50" />
            </div>
            <div className="flex flex-col justify-between p-6 space-y-8">
                <div className="space-y-2">
                    <span className="block text-sm pb-2 font-medium tracking-widest uppercase text-indigo-400">Recipe</span>
                    <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
                </div>
                <a href={href} className="text-white block rounded-lg text-center font-medium leading-6 px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] hover:bg-teal-400 hover:text-white">Lets Cook 🍳</a>
            </div>
        </div>
    );
}

export default RecipeCard;


