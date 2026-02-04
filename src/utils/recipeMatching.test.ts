import { describe, it, expect } from 'vitest';
import {
  calculateMatchPercentage,
  findRecipeMatches,
  getBaseIngredientName,
} from './recipeMatching';
import { Recipe } from '@/types';

describe('calculateMatchPercentage', () => {
  it('returns 100% when user has all ingredients', () => {
    const recipeIngredients = ['chicken', 'broccoli', 'rice'];
    const userIngredients = ['chicken', 'broccoli', 'rice', 'onions'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(100);
  });

  it('returns 75% when user has 3 of 4 ingredients', () => {
    const recipeIngredients = ['chicken', 'broccoli', 'rice', 'soy sauce'];
    const userIngredients = ['chicken', 'broccoli', 'rice'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(75);
  });

  it('returns 50% when user has 2 of 4 ingredients', () => {
    const recipeIngredients = ['chicken', 'broccoli', 'rice', 'soy sauce'];
    const userIngredients = ['chicken', 'broccoli'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(50);
  });

  it('returns 0% when user has no matching ingredients', () => {
    const recipeIngredients = ['chicken', 'broccoli'];
    const userIngredients = ['beef', 'carrots'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(0);
  });

  it('returns 0% when recipe has no ingredients', () => {
    const recipeIngredients: string[] = [];
    const userIngredients = ['chicken', 'broccoli'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(0);
  });

  it('returns 0% when user has no ingredients', () => {
    const recipeIngredients = ['chicken', 'broccoli'];
    const userIngredients: string[] = [];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(0);
  });

  it('handles partial ingredient name matches (user has "chicken" matches "chicken breast")', () => {
    const recipeIngredients = ['chicken breast (1 lb, diced)'];
    const userIngredients = ['chicken'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(100);
  });

  it('handles partial matches with quantities in recipe', () => {
    const recipeIngredients = [
      'chicken breast (1 lb, diced)',
      'broccoli (2 cups, chopped)',
      'onion (1 medium, diced)',
    ];
    const userIngredients = ['chicken', 'broccoli', 'onion'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(100);
  });

  it('is case insensitive', () => {
    const recipeIngredients = ['Chicken', 'BROCCOLI', 'Rice'];
    const userIngredients = ['chicken', 'broccoli', 'rice'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(100);
  });

  it('trims whitespace', () => {
    const recipeIngredients = ['  chicken  ', 'broccoli'];
    const userIngredients = ['chicken', '  broccoli  '];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(100);
  });

  it('rounds to nearest integer', () => {
    // 2 of 3 = 66.67% -> 67%
    const recipeIngredients = ['chicken', 'broccoli', 'rice'];
    const userIngredients = ['chicken', 'broccoli'];

    const result = calculateMatchPercentage(recipeIngredients, userIngredients);

    expect(result).toBe(67);
  });
});

describe('findRecipeMatches', () => {
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      name: 'Chicken & Broccoli',
      ingredients: ['chicken', 'broccoli', 'rice'],
      time: 20,
      difficulty: 'Easy',
      servings: 4,
      steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    },
    {
      id: 2,
      name: 'Beef Stir-Fry',
      ingredients: ['beef', 'carrots', 'soy sauce', 'onion'],
      time: 25,
      difficulty: 'Easy',
      servings: 4,
      steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    },
    {
      id: 3,
      name: 'Veggie Rice',
      ingredients: ['rice', 'carrots', 'peas'],
      time: 15,
      difficulty: 'Easy',
      servings: 4,
      steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    },
  ];

  it('returns matches sorted by percentage (highest first)', () => {
    const userIngredients = ['chicken', 'broccoli', 'rice', 'beef'];

    const matches = findRecipeMatches(userIngredients, mockRecipes);

    expect(matches[0].recipe.name).toBe('Chicken & Broccoli');
    expect(matches[0].matchPercentage).toBe(100);
  });

  it('filters out recipes below 50% match (default threshold)', () => {
    const userIngredients = ['chicken']; // Only 1 of 3 for first recipe = 33%

    const matches = findRecipeMatches(userIngredients, mockRecipes);

    // None should match since 1/3 = 33% < 50%
    expect(matches).toHaveLength(0);
  });

  it('respects custom minimum match percentage', () => {
    const userIngredients = ['chicken']; // 1 of 3 = 33%

    const matches = findRecipeMatches(userIngredients, mockRecipes, 30);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].matchPercentage).toBeGreaterThanOrEqual(30);
  });

  it('returns maximum 5 results by default', () => {
    const manyRecipes = Array(10)
      .fill(null)
      .map((_, i) => ({
        ...mockRecipes[0],
        id: i + 1,
        name: `Recipe ${i + 1}`,
      }));
    const userIngredients = ['chicken', 'broccoli', 'rice'];

    const matches = findRecipeMatches(userIngredients, manyRecipes);

    expect(matches.length).toBeLessThanOrEqual(5);
  });

  it('respects custom maxResults limit', () => {
    const userIngredients = ['chicken', 'broccoli', 'rice', 'beef', 'carrots'];

    const matches = findRecipeMatches(userIngredients, mockRecipes, 50, 2);

    expect(matches.length).toBeLessThanOrEqual(2);
  });

  it('includes missing ingredients in result', () => {
    const userIngredients = ['chicken', 'broccoli'];

    const matches = findRecipeMatches(userIngredients, mockRecipes, 50);

    const chickenRecipeMatch = matches.find(
      (m) => m.recipe.name === 'Chicken & Broccoli'
    );
    expect(chickenRecipeMatch).toBeDefined();
    expect(chickenRecipeMatch?.missingIngredients).toContain('rice');
  });

  it('sets hasAllIngredients to true when user has everything', () => {
    const userIngredients = ['chicken', 'broccoli', 'rice'];

    const matches = findRecipeMatches(userIngredients, mockRecipes);

    const chickenRecipeMatch = matches.find(
      (m) => m.recipe.name === 'Chicken & Broccoli'
    );
    expect(chickenRecipeMatch?.hasAllIngredients).toBe(true);
    expect(chickenRecipeMatch?.missingIngredients).toHaveLength(0);
  });

  it('sets hasAllIngredients to false when user is missing ingredients', () => {
    const userIngredients = ['chicken', 'broccoli'];

    const matches = findRecipeMatches(userIngredients, mockRecipes, 50);

    const chickenRecipeMatch = matches.find(
      (m) => m.recipe.name === 'Chicken & Broccoli'
    );
    expect(chickenRecipeMatch?.hasAllIngredients).toBe(false);
  });

  it('returns empty array when no recipes match', () => {
    const userIngredients = ['fish', 'lemon'];

    const matches = findRecipeMatches(userIngredients, mockRecipes);

    expect(matches).toHaveLength(0);
  });
});

describe('getBaseIngredientName', () => {
  it('extracts base name from ingredient with quantity', () => {
    expect(getBaseIngredientName('chicken breast (1 lb, diced)')).toBe(
      'chicken breast'
    );
  });

  it('returns same name for simple ingredients', () => {
    expect(getBaseIngredientName('chicken')).toBe('chicken');
  });

  it('handles multiple parentheses', () => {
    expect(getBaseIngredientName('cheese (cheddar) (1 cup)')).toBe('cheese');
  });

  it('converts to lowercase', () => {
    expect(getBaseIngredientName('Chicken Breast')).toBe('chicken breast');
  });

  it('trims whitespace', () => {
    expect(getBaseIngredientName('  chicken breast  ')).toBe('chicken breast');
  });
});
