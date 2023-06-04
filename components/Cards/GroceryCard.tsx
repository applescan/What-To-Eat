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
  onFavoriteClick: Function;
}

const GroceryCard: React.FC<RecipeCardProps> = ({ id, img, title, href, isFavorited, extendedIngredients, onFavoriteClick }) => {
  const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);
  const { data: session, status } = useSession();
  const utils = api.useContext();

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
    <div className="max-w-m rounded-md shadow-md bg-indigo-50 ">
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
              <h2 className="text-xl font-semibold tracking-wide pr-6 flex-1">
                {title}
              </h2>
              <div className="flex items-center">
                <FavoriteButton
                  isFavorited={isFavorited}
                  handleFavoriteClick={handleFavoriteClick}
                />
              </div>
            </div>

            <br></br>
            <div>
              <span className="block text-sm pb-2 font-medium tracking-widest uppercase text-indigo-400">
                Ingredients
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extendedIngredients.map((ingredient: any, idx) => (
                  <div key={idx}>
                    <span className="text-small font-semibold">{ingredient.name}:</span>
                    <span className="text-base font-bold"> {ingredient.amount} {ingredient.unit}</span>
                  </div>
                )).reduce((rows: any, element: any, idx: number) => {
                  return (idx % 5 === 0) ? [...rows, [element]] : [...rows.slice(0, -1), [...rows.slice(-1)[0], element]];
                }, []).map((row: any, idx: number) => (
                  <ul key={idx}>
                    {row.map((element: any, idx: number) => (
                      <li key={idx}>{element}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
        <AddToGroceryButton handleGroceryClick={handleGroceryClick} />
        <LetCookButton href={href} />
      </div>
    </div >
  );
}

export default GroceryCard;
