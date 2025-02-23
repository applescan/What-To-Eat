import React, { FC } from 'react';

interface AddToGroceryButtonProps {
    handleGroceryClick: () => void;
}

const AddToGroceryButton: FC<AddToGroceryButtonProps> = ({ handleGroceryClick }) => {
    return (
        <button
            className="flex items-center justify-center py-2 px-4 text-white font-medium bg-gradient-to-r from-[#14b8a6] to-[#a3e635] hover:bg-teal-400 rounded-lg md:inline-flex"
            onClick={handleGroceryClick}
        >
            Add to grocery list 🛍️
        </button>
    );
};

export default AddToGroceryButton;
