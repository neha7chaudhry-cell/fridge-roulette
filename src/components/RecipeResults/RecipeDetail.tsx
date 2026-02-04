import React from 'react';
import { Recipe } from '@/types';
import { Button } from '@/components/Common';

interface RecipeDetailProps {
  /** Recipe to display */
  recipe: Recipe;
  /** Back button handler */
  onBack: () => void;
  /** Whether this is an AI-generated recipe */
  isAIGenerated?: boolean;
}

/**
 * Full recipe detail view with ingredients and steps
 */
export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  isAIGenerated = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="text-primary-600 hover:text-primary-800 mb-4 flex items-center gap-1
          focus:outline-none focus:underline"
      >
        ← Back to Results
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h2>

      {isAIGenerated && (
        <p className="text-sm text-purple-600 mb-2">
          ✨ AI-generated recipe - adjust to taste
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
        <span>{recipe.time} minutes</span>
        <span>Serves {recipe.servings}</span>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            recipe.difficulty === 'Easy'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {recipe.difficulty}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Ingredients
        </h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">•</span>
              <span className="text-gray-700">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Instructions
        </h3>
        <ol className="space-y-3">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span
                className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full
                  flex items-center justify-center text-sm font-semibold"
              >
                {index + 1}
              </span>
              <span className="text-gray-700 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <Button onClick={onBack} variant="secondary" fullWidth>
        ← Back to Results
      </Button>
    </div>
  );
};
