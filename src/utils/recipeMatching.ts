import { Recipe, RecipeMatch } from '@/types';

/**
 * Calculate match percentage between user ingredients and recipe ingredients
 *
 * Algorithm:
 * 1. Normalize all ingredient names (lowercase, trim)
 * 2. For each recipe ingredient, check if ANY user ingredient is a substring match
 *    - Example: user has "chicken" → matches "chicken breast (1 lb, diced)"
 * 3. Calculate percentage: (matches / total recipe ingredients) × 100
 *
 * @param recipeIngredients - Array of ingredient strings from recipe
 * @param userIngredients - Array of ingredient strings from user input
 * @returns Match percentage (0-100, rounded to nearest integer)
 */
export const calculateMatchPercentage = (
  recipeIngredients: string[],
  userIngredients: string[]
): number => {
  if (recipeIngredients.length === 0) return 0;
  if (userIngredients.length === 0) return 0;

  const normalizedUserIngredients = userIngredients.map((i) =>
    i.toLowerCase().trim()
  );

  let matchCount = 0;

  for (const recipeIng of recipeIngredients) {
    const normalizedRecipeIng = recipeIng.toLowerCase().trim();

    // Check if any user ingredient matches (bidirectional substring matching)
    const hasMatch = normalizedUserIngredients.some((userIng) => {
      // User ingredient contained in recipe ingredient
      // e.g., "chicken" matches "chicken breast (1 lb)"
      if (normalizedRecipeIng.includes(userIng)) {
        return true;
      }
      // Recipe ingredient contained in user ingredient
      // e.g., "chicken breast" matches user's "chicken"
      if (userIng.includes(normalizedRecipeIng.split('(')[0].trim())) {
        return true;
      }
      return false;
    });

    if (hasMatch) matchCount++;
  }

  return Math.round((matchCount / recipeIngredients.length) * 100);
};

/**
 * Find recipes that match user's available ingredients
 *
 * @param userIngredients - Array of ingredient strings the user has
 * @param recipes - Array of all recipes to search
 * @param minMatchPercentage - Minimum match percentage to include (default: 50)
 * @param maxResults - Maximum number of results to return (default: 5)
 * @returns Array of RecipeMatch objects, sorted by match percentage (highest first)
 */
export const findRecipeMatches = (
  userIngredients: string[],
  recipes: Recipe[],
  minMatchPercentage: number = 50,
  maxResults: number = 5
): RecipeMatch[] => {
  const matches: RecipeMatch[] = recipes.map((recipe) => {
    const matchPercentage = calculateMatchPercentage(
      recipe.ingredients,
      userIngredients
    );

    const normalizedUserIngredients = userIngredients.map((i) =>
      i.toLowerCase().trim()
    );

    // Find missing ingredients
    const missingIngredients = recipe.ingredients.filter((recipeIng) => {
      const normalized = recipeIng.toLowerCase().trim();
      const baseIngredient = normalized.split('(')[0].trim();

      return !normalizedUserIngredients.some(
        (userIng) =>
          normalized.includes(userIng) || userIng.includes(baseIngredient)
      );
    });

    return {
      recipe,
      matchPercentage,
      missingIngredients,
      hasAllIngredients: missingIngredients.length === 0,
    };
  });

  // Filter by minimum percentage, sort by percentage descending, limit results
  return matches
    .filter((m) => m.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, maxResults);
};

/**
 * Get the base ingredient name without quantities/descriptions
 * e.g., "chicken breast (1 lb, diced)" → "chicken breast"
 */
export const getBaseIngredientName = (ingredient: string): string => {
  return ingredient.split('(')[0].trim().toLowerCase();
};
