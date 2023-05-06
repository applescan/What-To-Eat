import { GetStaticProps, GetStaticPaths } from 'next';
import Axios from "axios";
import Link from "next/link";
import Image from 'next/image';
import Loading from 'components/Loading';
import { useState, useEffect } from 'react';
import Snackbar from 'components/Snackbar';
import { FiHeart } from 'react-icons/fi';
import { signIn, useSession } from "next-auth/react";
import { api } from "../../../src/utils/api";

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

interface RecipePageProps {
    recipe: RecipeProps
}


export const getStaticPaths: GetStaticPaths = async () => {
    // Fetch recipe IDs
    const res = await Axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&number=9`
    );

    const recipeIds = res.data.results.map((recipe: any) => recipe.id);

    // Generate paths for each recipe ID
    const paths = recipeIds.map((id: number) => ({ params: { id: id.toString() } }));

    return {
        paths,
        fallback: true,
    };
}

export const getStaticProps: GetStaticProps<RecipePageProps, { id: string }> = async ({ params }) => {
    try {
        // Fetch recipe details using the provided ID
        const res = await Axios.get(
            `https://api.spoonacular.com/recipes/${params!.id}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
        );

        const recipe: RecipeProps = {
            id: res.data.id,
            title: res.data.title,
            image: res.data.image,
            servings: res.data.servings,
            readyInMinutes: res.data.readyInMinutes,
            aggregateLikes: res.data.aggregateLikes,
            healthScore: res.data.healthScore,
            analyzedInstructions: res.data.analyzedInstructions,
            cuisines: res.data.cuisines,
            diets: res.data.diets,
            instructions: res.data.instructions,
            extendedIngredients: res.data.extendedIngredients,
        };

        return {
            props: {
                recipe,
            },
            revalidate: 1,
        };
    } catch (error) {
        console.error(error);

        return {
            notFound: true,
        };
    }
};


