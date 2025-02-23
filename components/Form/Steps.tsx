import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Steps: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="mx-auto max-w-lg px-8 py-10 sm:px-10">
      <ul aria-label="Steps" className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={index}
            aria-current={currentStep === index + 1 ? "step" : false}
            className="flex flex-1 items-center last:flex-none"
          >
            <div
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border-2
                                ${
                                  currentStep > index + 1
                                    ? "bg-transition border-indigo-600 bg-indigo-600"
                                    : ""
                                }
                                ${
                                  currentStep === index + 1
                                    ? "border-indigo-600"
                                    : ""
                                }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full bg-indigo-600 ${
                  currentStep !== index + 1 ? "hidden" : ""
                }`}
              ></span>
              {currentStep > index + 1 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-white"
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
              className={`w-full border
        ${index + 1 === steps.length ? "hidden" : ""}
        ${currentStep > index + 1 ? "hr-transition border-indigo-600" : ""}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Steps;
