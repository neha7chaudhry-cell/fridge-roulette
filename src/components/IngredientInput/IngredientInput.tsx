import React from 'react';
import { TextInput } from './TextInput';
import { CheckboxGrid } from './CheckboxGrid';
import { Button } from '@/components/Common';
import { Ingredient } from '@/types';

interface IngredientInputProps {
  /** All available ingredients */
  ingredients: Ingredient[];
  /** Selected ingredient IDs */
  selectedIngredients: Set<string>;
  /** Custom typed ingredients text */
  customIngredientsText: string;
  /** Selection change handler */
  onSelectedChange: (selected: Set<string>) => void;
  /** Custom ingredients text change handler */
  onCustomChange: (text: string) => void;
  /** Submit handler */
  onSubmit: () => void;
}

/**
 * Main ingredient input section with text input and checkboxes
 */
export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  selectedIngredients,
  customIngredientsText,
  onSelectedChange,
  onCustomChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          What&apos;s in your fridge?
        </h2>
        <TextInput value={customIngredientsText} onChange={onCustomChange} />
      </div>

      <div>
        <p className="text-gray-600 mb-4">Or uncheck what you don&apos;t have:</p>
        <CheckboxGrid
          ingredients={ingredients}
          selected={selectedIngredients}
          onChange={onSelectedChange}
        />
      </div>

      <Button onClick={onSubmit} size="large" fullWidth>
        Find Recipes
      </Button>
    </div>
  );
};
