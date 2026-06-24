import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

import FavoriteButton from "components/FavoriteButton";
import LetCookButton from "components/LetsCookButton";
import STATUS from "components/_constants";
import { api } from "../../src/utils/api";

interface RecipeCardProps {
  id: number;
  title: string;
  img: string;
  href: string;
  isFavorited: boolean;
  onFavoriteClick: (id: number) => void;
  readyInMinutes?: number;
  cuisines?: string[];
  ingredientMatchLabel?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  img,
  href,
  isFavorited,
  onFavoriteClick,
  readyInMinutes,
  cuisines,
  ingredientMatchLabel,
}) => {
  const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);
  const { status } = useSession();
  const utils = api.useContext();

  useEffect(() => {
    setIsFavoritedState(isFavorited);
  }, [isFavorited]);

  const addFavorites = api.favorites.addFavorites.useMutation({
    onMutate: async () => {
      await utils.favorites.getAll.cancel();
    },
    onSuccess: () => {
      setIsFavoritedState(true);
    },
    onError: (error) => {
      console.error(error);
      setIsFavoritedState(false);
    },
  });

  const removeFavorite = api.favorites.deleteOne.useMutation({
    onMutate: async () => {
      await utils.favorites.getAll.cancel();
    },
    onSuccess: () => {
      setIsFavoritedState(false);
    },
    onError: (error) => {
      console.error(error);
      setIsFavoritedState(true);
    },
  });

  const handleFavoriteClick = () => {
    if (status !== STATUS.AUTHENTICATE) {
      void signIn();
      return;
    }

    onFavoriteClick(id);
    const mutation = isFavoritedState
      ? removeFavorite.mutateAsync({ id })
      : addFavorites.mutateAsync({ id, title });

    void mutation.catch((error) => {
      console.error(error);
      onFavoriteClick(id);
    });
  };

  const badges = [
    readyInMinutes ? `${readyInMinutes} min` : "",
    cuisines?.[0] ?? "",
    ingredientMatchLabel ?? "",
  ].filter(Boolean);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_60px_-42px_rgba(15,23,42,0.55)]">
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

      <div className="flex h-[240px] flex-col justify-between p-6">
        <div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
              >
                {badge}
              </span>
            ))}
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{title}</h2>
        </div>

        <LetCookButton href={href} />
      </div>
    </div>
  );
};

export default RecipeCard;
