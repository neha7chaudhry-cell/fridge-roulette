import React from 'react';
import { RecipeMatch } from '@/types';
import { RecipeCard } from './RecipeCard';
import { Button, LoadingSpinner, ErrorMessage } from '@/components/Common';

interface RecipeResultsProps {
  /** Recipe matches to display */
  matches: RecipeMatch[];
  /** Recipe selection handler */
  onRecipeSelect: (match: RecipeMatch) => void;
  /** Back to input handler */
  onBackToInput: () => void;
  /** AI generation handler */
  onGenerateRecipe?: () => void;
  /** Whether AI generation is in progress */
  isGenerating?: boolean;
  /** AI generation error message */
  aiError?: string | null;
}

/**
 * Recipe results list with AI generation option
 */
export const RecipeResults: React.FC<RecipeResultsProps> = ({
  matches,
  onRecipeSelect,
  onBackToInput,
  onGenerateRecipe,
  isGenerating = false,
  aiError = null,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBackToInput}
        className="text-primary-600 hover:text-primary-800 mb-4 flex items-center gap-1
          focus:outline-none focus:underline"
      >
        ← Back to Ingredients
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Your Matches ({matches.length})
      </h2>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            No recipes found with your ingredients.
          </p>
          <p className="text-gray-500 mb-6">
            Try adding more ingredients or generate a custom recipe.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {matches.map((match) => (
            <RecipeCard
              key={match.recipe.id}
              match={match}
              onClick={() => onRecipeSelect(match)}
            />
          ))}
        </div>
      )}

      {onGenerateRecipe && (
        <div className="border-t pt-6">
          {aiError && (
            <ErrorMessage
              message={aiError}
              onRetry={onGenerateRecipe}
              className="mb-4"
            />
          )}

          <Button
            onClick={onGenerateRecipe}
            variant="secondary"
            fullWidth
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="small" />
                Generating...
              </>
            ) : (
              '✨ Generate New Recipe'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
