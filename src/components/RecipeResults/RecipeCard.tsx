import React from 'react';
import { RecipeMatch } from '@/types';

interface RecipeCardProps {
  /** Recipe match data */
  match: RecipeMatch;
  /** Click handler */
  onClick: () => void;
}

/**
 * Card displaying recipe summary with match percentage
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ match, onClick }) => {
  const { recipe, matchPercentage, hasAllIngredients } = match;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:shadow-lg
        transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {recipe.name}
      </h3>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
        <span
          className={`flex items-center gap-1 font-medium ${
            hasAllIngredients ? 'text-green-600' : 'text-primary-500'
          }`}
        >
          {matchPercentage}% Match
        </span>
        <span className="flex items-center gap-1">{recipe.time} min</span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            recipe.difficulty === 'Easy'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {recipe.difficulty}
        </span>
      </div>

      <div className="text-sm text-primary-600 font-medium">View Recipe →</div>
    </button>
  );
};
