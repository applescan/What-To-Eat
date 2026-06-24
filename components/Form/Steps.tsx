import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Steps: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <ul aria-label="Steps" className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = currentStep === stepNumber;
          const isComplete = currentStep > stepNumber;

          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className={`rounded-xl border px-4 py-3 ${
                isCurrent
                  ? "border-slate-900 bg-slate-900 text-white"
                  : isComplete
                    ? "border-slate-300 bg-white text-slate-700"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isCurrent
                      ? "bg-white/15 text-white"
                      : isComplete
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isComplete ? "✓" : stepNumber}
                </span>
                <span className="text-sm font-semibold">{step}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Steps;
