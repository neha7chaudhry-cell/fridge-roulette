/**
 * Core data models for Fridge Roulette
 * Based on PRD Section 3.3 and TDD Section 4
 */

/**
 * Recipe difficulty level
 * - Easy: Simple techniques, minimal prep
 * - Medium: Some cooking skill required
 */
export type Difficulty = 'Easy' | 'Medium';

/**
 * Category for organizing ingredients in the UI
 */
export type IngredientCategory = 'protein' | 'vegetable' | 'dairy' | 'extra';

/**
 * Current view state of the application
 * - input: User is selecting ingredients
 * - results: Showing matched recipes
 * - detail: Viewing a specific recipe
 */
export type ViewMode = 'input' | 'results' | 'detail';

/**
 * A recipe in the database
 */
export interface Recipe {
  /** Unique identifier */
  id: number;
  /** Display name of the recipe */
  name: string;
  /** Total cooking time in minutes (15-30 for v1.0) */
  time: number;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Number of servings (always 4 for v1.0) */
  servings: number;
  /** List of ingredients with quantities, e.g., "chicken breast (1 lb, diced)" */
  ingredients: string[];
  /** Step-by-step cooking instructions */
  steps: string[];
  /** Optional tags for categorization, e.g., ["kid-friendly", "one-pan"] */
  tags?: string[];
}

/**
 * A standard ingredient that can be selected via checkbox
 */
export interface Ingredient {
  /** Unique identifier, e.g., "chicken-breast" */
  id: string;
  /** Display name, e.g., "Chicken breast" */
  name: string;
  /** Category for grouping in UI */
  category: IngredientCategory;
  /** If true, checkbox is pre-checked on load (common pantry items) */
  commonlyUsed: boolean;
}

/**
 * Result of matching a recipe against user's ingredients
 */
export interface RecipeMatch {
  /** The matched recipe */
  recipe: Recipe;
  /** Percentage of recipe ingredients the user has (0-100) */
  matchPercentage: number;
  /** Ingredients the user is missing */
  missingIngredients: string[];
  /** True if user has all required ingredients */
  hasAllIngredients: boolean;
}

/**
 * Request body for AI recipe generation API
 */
export interface GenerateRecipeRequest {
  /** List of available ingredients */
  ingredients: string[];
}

/**
 * Response from AI recipe generation API
 */
export interface GenerateRecipeResponse {
  /** The generated recipe */
  recipe: Recipe;
}

/**
 * Error response from API
 */
export interface APIError {
  /** Error message to display to user */
  error: string;
}

/**
 * Application state shape (for documentation purposes)
 */
export interface AppState {
  /** Selected ingredient IDs from checkboxes */
  selectedIngredients: Set<string>;
  /** Custom ingredients typed by user */
  customIngredients: string[];
  /** Recipe matches after search */
  recipeMatches: RecipeMatch[];
  /** Current view mode */
  viewMode: ViewMode;
  /** Currently selected recipe for detail view */
  selectedRecipe: Recipe | null;
  /** Whether AI generation is in progress */
  isGenerating: boolean;
  /** Error message from AI generation, if any */
  aiError: string | null;
}
