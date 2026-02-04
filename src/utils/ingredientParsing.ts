/**
 * Parse user-typed ingredients from text input
 *
 * Handles multiple input formats:
 * - Comma-separated: "chicken, broccoli, rice"
 * - Space-separated: "chicken broccoli rice"
 * - Mixed: "chicken, broccoli rice"
 *
 * @param input - Raw user input string
 * @returns Array of normalized ingredient strings (lowercase, trimmed, unique)
 */
export const parseIngredients = (input: string): string[] => {
  if (!input || input.trim().length === 0) {
    return [];
  }

  // Split on commas or multiple spaces
  const items = input.split(/[,\s]+/);

  // Process each item: trim, lowercase, remove empty
  const processed = items
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);

  // Remove duplicates while preserving order
  return Array.from(new Set(processed));
};

/**
 * Combine selected checkbox ingredients with custom typed ingredients
 *
 * @param selectedIds - Set of selected ingredient IDs from checkboxes
 * @param ingredientMap - Map of ID to ingredient name
 * @param customIngredients - Array of custom typed ingredients
 * @returns Combined array of all ingredient names
 */
export const combineIngredients = (
  selectedIds: Set<string>,
  ingredientMap: Map<string, string>,
  customIngredients: string[]
): string[] => {
  const selectedNames = Array.from(selectedIds)
    .map((id) => ingredientMap.get(id))
    .filter((name): name is string => name !== undefined);

  return [...selectedNames, ...customIngredients];
};

/**
 * Normalize a single ingredient string for comparison
 *
 * @param ingredient - Raw ingredient string
 * @returns Normalized string (lowercase, trimmed)
 */
export const normalizeIngredient = (ingredient: string): string => {
  return ingredient.trim().toLowerCase();
};
