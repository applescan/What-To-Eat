import Axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import RecipeCard from "components/Cards/RecipeCard";
import Loading from "components/Loading";
import Snackbar from "components/Snackbar";
import { api } from "../../src/utils/api";
import {
  RECIPE_QUESTIONNAIRE_STORAGE_KEY,
  type RecipeQuestionnaireProfile,
  type SearchRecipeResult,
  buildRecipeSearchVariants,
  createRecipeQuestionnaireProfile,
  getCuisineLabel,
  getDietaryLabel,
  getMealTypeLabel,
  getPantryLabel,
  scoreRecipeForProfile,
} from "../utils/recipeQuestionnaire";

type LegacyFormData = {
  dietary: string;
  ingredients: string;
  pantry: boolean | string | null;
};

type Recipe = SearchRecipeResult & {
  href: string;
  ingredientMatchLabel: string;
};

type ComplexSearchResponse = {
  results: SearchRecipeResult[];
};

const buildIngredientMatchLabel = (
  recipe: SearchRecipeResult,
  profile: RecipeQuestionnaireProfile,
) => {
  if (!profile.ingredients.length || !recipe.usedIngredientCount) {
    return "";
  }

  return recipe.usedIngredientCount === 1
    ? "1 ingredient match"
    : `${recipe.usedIngredientCount} ingredient matches`;
};

const mapLegacyFormData = (formData: LegacyFormData) =>
  createRecipeQuestionnaireProfile({
    prompt: "",
    dietary: formData.dietary || "any",
    ingredients: formData.ingredients || "",
    avoidIngredients: "",
    cuisine: "any",
    mealType: "any",
    maxReadyTime: "",
    pantrySupport: formData.pantry === true ? "ingredients-only" : "pantry-ok",
  });

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [profile, setProfile] = useState<RecipeQuestionnaireProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState("");
  const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([]);
  const utils = api.useContext();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRecipes = async (nextProfile: RecipeQuestionnaireProfile) => {
      setIsLoading(true);
      setSnackbarOpen(false);
      setError("");

      try {
        const responses = await Promise.allSettled(
          buildRecipeSearchVariants(nextProfile).map((params) =>
            Axios.get<ComplexSearchResponse>(
              `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`,
            ),
          ),
        );

        const didSucceed = responses.some((response) => response.status === "fulfilled");
        if (!didSucceed) {
          throw new Error("Recipe search failed");
        }

        const merged = new Map<number, SearchRecipeResult>();

        responses.forEach((response) => {
          if (response.status !== "fulfilled") {
            return;
          }

          const results = response.value.data.results;
          results.forEach((recipe) => {
            const existing = merged.get(recipe.id);
            merged.set(recipe.id, { ...existing, ...recipe });
          });
        });

        const rankedRecipes = Array.from(merged.values())
          .sort(
            (left, right) =>
              scoreRecipeForProfile(right, nextProfile) -
              scoreRecipeForProfile(left, nextProfile),
          )
          .map((recipe) => ({
            ...recipe,
            href: `/${recipe.id}`,
            ingredientMatchLabel: buildIngredientMatchLabel(recipe, nextProfile),
          }));

        setRecipes(rankedRecipes);

        if (rankedRecipes.length === 0) {
          setSnackbarOpen(true);
          setError("No recipes matched that request. Try fewer restrictions or different ingredients.");
        }
      } catch (fetchError) {
        console.error(fetchError);
        setRecipes([]);
        setSnackbarOpen(true);
        setError("Recipe search is unavailable right now. Check your API quota and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window === "undefined") {
      return;
    }

    const storedProfile = localStorage.getItem(RECIPE_QUESTIONNAIRE_STORAGE_KEY);
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile) as RecipeQuestionnaireProfile;
        setProfile(parsedProfile);
        void fetchRecipes(parsedProfile);
        return;
      } catch (storageError) {
        console.error(storageError);
      }
    }

    const legacyFormData = localStorage.getItem("formValues");
    if (legacyFormData) {
      try {
        const parsedLegacyData = JSON.parse(legacyFormData) as LegacyFormData;
        const nextProfile = mapLegacyFormData(parsedLegacyData);
        setProfile(nextProfile);
        void fetchRecipes(nextProfile);
        return;
      } catch (storageError) {
        console.error(storageError);
      }
    }

    setSnackbarOpen(true);
    setError("Start with the questionnaire first so I know what recipes to look for.");
  }, []);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      if (!session?.user) {
        setFavoriteRecipes([]);
        return;
      }

      try {
        const response = await utils.favorites.getAll.fetch();
        const favoritesIds = response?.map((favorite) => favorite.id) ?? [];
        const recipeIds = recipes.map((recipe) => recipe.id);
        setFavoriteRecipes(recipeIds.filter((id) => favoritesIds.includes(id)));
      } catch (favoritesError) {
        console.error(favoritesError);
      }
    };

    void fetchFavoriteRecipes();
  }, [recipes, session?.user, utils.favorites.getAll]);

  const handleFavoriteClick = (id: number) => {
    setFavoriteRecipes((previous) =>
      previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id],
    );
  };

  const summaryTags = profile
    ? [
      getDietaryLabel(profile.dietary),
      getCuisineLabel(profile.cuisine),
      getMealTypeLabel(profile.mealType),
      getPantryLabel(profile.pantrySupport),
      profile.maxReadyTime ? `Under ${profile.maxReadyTime} min` : "Any cook time",
    ]
    : [];

  return (
    <div className="app-page">
      <div className="mx-auto max-w-6xl">
        <section className="app-panel-soft overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-8 sm:px-8">
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Recipe matches
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Personalized recipe suggestions built around your pantry, your preferences, and the kind of meal you feel like making.
            </p>

            { profile ? (
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  { summaryTags.map((tag) => (
                    <span
                      key={ tag }
                      className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white"
                    >
                      { tag }
                    </span>
                  )) }
                  { profile.detectedTags
                    .filter((tag) => !summaryTags.includes(tag))
                    .slice(0, 4)
                    .map((tag) => (
                      <span
                        key={ tag }
                        className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"
                      >
                        { tag }
                      </span>
                    )) }
                </div>

                { profile.ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    { profile.ingredients.slice(0, 10).map((ingredient) => (
                      <span
                        key={ ingredient }
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                      >
                        { ingredient }
                      </span>
                    )) }
                  </div>
                ) : null }
              </div>
            ) : null }
          </div>

          <div className="px-6 py-8 sm:px-8">
            { snackbarOpen ? <Snackbar message={ error } link="/get-started" /> : null }

            { isLoading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loading />
              </div>
            ) : recipes.length > 0 ? (
              <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                { recipes.map((recipe) => (
                  <RecipeCard
                    key={ recipe.id }
                    id={ recipe.id }
                    title={ recipe.title }
                    img={ recipe.image }
                    href={ recipe.href }
                    isFavorited={ favoriteRecipes.includes(recipe.id) }
                    onFavoriteClick={ handleFavoriteClick }
                    readyInMinutes={ recipe.readyInMinutes }
                    cuisines={ recipe.cuisines }
                    ingredientMatchLabel={ recipe.ingredientMatchLabel }
                  />
                )) }
              </ul>
            ) : !snackbarOpen ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                No recipes to show yet.
              </div>
            ) : null }
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            href="/get-started"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to questionnaire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
