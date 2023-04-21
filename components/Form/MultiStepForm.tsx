import React, { useState } from "react";
import Steps from "./Steps";
import { useRouter } from 'next/router';
import Button from "../Button";


type FormValues = {
    dietary: string;
    ingredients: string;
    pantry: boolean | null;
};

const MultiStepForm = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        dietary: "",
        ingredients: "",
        pantry: null
    });

    //to change the form questions and stepper number
    const [step, setStep] = useState<number>(1);
    const router = useRouter();


    // validate the form values
    const validateForm = () => {
        if (formValues.dietary === "" || formValues.ingredients === "" || formValues.pantry === null) {
            return false;
        }
        return true;
    };


    //handling form submission
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // validate the form values
        const isValid = validateForm();
        if (!isValid) {
            alert("Please fill in all fields before submitting the form.");
            return;
        }

        console.log(formValues);
        //save users choice in local storage
        localStorage.setItem('formValues', JSON.stringify(formValues));
        router.push('/recipes');

    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleRadioChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value === "true" });
    };

    const handleNextClick = () => {
            setStep(step + 1); 
    };

    const handlePrevClick = () => {
            setStep(step - 1);
    };

    return (
        <div>
            <Steps steps={["Step 1", "Step 2", "Step 3"]} currentStep={step} />

            <div className="max-w-screen-xl mx-auto gap-12 text-gray-600 px-1 pb-32 pt-10 md:px-1">

                <div className="space-y-5 max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl text-gray-700 font-extrabold mx-auto md:text-5xl">
                        Tell us a little bit about your  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#14b8a6]" >dietary preferences</span>
                    </h2>

                </div>

                <form onSubmit={handleFormSubmit} className="pt-28 pb-20">
                    <div>
                        {step === 1 && (
                            <div className=" font-semibold text-xl mx-auto">
                                <label>
                                    What is your dietary requirement?
                                    <br></br>
                                    <br></br>
                                    <select className="text-base bg-teal-50 border-2 border-indigo-200 text-gray-700 rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-5"
                                        required
                                        name="dietary"
                                        value={formValues.dietary}
                                        onChange={handleInputChange}
                                        placeholder="Select an option"
                                    >
                                        <option value="" disabled>Select an option</option>
                                        <option value=" ">No Dietary Requirements 🥣</option>
                                        <option value="gluten-free">Gluten-Free 🧺</option>
                                        <option value="vegetarian">Vegetarian 🥗</option>
                                        <option value="vegan">Vegan 🌱</option>
                                        <option value="dairy-free">Dairy-Free 🥛</option>
                                        <option value="paleo">Paleo 🏺</option>
                                        <option value="low-carb">Low-Carb 🍜</option>
                                        <option value="low-fat">Low-Fat 🥕</option>
                                        <option value="mediterranean">Mediterranean 🧆</option>
                                    </select>
                                </label>
                                <div className="mx-auto flex justify-end py-6">
                                    <Button name="Next" onClick={handleNextClick} isTeal={false} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {step === 2 && (
                            <div className=" font-semibold text-xl mx-auto">
                                <label>
                                    What do you have in your kitchen? 🥡
                                    <br></br>
                                    <br></br>
                                    <input className="text-base bg-teal-50 border-2 border-indigo-200 text-gray-700 rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-5"
                                        placeholder="beef, rice, potato"
                                        type="text"
                                        name="ingredients"
                                        value={formValues.ingredients}
                                        onChange={handleInputChange}
                                        spellCheck="true"
                                        required
                                    />
                                </label>

                                <div className="mx-auto flex justify-between py-6">
                                    <Button name="Previous" onClick={handlePrevClick} isTeal={true} />
                                    <Button name="Next" onClick={handleNextClick} isTeal={false} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {step === 3 && (
                            <div className=" font-semibold text-xl mx-auto form-step">

                                <h1> Do you have pantry items to support your cooking? 🥫</h1>
                                <br></br>
                                <ul className="grid w-full gap-6 md:grid-cols-2">
                                    <li>
                                        <label className="inline-flex items-center justify-evenly w-full p-5 bg-teal-50 border-2 border-indigo-200 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500" >
                                            <input type="radio" name="pantry" value="true" checked={formValues.pantry === true} onChange={handleRadioChange} required />
                                            <div className="block">
                                                <div className="text-base px-5">No, please only consider what I have in my kitchen 🔪</div>
                                            </div>
                                        </label>
                                    </li>
                                    <li>
                                        <label className="inline-flex items-center justify-evenly w-full p-5 bg-teal-50 border-2 border-indigo-200 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500">
                                            <input type="radio" name="pantry" value="false" checked={formValues.pantry === false} onChange={handleRadioChange} required />
                                            <div className="block">
                                                <div className="text-base px-5">Yes, I have pantry stuff in my kitchen 🧂</div>
                                            </div>
                                        </label>
                                    </li>
                                </ul>

                                <div className="mx-auto flex justify-between py-6">
                                    <Button name="Previous" onClick={handlePrevClick} isTeal={true} />
                                    <Button name="Submit" type="submit" isTeal={false} />
                                </div>
                            </div>
                        )}
                    </div>

                </form>

            </div>
        </div>
    );
};

export default MultiStepForm;

