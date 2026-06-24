import Axios from "axios";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Image from "next/image";

//local import
import Loading from "components/Loading";
import AddList from "../../components/GroceryList/AddList";
import Discord from "../../public/discord.png";
import GroceryCard from "../../components/Cards/GroceryCard";
import { api } from "../../src/utils/api";
import Snackbar from "components/Snackbar";

interface RecipeProps {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        name: string;
        image: string;
      }[];
    }[];
  }[];
  cuisines: string[];
  diets: string[];
  instructions: string;
  extendedIngredients: {
    name: string;
    image: string;
    amount: number;
    unit: string;
  }[];
}

const GroceryPage: React.FC = () => {
  const { data: session } = useSession();
  const utils = api.useContext();
  const [error, setError] = useState<string | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([]);
  const [favoriteRecipesDetails, setFavoriteRecipesDetails] = useState<
    RecipeProps[]
  >([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Fetch favorite recipe IDs
        const response = await utils.favorites.getAll.fetch();
        const favoritesIds = response?.map((favorite) => favorite.id);
        setFavoriteRecipes(favoritesIds ?? []);
      } catch (error) {
        console.error(error);
        //console.log("Error fetching favorites:", error);
        // Handle the error here or set a default value for favoriteRecipes
        setFavoriteRecipes([]);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const recipeDetailsPromises = favoriteRecipes.map((id) =>
        Axios.get<RecipeProps>(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`,
          {
            params: {
              apiKey: process.env.SPOONACULAR_API_KEY,
            },
          }
        )
          .then((response) => response.data)
          .catch((error) => {
            if (error.response?.status === 402) {
              setSnackbarOpen(true);
              setError(
                "Daily quota has been reached, please come back tomorrow!"
              );
            } else {
              setSnackbarOpen(true);
              setError("An error occurred while fetching the recipe details.");
            }
            return null;
          })
      );

      try {
        const recipeDetailsResponses = await Promise.all(recipeDetailsPromises);
        const recipeDetails = recipeDetailsResponses.filter(
          (response) => response !== null
        );
        setFavoriteRecipesDetails(recipeDetails as RecipeProps[]);
      } catch (error) {
        console.error(error);
        //console.log("Error fetching recipe details:", error);
        setFavoriteRecipesDetails([]);
      }
    };

    if (favoriteRecipes.length > 0) {
      fetchRecipeDetails();
    }
  }, [favoriteRecipes]);

  const getAll = async () => {
    try {
      const response = await utils.favorites.getAll.fetch();
      const favoritesIds = response?.map((favorite) => favorite.id);
      setFavoriteRecipes(favoritesIds ?? []);
    } catch (error) {
      console.error(error);
      setFavoriteRecipes([]);
    }
  };

  const handleFavoriteClick = async (id: number) => {
    if (favoriteRecipes.includes(id)) {
      // Remove recipe from favorites if already favorited
      const newFavorites = favoriteRecipes.filter(
        (favorite) => favorite !== id
      );
      setFavoriteRecipes(newFavorites);
      // Delete recipe from favorites in the database
      try {
        await api.favorites.deleteOne.useMutation();
        getAll(); // Update the list immediately
      } catch (error) {
        //console.log("Error deleting favorite", error);
        console.error(error);
      }
    } else {
      // Add recipe to favorites if not already favorited
      const newFavorites = [...favoriteRecipes, id];
      setFavoriteRecipes(newFavorites);
      // Save recipe as favorite in the database
      try {
        await api.favorites.addFavorites.useMutation();
        getAll(); // Update the list immediately
      } catch (error) {
        console.error(error);
        //console.log("Error adding favorite", error);
      }
    }
  };

  return (
    <>
      {error ? (
        <div className="app-page min-h-[60vh]">
          {snackbarOpen && <Snackbar message={error} link="/" />}
        </div>
      ) : session ? (
        <div className="app-page">
          <div className="app-panel min-h-[65vh] px-6 py-10 sm:px-10">
            <div className="mx-auto max-w-screen-2xl px-4 text-gray-600 md:px-8">
              <div className="relative mx-auto max-w-5xl space-y-5 text-center sm:text-center">
                <h2 className="mx-auto pb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
                  Welcome to your grocery list,{" "}
                  <span className="text-emerald-600">
                    {session.user?.name}
                  </span>
                </h2>
              </div>
              <p className="mx-auto max-w-2xl pb-6 text-center text-lg font-semibold text-slate-700">
                Get started by typing your list here
              </p>
              <div className="mx-auto max-w-2xl items-center">
                <AddList />
              </div>

              <br></br>

              <p className="mx-auto py-12 text-center text-xl font-semibold text-slate-700">
                or add groceries from{" "}
                <span className="text-emerald-600">
                  your favorites recipes!
                </span>
              </p>

              <br></br>

              {favoriteRecipesDetails.length > 0 ? (
                <ul className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteRecipesDetails.map((recipe) => (
                    <GroceryCard
                      key={recipe.id}
                      id={recipe.id}
                      title={recipe.title}
                      img={recipe.image}
                      href={`/${recipe.id}`}
                      extendedIngredients={recipe.extendedIngredients}
                      isFavorited={favoriteRecipes.includes(recipe.id)}
                      onFavoriteClick={handleFavoriteClick}
                    />
                  ))}
                </ul>
              ) : favoriteRecipesDetails.length === 0 ? (
                <p className="py-6 text-center text-slate-600">
                  You don't have any favorite recipes yet 😓 Please add some
                  from your recommendations.
                </p>
              ) : (
                <div className="mx-auto flex items-center">
                  <Loading />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="app-page">
          <div className="app-panel min-h-[65vh] px-6 py-10 sm:px-10">
            <div className="mx-auto max-w-screen-xl px-4  text-gray-600 md:px-8">
              <div className="relative mx-auto max-w-2xl space-y-5 text-center sm:text-center">
                <h2 className="mx-auto pb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
                  Create a grocery list from{" "}
                  <span className="text-emerald-600">
                    your favorite recipe
                  </span>
                </h2>
              </div>
              <p className="mx-auto max-w-2xl pb-16 text-center font-semibold text-slate-700">
                Plan your grocery shopping according to your favorite recipes
              </p>
              <button
                type="button"
                className="mx-auto block items-center rounded-lg bg-slate-900 px-6 py-3 text-center font-bold text-white transition hover:bg-slate-800"
                onClick={() => {
                  signIn("discord").catch(console.log);
                }}
              >
                <Image
                  className="w-32 sm:mx-auto"
                  src={Discord}
                  width={150}
                  height={50}
                  alt="What to eat logo"
                />
                Login with Discord
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroceryPage;
