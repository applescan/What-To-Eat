import React from "react";

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Steps: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="max-w-lg mx-auto px-8 py-10 sm:px-10">
            <ul aria-label="Steps" className="flex items-center">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        aria-current={currentStep === index + 1 ? "step" : false}
                        className="flex-1 last:flex-none flex items-center"
                    >
                        <div
                            className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${currentStep > index + 1
                                ? "bg-indigo-600 border-indigo-600 bg-transition"
                                : ""
                                    || currentStep === index + 1
                                    ? "border-indigo-600"
                                    : ""
                                }`}
                        >
                            <span
                                className={`w-2.5 h-2.5 rounded-full bg-indigo-600 ${currentStep !== index + 1 ? "hidden" : ""
                                    }`}
                            ></span>
                            {currentStep > index + 1 ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            ) : (
                                ""
                            )}
                        </div>
                        <hr
                            className={`w-full border ${index + 1 === steps.length ? "hidden" : "" || currentStep > index + 1 ? "border-indigo-600 hr-transition" : ""}`}
                        />

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Steps;
