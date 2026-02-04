import React from 'react';
import { Ingredient } from '@/types';
import { CheckboxCategory } from './CheckboxCategory';

interface CheckboxGridProps {
  /** All available ingredients */
  ingredients: Ingredient[];
  /** Set of selected ingredient IDs */
  selected: Set<string>;
  /** Selection change handler */
  onChange: (selected: Set<string>) => void;
}

/**
 * Grid of ingredient checkboxes organized by category
 */
export const CheckboxGrid: React.FC<CheckboxGridProps> = ({
  ingredients,
  selected,
  onChange,
}) => {
  const proteins = ingredients.filter((i) => i.category === 'protein');
  const vegetables = ingredients.filter((i) => i.category === 'vegetable');
  const dairyExtras = ingredients.filter(
    (i) => i.category === 'dairy' || i.category === 'extra'
  );

  const handleToggle = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    onChange(newSelected);
  };

  return (
    <div className="space-y-6">
      <CheckboxCategory
        title="Proteins"
        ingredients={proteins}
        selected={selected}
        onToggle={handleToggle}
      />
      <CheckboxCategory
        title="Vegetables"
        ingredients={vegetables}
        selected={selected}
        onToggle={handleToggle}
      />
      <CheckboxCategory
        title="Dairy & Extras"
        ingredients={dairyExtras}
        selected={selected}
        onToggle={handleToggle}
      />
    </div>
  );
};
