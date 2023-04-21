import React, { useState, useEffect } from 'react';
import RecipeCard from 'components/Form/Cards/RecipeCard';
import Axios from "axios";
import Snackbar from 'components/Snackbar';
import Link from 'next/link';

type FormData = {
    dietary: string;
    ingredients: string;
    pantry: string;
};

type Recipe = {
    id: number;
    title: string;
    img: string;
    href: string;
};

export default function Recipes() {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [diet, setDiet] = useState<FormData>({
        dietary: "",
        ingredients: "",
        pantry: ""
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Retrieve form data from local storage
        let formValues: FormData | any = null;

        if (typeof window !== 'undefined') {
            const formDataString = localStorage.getItem('formValues');
            if (formDataString) {
                formValues = JSON.parse(formDataString);
            }
        }

        // Update dietary requirement text
        const dietaryText = formValues.dietary == " " ? "No dietary requirement" : formValues.dietary;
        setDiet({ ...formValues, dietary: dietaryText });

        // Make API call to Spoonacular
        const fetchRecipes = async () => {
            const res = await Axios.get(
                `https://api.spoonacular.com/recipes/complexSearch?query=${formValues.ingredients}&cuisine=${formValues.dietary}&diet=${formValues.pantry}&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&number=9`
            );


            // Handle unauthorized access error (402)
            if (res.status === 402) {
                setSnackbarOpen(true);
                setError("Daily quota reached. Please try again tomorrow!")
                return;
            }

            // Extract recipe data from response
            const recipes = res.data.results.map((recipe: any) => ({
                id: recipe.id,
                title: recipe.title,
                img: recipe.image,
                href: `/recipes/${recipe.id}`
            }));

            // Set recipe data in state
            setRecipes(recipes);

            // Show Snackbar if no recipes found
            if (recipes.length === 0) {
                setSnackbarOpen(true);
                setError("No recipes found. Maybe try a different ingredients? 💭")
            }
        };

        fetchRecipes();

    }, []);


    return (
        <div className="py-14 px-10 md:px-8 bg-[url('../../public/background-3.png')] bg-contain bg-no-repeat">
            <div className="max-w-screen-xl mx-auto px-4  text-gray-600 md:px-8">
                <div className="relative max-w-2xl mx-auto sm:text-center">
                    <div className="space-y-5 max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl text-gray-700 font-extrabold mx-auto pb-14 md:text-5xl">
                            Here is delicious recipes suggestion based on your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#14b8a6]" >dietary preferences</span>
                        </h2>

                    </div>
                    <div className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px]" style={{ background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)" }}></div>
                </div>
                {diet && (
                    <div className='py-3 text-center lg:flex xs:inline justify-center'>
                        <p className="px-2 py-1 font-bold text-lg">Dietary:</p> <p className="px-2 py-1 text-lg font-bold rounded text-white bg-indigo-400 inline">{diet.dietary}</p>
                        <p className="px-2 py-1 font-bold text-lg">Ingredients:</p> <p className="px-2 py-1 text-lg font-bold rounded text-white bg-teal-400 inline">{diet.ingredients}</p>
                    </div>
                )}
                <div>
                    {snackbarOpen && (
                        <Snackbar message={error} link='/get-started' />
                    )}
                </div>
                <div className="my-12 flex justify-center">
                    <ul className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                title={recipe.title}
                                img={recipe.img}
                                href={recipe.href}
                            />
                        ))}
                    </ul>
                </div>

            </div>
            <div className='pt-10'>
                <Link className="mx-auto flex justify-center gap-x-2 py-2 px-10 w-full text-sm text-white font-medium bg-teal-400 hover:bg-teal-500 active:bg-teal-600 duration-150 rounded-lg sm:mt-0 sm:w-1/4" href={{ pathname: "/get-started" }}>
                    Back </Link>
            </div>
        </div>
    )
}




