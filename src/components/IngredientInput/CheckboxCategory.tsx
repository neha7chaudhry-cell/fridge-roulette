import React from 'react';
import { Ingredient } from '@/types';

interface CheckboxCategoryProps {
  /** Category title */
  title: string;
  /** Ingredients in this category */
  ingredients: Ingredient[];
  /** Set of selected ingredient IDs */
  selected: Set<string>;
  /** Toggle handler */
  onToggle: (id: string) => void;
}

/**
 * Category of ingredient checkboxes with title
 */
export const CheckboxCategory: React.FC<CheckboxCategoryProps> = ({
  title,
  ingredients,
  selected,
  onToggle,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {ingredients.map((ingredient) => (
          <label
            key={ingredient.id}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50
              transition-colors min-h-[44px]"
          >
            <input
              type="checkbox"
              checked={selected.has(ingredient.id)}
              onChange={() => onToggle(ingredient.id)}
              className="w-5 h-5 text-primary-500 rounded border-gray-300
                focus:ring-primary-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 select-none">
              {ingredient.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
