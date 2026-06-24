import React, { MouseEventHandler } from "react";

interface ButtonProps {
  name: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isTeal?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ name, onClick, isTeal, type = "button" }) => {
  const toneClassName = isTeal
    ? "bg-emerald-600 hover:bg-emerald-500"
    : "bg-slate-900 hover:bg-slate-800";

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${toneClassName}`}
      onClick={onClick}
      type={type}
    >
      {name}
    </button>
  );
};

export default Button;
