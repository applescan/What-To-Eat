import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";

//local imports
import { api } from "../../src/utils/api";
import FavoriteButton from 'components/FavoriteButton';
import AddToGroceryButton from 'components/AddToGroceryButton';
import LetCookButton from 'components/LetsCookButton';
import STATUS from 'components/_constants';

interface RecipeCardProps {
  id: number;
  title: string;
  img: string;
  href: string;
  extendedIngredients: {
    name: string;
    image: string;
    amount: number;
    unit: string;
  }[];
  isFavorited: boolean;
  onFavoriteClick: (id: number) => void;
}

const GroceryCard: React.FC<RecipeCardProps> = ({ id, img, title, href, isFavorited, extendedIngredients, onFavoriteClick }) => {
  const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);
  const { data: session, status } = useSession();
  const utils = api.useContext();

  useEffect(() => {
    setIsFavoritedState(isFavorited);
  }, [isFavorited]);

  const handleFavoriteClick = async () => {
    onFavoriteClick(id);
    if (status === STATUS.AUTHENTICATE) {
      try {
        if (isFavoritedState) {
          const data = await removeFavorite.mutate({
            id,
          });
          //console.log("remove favorite recipe response:", data);
          setIsFavoritedState(false);
        } else {
          const data = await addFavorites.mutate({
            id,
            title,
          });
          //console.log("add favorite recipe response:", data);
          setIsFavoritedState(true);
        }
      } catch (error) {
        //console.log("favorite recipe error:", error);
      }
    } else {
      signIn();
    }
  };


  const handleGroceryClick = async () => {

    const groceryList = extendedIngredients.map((ingredient) => ({
      title: `${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`
    }));

    for (const groceryItem of groceryList) {
      postMessage.mutate(groceryItem, {
        onSuccess: () => {
          // console.log("Added grocery item to the list successfully");
        },
        onError: (error) => {
          // console.error("Failed to add grocery item to the list:", error);
        },
      });
    }
  };


  const addFavorites = api.favorites.addFavorites.useMutation({
    onMutate: async (newEntry) => {
      await utils.favorites.getAll.cancel();
    },
    onSuccess: (data) => {
      //console.log("add favorite recipe response:", data);
      setIsFavoritedState(true);
    },
    onError: (error) => {
      //console.log("add favorite recipe error:", error);
    },
  });

  const removeFavorite = api.favorites.deleteOne.useMutation({
    onMutate: async (newEntry) => {
      await utils.favorites.getAll.cancel();
    },
    onSuccess: (data) => {
      //console.log("remove favorite recipe response:", data);
      setIsFavoritedState(false);
    },
    onError: (error) => {
      //console.log("remove favorite recipe error:", error);
    },
  });

  const postMessage = api.grocery.postMessage.useMutation({
    onMutate: async (newEntry) => {
      try {
        await utils.grocery.getAll.cancel();
        utils.grocery.getAll.setData(undefined, (prevEntries: any) => {
          if (prevEntries) {
            return [
              {
                userId: session?.user.id,
                title: newEntry.title,
              },
              ...prevEntries,
            ];
          }
          return [
            {
              userId: session?.user.id,
              title: newEntry.title,
            },
          ];
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    if (postMessage.isSuccess) {
      utils.grocery.getAll.fetch(); // Perform the getAll call
    }
  }, [postMessage.isSuccess, utils.grocery.getAll]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_60px_-42px_rgba(15,23,42,0.55)]">
      <div className="relative">
        <Image
          src={img}
          height={800}
          width={800}
          loading="lazy"
          alt={title}
          className="h-60 w-full object-cover object-center"
        />
        <div className="absolute right-4 top-4 rounded-full bg-white/95 p-2 shadow-lg">
          <FavoriteButton
            isFavorited={isFavoritedState}
            handleFavoriteClick={handleFavoriteClick}
          />
        </div>
      </div>
      <div className="flex min-h-[320px] flex-1 flex-col p-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Saved recipe
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              {extendedIngredients.length} ingredients
            </span>
          </div>

          <h2 className="break-words text-2xl font-black tracking-tight text-slate-900">
            {title}
          </h2>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ingredients
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {extendedIngredients.map((ingredient, idx) => (
                <li
                  key={`${ingredient.name}-${idx}`}
                  className="flex flex-wrap gap-x-2 gap-y-1 border-b border-slate-200/80 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="font-semibold text-slate-900">{ingredient.name}</span>
                  <span>
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <AddToGroceryButton handleGroceryClick={handleGroceryClick} />
          <LetCookButton href={href} />
        </div>
      </div>
    </div >
  );
}

export default GroceryCard;
