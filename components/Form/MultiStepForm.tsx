import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Steps from "./Steps";
import {
    DIETARY_OPTIONS,
    RECIPE_QUESTIONNAIRE_STORAGE_KEY,
    type PantrySupport,
    createRecipeQuestionnaireProfile,
} from "../../src/utils/recipeQuestionnaire";

const STEPS = ["Dietary", "Ingredients", "Pantry"];

const INPUT_CLASSNAME =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const SELECT_CLASSNAME =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-base font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100";

const BUTTON_CLASSNAME =
    "rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800";

const SECONDARY_BUTTON_CLASSNAME =
    "rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

type QuestionnaireFormState = {
    dietary: string;
    ingredients: string;
    pantrySupport: PantrySupport | "";
};

const initialValues: QuestionnaireFormState = {
    dietary: "",
    ingredients: "",
    pantrySupport: "",
};

const pantryOptions: Array<{
    description: string;
    title: string;
    value: PantrySupport;
}> = [
        {
            value: "ingredients-only",
            title: "Only use what I have",
            description: "Keep suggestions close to the ingredients I listed.",
        },
        {
            value: "pantry-ok",
            title: "Pantry staples are okay",
            description: "Basic oils, spices, flour, and similar staples can help.",
        },
    ];

const MultiStepForm: React.FC = () => {
    const [formValues, setFormValues] = useState<QuestionnaireFormState>(initialValues);
    const [step, setStep] = useState(1);
    const [validationMessage, setValidationMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        setValidationMessage("");
    }, [step]);

    const profile = createRecipeQuestionnaireProfile({
        prompt: formValues.ingredients,
        dietary: formValues.dietary || "any",
        ingredients: formValues.ingredients,
        avoidIngredients: "",
        cuisine: "any",
        mealType: "any",
        maxReadyTime: "",
        pantrySupport: formValues.pantrySupport || "pantry-ok",
    });

    const updateField = <Key extends keyof QuestionnaireFormState>(
        name: Key,
        value: QuestionnaireFormState[Key],
    ) => {
        setValidationMessage("");
        setFormValues((previous) => ({ ...previous, [name]: value }));
    };

    const getStepValidationMessage = (currentStep: number) => {
        if (currentStep === 1 && !formValues.dietary) {
            return "Select a dietary option before continuing.";
        }

        if (currentStep === 2 && !formValues.ingredients.trim()) {
            return "Add ingredients or a short description of the meal you want.";
        }

        if (currentStep === 3 && !formValues.pantrySupport) {
            return "Choose whether pantry staples are available.";
        }

        return "";
    };

    const handleNextClick = () => {
        const nextValidationMessage = getStepValidationMessage(step);

        if (nextValidationMessage) {
            setValidationMessage(nextValidationMessage);
            return;
        }

        setValidationMessage("");
        setStep((previous) => Math.min(previous + 1, STEPS.length));
    };

    const handlePrevClick = () => {
        setValidationMessage("");
        setStep((previous) => Math.max(previous - 1, 1));
    };

    const handleFormSubmit = () => {
        const submitValidationMessage = getStepValidationMessage(step);

        if (submitValidationMessage) {
            setValidationMessage(submitValidationMessage);
            return;
        }

        setValidationMessage("");
        localStorage.setItem(RECIPE_QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(profile));
        localStorage.setItem(
            "formValues",
            JSON.stringify({
                dietary: profile.dietary === "any" ? "" : profile.dietary,
                ingredients: profile.ingredients.join(", "),
                pantry: profile.pantrySupport === "ingredients-only",
            }),
        );

        void router.push("/recipes").catch((error) => {
            console.error(error);
            setValidationMessage("Something went wrong while opening your recipe results.");
        });
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <Steps steps={ STEPS } currentStep={ step } />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Find recipes from what you already have
                    </h1>
                    <p className="mt-3 text-base leading-7 text-slate-600">
                        Choose your diet, describe what is in your kitchen,
                        and decide whether pantry staples can be used.
                    </p>
                </div>

                <form className="space-y-8">
                    { step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    What is your dietary requirement?
                                </h2>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-600">
                                    Dietary requirement
                                </span>
                                <div className="relative">
                                    <select
                                        className={ SELECT_CLASSNAME }
                                        name="dietary"
                                        value={ formValues.dietary }
                                        onChange={ (event) => updateField("dietary", event.target.value) }
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        { DIETARY_OPTIONS.map((option) => (
                                            <option key={ option.value } value={ option.value }>
                                                { option.label }
                                            </option>
                                        )) }
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </label>
                        </div>
                    ) : null }

                    { step === 2 ? (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    What do you have in your kitchen?
                                </h2>
                            </div>

                            <textarea
                                className={ `${INPUT_CLASSNAME} min-h-[140px] resize-none` }
                                name="ingredients"
                                value={ formValues.ingredients }
                                onChange={ (event) => updateField("ingredients", event.target.value) }
                                placeholder="Chicken, rice, spinach"
                            />
                        </div>
                    ) : null }

                    { step === 3 ? (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Do you have pantry items to support your cooking?
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Choose whether the recipe can rely on basic pantry staples.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                { pantryOptions.map((option) => {
                                    const isSelected = formValues.pantrySupport === option.value;

                                    return (
                                        <button
                                            key={ option.value }
                                            type="button"
                                            onClick={ () => updateField("pantrySupport", option.value) }
                                            className={ `rounded-xl border p-4 text-left transition ${isSelected
                                                ? "border-slate-900 bg-slate-900 text-white"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                                }` }
                                        >
                                            <p className="text-base font-semibold">{ option.title }</p>
                                            <p
                                                className={ `mt-2 text-sm leading-6 ${isSelected ? "text-slate-200" : "text-slate-500"
                                                    }` }
                                            >
                                                { option.description }
                                            </p>
                                        </button>
                                    );
                                }) }
                            </div>
                        </div>
                    ) : null }

                    { validationMessage ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            { validationMessage }
                        </div>
                    ) : null }

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
                        <button
                            type="button"
                            onClick={ handlePrevClick }
                            className={ SECONDARY_BUTTON_CLASSNAME }
                            disabled={ step === 1 }
                        >
                            Previous
                        </button>

                        { step < STEPS.length ? (
                            <button type="button" onClick={ handleNextClick } className={ BUTTON_CLASSNAME }>
                                Next
                            </button>
                        ) : (
                            <button type="button" onClick={ handleFormSubmit } className={ BUTTON_CLASSNAME }>
                                Find recipes
                            </button>
                        ) }
                    </div>
                </form>
            </section>
        </div>
    );
};

export default MultiStepForm;