const RecipePage = ({ recipe }: RecipePageProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [error, setError] = useState('');
    const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([]);
    const [isFavoritedState, setIsFavoritedState] = useState(false);
    const { data: session, status } = useSession();
    const utils = api.useContext();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make the API call here
            } catch (error) {
                console.error(error);

                setSnackbarOpen(true);
                setError("Daily quota has been reached, please come back tomorrow!");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchFavoriteRecipes = async () => {
            try {
                if (session?.user) {
                    const response = await utils.favorites.getAll.fetch();
                    const favoritesIds = response?.map((favorite) => favorite.id);

                    console.log("User's favorite recipes:", favoritesIds);

                    // Check if the recipe is among the user's favorite recipes
                    const isFavorited = favoritesIds?.includes(recipe.id);
                    setIsFavoritedState(isFavorited ?? false);

                } else {
                    setIsFavoritedState(false);
                }
            } catch (error) {
                console.log("Error fetching favorites", error);
            }
        };

        fetchFavoriteRecipes();
        console.log(isFavoritedState);
    }, [session, recipe?.id]); // Include recipe.id as a dependency to re-run the effect when it changes





    const handleFavoriteClick = async () => {
        if (status === "authenticated") {
            try {
                if (isFavoritedState) {
                    const data = await removeFavorite.mutate({
                        id: recipe.id,
                    });
                    console.log("remove favorite recipe response:", data);
                    setIsFavoritedState(false);
                } else {
                    const data = await addFavorites.mutate({
                        id: recipe.id,
                        title: recipe.title,
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


    if (!recipe) {
        return (
            <div className="flex h-screen justify-center items-center">
                <Loading></Loading>
            </div>
        );
    }

    return (
        <>
            {error ? (
                <div className="px-40 py-40 h-screen justify-center items-center">
                    {snackbarOpen && (
                        <Snackbar message={error} link='/' />
                    )}
                </div>
            ) : (
                <div className="bg-[url('../../public/background-4.png')] bg-contain bg-no-repeat">
                    <div className="max-w-2xl py-16 mx-auto space-y-12 px-10 md:px-8">
                        <article className="space-y-8">
                            <div className="space-y-6">
                                <h1 className=" text-4xl text-gray-700 font-extrabold mx-auto md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#14b8a6]" >{recipe?.title}</h1>
                                <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center">
                                    <div className="block items-center">
                                        <p className="text-base font-semibold">Servings: <span className="text-base font-bold">{recipe?.servings}</span></p>
                                        <p className="text-base font-semibold">Health Score: <span className="text-base font-bold">{recipe?.healthScore}</span> </p>
                                    </div>
                                    <p className="flex-shrink-0 mt-3 text-base font-semibold">Ready in Minutes: <span className="text-base font-bold">{recipe?.readyInMinutes}</span></p>
                                </div>
                            </div>
                            <Image src={recipe?.image}
                                height={400}
                                width={1000}
                                loading="lazy"
                                alt={recipe?.title}
                                className="object-cover object-center w-ful rounded-3xl items-center mx-auto" />
                        </article>
                        <div>

                            <div>
                                {recipe?.diets?.length > 0 && (
                                    <div className="flex flex-wrap py-6 space-x-2">
                                        <p className="text-base font-semibold">Diets:</p>
                                        <ul className="ml-4 space-y-1 list-disc inline">
                                            {recipe?.diets.map((diet: any, idx) => (
                                                <li className="px-3 py-1 mx-1 rounded-lg bg-indigo-400 text-white font-semibold text-base inline" key={idx}>{diet}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                {recipe?.cuisines?.length > 0 && (
                                    <div className="flex flex-wrap py-6 space-x-2">
                                        <p className="text-base font-semibold">Cuisines:</p>
                                        <ul className="ml-4 space-y-1 list-disc inline">
                                            {recipe?.cuisines.map((cuisine: any, idx) => (
                                                <li className="px-3 py-1 mx-1 rounded-lg bg-teal-400 text-white font-semibold text-base inline" key={idx}>{cuisine}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {!isFavoritedState ? (
                                <button
                                    className="flex items-center justify-center py-1 my-6 px-4 text-white font-medium bg-orange-300 hover:bg-orange-400  rounded-lg md:inline-flex"
                                    onClick={handleFavoriteClick}>
                                    Add to favorite 💖
                                </button>
                            ) : (
                                <button
                                    className="flex items-center justify-center py-1 my-6 px-4 text-white font-medium bg-orange-300 hover:bg-orange-400 rounded-lg md:inline-flex"
                                    onClick={handleFavoriteClick}>
                                    Remove from favorite 💔
                                </button>
                            )}
                            <div className="border-t border-dashed space-y-2 py-10">
                                {recipe?.extendedIngredients && (
                                    <>
                                        <h4 className="text-lg font-semibold">Ingredients:</h4>
                                        <ul className="ml-4 space-y-1 list-disc">
                                            {recipe?.extendedIngredients.map((ingredient: any, idx) => (
                                                <li key={idx}><span className="text-base font-semibold">{ingredient.name}:</span> <span className="text-base font-bold"> {ingredient.amount} {ingredient.unit}</span></li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-dashed space-y-2 pt-10">
                                {recipe?.analyzedInstructions?.length > 0 && (
                                    <>
                                        <h4 className="text-lg font-semibold">Instructions:</h4>
                                        <ul className="ml-4 space-y-1 list-disc">
                                            {recipe?.analyzedInstructions[0]?.steps.map((step: any, idx) => (
                                                <li key={idx}>{step.step}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className='my-12 px-10'>
                        <Link className="mx-auto flex justify-center gap-x-2 py-2 px-10 w-full text-sm text-white font-medium bg-teal-400 hover:bg-teal-500 active:bg-teal-600 duration-150 rounded-lg sm:mt-0 sm:w-1/4" href={{ pathname: "/recipes" }}>
                            Back </Link>
                    </div>
                </div>
            )} </>
    );

}

export default RecipePage;

