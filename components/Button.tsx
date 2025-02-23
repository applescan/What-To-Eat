import React, { MouseEventHandler } from 'react';

interface ButtonProps {
    name: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    isTeal?: boolean; // Add a new prop for specifying whether the button should be teal or not
    type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: React.FC<ButtonProps> = ({ name, onClick, isTeal, type }) => {
    const bgColorClass = isTeal ? "bg-teal-500" : "bg-indigo-600";
    const hoverBgColorClass = isTeal ? "hover:bg-teal-400" : "hover:bg-indigo-400";

    return (
        <button
            className={`px-8 py-2 text-white rounded-lg duration-150 active:shadow-lg ${bgColorClass} ${hoverBgColorClass}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            type={type}
        >
            {name}
        </button>
    );
};

export default Button;

