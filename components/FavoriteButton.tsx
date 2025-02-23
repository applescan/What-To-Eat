import React, { FC } from 'react';
import { FiHeart } from 'react-icons/fi';

interface FavoriteButtonProps {
    isFavorited: boolean;
    handleFavoriteClick: () => void;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({
    isFavorited,
    handleFavoriteClick,
}) => {
    return (
        <button
            onClick={handleFavoriteClick}
            className="rounded-full bg-white shadow-md p-2 focus:outline-none hithere"
            aria-label="Add to favorites"
        >
            <FiHeart
                size={24}
                fill={isFavorited ? 'red' : 'none'}
                stroke={isFavorited ? 'red' : 'grey'}
            />
        </button>
    );
};

export default FavoriteButton;

