import React, { useState } from 'react';
import Image from 'next/image';
import { FiHeart } from 'react-icons/fi';
import { signIn, useSession } from "next-auth/react";
import { api } from "../../../src/utils/api";

interface RecipeCardProps {
    id: number;
    title: string;
    img: string;
    href: string;
    isFavorited: boolean;
    onFavoriteClick: Function;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ id, title, img, href, isFavorited, onFavoriteClick }) => {
    const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);
    const { data: session, status } = useSession();
    const utils = api.useContext();

    const handleFavoriteClick = async () => {
        onFavoriteClick(id);
        if (status === "authenticated") {
            try {
                if (isFavoritedState) {
                    const data = await removeFavorite.mutate({
                        id,
                    });
                    console.log("remove favorite recipe response:", data);
                    setIsFavoritedState(false);
                } else {
                    const data = await addFavorites.mutate({
                        id,
                        title,
                    });
                    console.log("add favorite recipe response:", data);
                    setIsFavoritedState(true);
                }
            } catch (error) {
                console.log("favorite recipe error:", error);
            }
        } else {
            signIn();
        }
    };

    const addFavorites = api.favorites.addFavorites.useMutation({
        onMutate: async (newEntry) => {
            await utils.favorites.getAll.cancel();
        },
        onSuccess: (data) => {
            console.log("add favorite recipe response:", data);
            setIsFavoritedState(true);
        },
        onError: (error) => {
            console.log("add favorite recipe error:", error);
        },
    });

    const removeFavorite = api.favorites.deleteOne.useMutation({
        onMutate: async (newEntry) => {
            await utils.favorites.getAll.cancel();
        },
        onSuccess: (data) => {
            console.log("remove favorite recipe response:", data);
            setIsFavoritedState(false);
        },
        onError: (error) => {
            console.log("remove favorite recipe error:", error);
        },
    });



    return (
        <div className="max-w-xs rounded-md shadow-md bg-indigo-50 ">
            <div className="flex justify-center rounded-xl">
                <Image
                    src={img}
                    height={800}
                    width={800}
                    loading="lazy"
                    alt={title}
                    className="object-cover object-center w-ful h-56 border-8 border-indigo-50"
                />
            </div>
            <div className="flex flex-col justify-between p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <span className="block text-sm pb-2 font-medium tracking-widest uppercase text-indigo-400">
                            Recipe
                        </span>
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold tracking-wide pr-6">
                                {title}
                            </h2>
                            <button
                                onClick={handleFavoriteClick}
                                className="text-red-400 hover:text-red-600"
                                aria-label="Add to favorites"
                            >
                                <FiHeart
                                    size={24}
                                    fill={isFavorited ? 'red' : 'none'}
                                    stroke="currentColor"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <a
                    href={href}
                    className="text-white block rounded-lg text-center font-medium leading-6 px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] hover:bg-teal-400 hover:text-white"
                >
                    Let's Cook 🍳</a>
            </div>
        </div>
    );
}

export default RecipeCard;



