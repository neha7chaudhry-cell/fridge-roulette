/**
 * UAT Validation Tests for Static Data
 * Validates ingredients and recipes against PRD requirements
 */

import { describe, it, expect } from 'vitest';
import { INGREDIENTS } from './ingredients';
import recipesData from './recipes.json';
import { Recipe } from '@/types';

const recipes = recipesData.recipes as Recipe[];

describe('UAT: Ingredients Data Validation', () => {
  it('should have exactly 26 ingredients', () => {
    expect(INGREDIENTS).toHaveLength(26);
  });

  it('should have 8 proteins', () => {
    const proteins = INGREDIENTS.filter((i) => i.category === 'protein');
    expect(proteins).toHaveLength(8);
  });

  it('should have 12 vegetables', () => {
    const vegetables = INGREDIENTS.filter((i) => i.category === 'vegetable');
    expect(vegetables).toHaveLength(12);
  });

  it('should have 6 dairy/extras', () => {
    const dairyExtras = INGREDIENTS.filter(
      (i) => i.category === 'dairy' || i.category === 'extra'
    );
    expect(dairyExtras).toHaveLength(6);
  });

  it('each ingredient should have required fields', () => {
    INGREDIENTS.forEach((ingredient) => {
      expect(ingredient.id).toBeDefined();
      expect(ingredient.id.length).toBeGreaterThan(0);
      expect(ingredient.name).toBeDefined();
      expect(ingredient.name.length).toBeGreaterThan(0);
      expect(['protein', 'vegetable', 'dairy', 'extra']).toContain(
        ingredient.category
      );
      expect(typeof ingredient.commonlyUsed).toBe('boolean');
    });
  });

  it('should have unique ingredient IDs', () => {
    const ids = INGREDIENTS.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have some commonly used ingredients for pre-checking', () => {
    const commonlyUsed = INGREDIENTS.filter((i) => i.commonlyUsed);
    expect(commonlyUsed.length).toBeGreaterThan(10); // At least 10 pre-checked
    expect(commonlyUsed.length).toBeLessThan(20); // Not everything pre-checked
  });
});

describe('UAT: Recipes Data Validation', () => {
  it('should have exactly 25 recipes', () => {
    expect(recipes).toHaveLength(25);
  });

  it('each recipe should have required fields', () => {
    recipes.forEach((recipe) => {
      expect(recipe.id).toBeDefined();
      expect(recipe.name).toBeDefined();
      expect(recipe.name.length).toBeGreaterThan(0);
      expect(recipe.time).toBeDefined();
      expect(recipe.difficulty).toBeDefined();
      expect(recipe.servings).toBeDefined();
      expect(recipe.ingredients).toBeDefined();
      expect(Array.isArray(recipe.ingredients)).toBe(true);
      expect(recipe.steps).toBeDefined();
      expect(Array.isArray(recipe.steps)).toBe(true);
    });
  });

  it('all recipes should be 15-30 minutes (PRD requirement)', () => {
    recipes.forEach((recipe) => {
      expect(recipe.time).toBeGreaterThanOrEqual(15);
      expect(recipe.time).toBeLessThanOrEqual(30);
    });
  });

  it('all recipes should serve exactly 4 (PRD requirement)', () => {
    recipes.forEach((recipe) => {
      expect(recipe.servings).toBe(4);
    });
  });

  it('all recipes should be Easy or Medium difficulty only', () => {
    recipes.forEach((recipe) => {
      expect(['Easy', 'Medium']).toContain(recipe.difficulty);
    });
  });

  it('should have unique recipe IDs', () => {
    const ids = recipes.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each recipe should have 4-10 ingredients (reasonable range)', () => {
    recipes.forEach((recipe) => {
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(4);
      expect(recipe.ingredients.length).toBeLessThanOrEqual(10);
    });
  });

  it('each recipe should have 5-8 steps (PRD requirement)', () => {
    recipes.forEach((recipe) => {
      expect(recipe.steps.length).toBeGreaterThanOrEqual(5);
      expect(recipe.steps.length).toBeLessThanOrEqual(8);
    });
  });

  it('should have a mix of Easy and Medium recipes', () => {
    const easy = recipes.filter((r) => r.difficulty === 'Easy');
    const medium = recipes.filter((r) => r.difficulty === 'Medium');
    expect(easy.length).toBeGreaterThan(0);
    expect(medium.length).toBeGreaterThan(0);
  });

  it('should have variety in cooking times', () => {
    const times = new Set(recipes.map((r) => r.time));
    expect(times.size).toBeGreaterThan(3); // At least 4 different cook times
  });
});

describe('UAT: Data Quality Checks', () => {
  it('recipe names should be descriptive (at least 10 characters)', () => {
    recipes.forEach((recipe) => {
      expect(recipe.name.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('recipe steps should be actionable (at least 15 characters each)', () => {
    recipes.forEach((recipe) => {
      recipe.steps.forEach((step) => {
        expect(step.length).toBeGreaterThanOrEqual(15);
      });
    });
  });

  it('recipe ingredients should include quantities', () => {
    recipes.forEach((recipe) => {
      // At least half of ingredients should have quantities (parentheses)
      const withQuantities = recipe.ingredients.filter((i) => i.includes('('));
      expect(withQuantities.length).toBeGreaterThanOrEqual(
        recipe.ingredients.length / 2
      );
    });
  });
});
