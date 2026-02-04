import { Ingredient, IngredientCategory } from '@/types';

/**
 * Standard ingredients available for selection
 * Based on PRD Section 3.3 - 26 items total
 *
 * Categories:
 * - Proteins (8): Common meat, eggs, and protein sources
 * - Vegetables (12): Fresh and frozen vegetables
 * - Dairy & Extras (6): Dairy products and staples
 *
 * commonlyUsed: true = pre-checked on load (typical household items)
 */
export const INGREDIENTS: Ingredient[] = [
  // ============================================
  // PROTEINS (8 items)
  // ============================================
  {
    id: 'chicken-breast',
    name: 'Chicken breast',
    category: 'protein',
    commonlyUsed: true,
  },
  {
    id: 'ground-beef',
    name: 'Ground beef',
    category: 'protein',
    commonlyUsed: true,
  },
  {
    id: 'ground-turkey',
    name: 'Ground turkey',
    category: 'protein',
    commonlyUsed: true,
  },
  {
    id: 'pork-chops',
    name: 'Pork chops',
    category: 'protein',
    commonlyUsed: false,
  },
  {
    id: 'eggs',
    name: 'Eggs',
    category: 'protein',
    commonlyUsed: true,
  },
  {
    id: 'canned-tuna',
    name: 'Canned tuna',
    category: 'protein',
    commonlyUsed: false,
  },
  {
    id: 'tofu',
    name: 'Tofu',
    category: 'protein',
    commonlyUsed: false,
  },
  {
    id: 'shrimp',
    name: 'Shrimp',
    category: 'protein',
    commonlyUsed: false,
  },

  // ============================================
  // VEGETABLES (12 items)
  // ============================================
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'carrots',
    name: 'Carrots',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'bell-peppers',
    name: 'Bell peppers',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'onions',
    name: 'Onions',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'spinach',
    name: 'Spinach/leafy greens',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    category: 'vegetable',
    commonlyUsed: false,
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    category: 'vegetable',
    commonlyUsed: false,
  },
  {
    id: 'green-beans',
    name: 'Green beans',
    category: 'vegetable',
    commonlyUsed: false,
  },
  {
    id: 'frozen-veg',
    name: 'Frozen mixed vegetables',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    category: 'vegetable',
    commonlyUsed: true,
  },
  {
    id: 'sweet-potatoes',
    name: 'Sweet potatoes',
    category: 'vegetable',
    commonlyUsed: false,
  },

  // ============================================
  // DAIRY & EXTRAS (6 items)
  // ============================================
  {
    id: 'milk',
    name: 'Milk',
    category: 'dairy',
    commonlyUsed: true,
  },
  {
    id: 'cheese',
    name: 'Cheese',
    category: 'dairy',
    commonlyUsed: true,
  },
  {
    id: 'butter',
    name: 'Butter',
    category: 'dairy',
    commonlyUsed: true,
  },
  {
    id: 'sour-cream',
    name: 'Sour cream/yogurt',
    category: 'dairy',
    commonlyUsed: false,
  },
  {
    id: 'tortillas',
    name: 'Tortillas',
    category: 'extra',
    commonlyUsed: false,
  },
  {
    id: 'bread',
    name: 'Bread',
    category: 'extra',
    commonlyUsed: true,
  },
];

/**
 * Get ingredients filtered by category
 */
export const getIngredientsByCategory = (
  category: IngredientCategory
): Ingredient[] => {
  return INGREDIENTS.filter((i) => i.category === category);
};

/**
 * Get all commonly used ingredients (for pre-checking)
 */
export const getCommonlyUsedIngredients = (): Ingredient[] => {
  return INGREDIENTS.filter((i) => i.commonlyUsed);
};

/**
 * Get ingredient by ID
 */
export const getIngredientById = (id: string): Ingredient | undefined => {
  return INGREDIENTS.find((i) => i.id === id);
};
