import { describe, it, expect } from 'vitest';
import {
  parseIngredients,
  combineIngredients,
  normalizeIngredient,
} from './ingredientParsing';

describe('parseIngredients', () => {
  it('parses comma-separated ingredients', () => {
    const input = 'chicken, broccoli, rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('parses space-separated ingredients', () => {
    const input = 'chicken broccoli rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('parses mixed separators (comma and space)', () => {
    const input = 'chicken, broccoli rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('trims whitespace from ingredients', () => {
    const input = '  chicken  ,  broccoli  ,  rice  ';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('converts ingredients to lowercase', () => {
    const input = 'Chicken, BROCCOLI, Rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('removes duplicate ingredients', () => {
    const input = 'chicken, chicken, broccoli, chicken';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli']);
  });

  it('removes empty strings from result', () => {
    const input = 'chicken,  , broccoli, ,rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('returns empty array for empty input', () => {
    expect(parseIngredients('')).toEqual([]);
  });

  it('returns empty array for whitespace-only input', () => {
    expect(parseIngredients('   ')).toEqual([]);
  });

  it('returns empty array for null-ish input', () => {
    expect(parseIngredients(null as unknown as string)).toEqual([]);
    expect(parseIngredients(undefined as unknown as string)).toEqual([]);
  });

  it('handles single ingredient', () => {
    const input = 'chicken';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken']);
  });

  it('handles ingredients with multiple spaces between', () => {
    const input = 'chicken    broccoli     rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });

  it('preserves order while removing duplicates', () => {
    const input = 'rice, chicken, broccoli, rice, chicken';
    const result = parseIngredients(input);
    expect(result).toEqual(['rice', 'chicken', 'broccoli']);
  });
});

describe('combineIngredients', () => {
  it('combines selected IDs with custom ingredients', () => {
    const selectedIds = new Set(['chicken-breast', 'broccoli']);
    const ingredientMap = new Map([
      ['chicken-breast', 'Chicken breast'],
      ['broccoli', 'Broccoli'],
      ['carrots', 'Carrots'],
    ]);
    const customIngredients = ['salmon', 'lemon'];

    const result = combineIngredients(
      selectedIds,
      ingredientMap,
      customIngredients
    );

    expect(result).toContain('Chicken breast');
    expect(result).toContain('Broccoli');
    expect(result).toContain('salmon');
    expect(result).toContain('lemon');
    expect(result).toHaveLength(4);
  });

  it('handles empty selected IDs', () => {
    const selectedIds = new Set<string>();
    const ingredientMap = new Map([['chicken-breast', 'Chicken breast']]);
    const customIngredients = ['salmon'];

    const result = combineIngredients(
      selectedIds,
      ingredientMap,
      customIngredients
    );

    expect(result).toEqual(['salmon']);
  });

  it('handles empty custom ingredients', () => {
    const selectedIds = new Set(['chicken-breast']);
    const ingredientMap = new Map([['chicken-breast', 'Chicken breast']]);
    const customIngredients: string[] = [];

    const result = combineIngredients(
      selectedIds,
      ingredientMap,
      customIngredients
    );

    expect(result).toEqual(['Chicken breast']);
  });

  it('ignores IDs not in the map', () => {
    const selectedIds = new Set(['chicken-breast', 'unknown-id']);
    const ingredientMap = new Map([['chicken-breast', 'Chicken breast']]);
    const customIngredients: string[] = [];

    const result = combineIngredients(
      selectedIds,
      ingredientMap,
      customIngredients
    );

    expect(result).toEqual(['Chicken breast']);
  });
});

describe('normalizeIngredient', () => {
  it('converts to lowercase', () => {
    expect(normalizeIngredient('CHICKEN')).toBe('chicken');
    expect(normalizeIngredient('Broccoli')).toBe('broccoli');
  });

  it('trims whitespace', () => {
    expect(normalizeIngredient('  chicken  ')).toBe('chicken');
  });

  it('handles already normalized input', () => {
    expect(normalizeIngredient('chicken')).toBe('chicken');
  });
});
