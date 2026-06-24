import React, { FC } from 'react';

interface AddToGroceryButtonProps {
    handleGroceryClick: () => void;
}

const AddToGroceryButton: FC<AddToGroceryButtonProps> = ({ handleGroceryClick }) => {
    return (
        <button
            className="block w-full rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
            onClick={handleGroceryClick}
            type="button"
        >
            Add to grocery list
        </button>
    );
};

export default AddToGroceryButton;
