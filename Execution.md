# EXECUTION PLAN & GITHUB ISSUES
## Fridge Roulette - v1.0 Implementation

**Project:** Fridge Roulette - Weeknight Dinner Recipe Finder  
**Version:** 1.0  
**Timeline:** 2-3 days  
**Team Size:** 1 developer (zero coding experience, using Claude CLI)  
**Related Documents:** PRD v1.0, TDD v1.0  

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Sprint Plan](#sprint-plan)
3. [GitHub Issues](#github-issues)
4. [Issue Dependency Graph](#issue-dependency-graph)
5. [Testing Checklist](#testing-checklist)
6. [Deployment Checklist](#deployment-checklist)

---

## Project Overview

### Objective
Build a mobile-first web application that helps working parents decide what to cook for weeknight dinners by matching available ingredients to recipes, with AI-powered generation for unusual ingredient combinations.

### Success Criteria
- ✅ Deployed to production (Vercel)
- ✅ All P0 features working
- ✅ Loads in <2s on mobile
- ✅ AI generation functional
- ✅ User (you) successfully cooks 3+ recipes in first week

### Technical Stack
- React 18.3 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Vercel (hosting + serverless)
- Anthropic Claude API (AI generation)
- Vitest (testing)

### Development Approach
- Using Claude CLI in agentic mode for code generation
- Cursor for code review/editing
- Trunk-based development (main branch only)
- Manual testing for v1.0

---

## Sprint Plan

### Sprint Breakdown (2-3 Days)

**Day 1: Foundation & Core UI**
- Issues #1-7: Project setup, base components, ingredient input

**Day 2: Recipe Logic & Display**
- Issues #8-13: Recipe matching, results display, detail view

**Day 3: AI Generation & Deployment**
- Issues #14-17: Serverless function, AI integration, deployment

**Estimated Total:** 17 issues

---

## GitHub Issues

---

### ISSUE #1: Project Initialization & Setup

**Labels:** `setup`, `p0`, `blocking`  
**Estimated Time:** 30 minutes  
**Dependencies:** None  

#### WHY (Context from PRD)
We need a React + TypeScript + Vite project with Tailwind CSS configured. This is the foundation for all subsequent work. The PRD specifies mobile-first, high-performance requirements which Vite + Tailwind enable.

#### WHAT (Requirements)
Initialize a new Vite + React + TypeScript project with Tailwind CSS and all necessary configurations.

#### HOW (Technical Approach from TDD)

**Step 1: Create Vite Project**
```bash
npm create vite@latest fridge-roulette -- --template react-ts
cd fridge-roulette
npm install
```

**Step 2: Install Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure Tailwind**

Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffe5d9',
          500: '#ff6b35',
          600: '#e65a2a',
          700: '#cc4e24',
        },
      },
    },
  },
  plugins: [],
}
```

Edit `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Install Additional Dependencies**
```bash
npm install @anthropic-ai/sdk
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier
```

**Step 5: Create Configuration Files**

`.eslintrc.json`:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

`.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

`vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
});
```

Update `tsconfig.json` (add to compilerOptions):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 6: Update package.json scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

**Step 7: Create .gitignore**
```
node_modules
dist
.env.local
.DS_Store
```

**Step 8: Create .env.example**
```
VITE_ANTHROPIC_API_KEY=your-api-key-here
```

#### ACCEPTANCE CRITERIA
- [ ] Project runs with `npm run dev`
- [ ] Tailwind classes work (test with `className="text-red-500"`)
- [ ] TypeScript compilation has no errors (`npm run build`)
- [ ] ESLint runs without errors (`npm run lint`)
- [ ] All dependencies installed successfully
- [ ] Path alias `@/` works in imports

#### VALIDATION
```bash
npm run dev    # Should see Vite dev server
npm run build  # Should compile without errors
npm run lint   # Should pass
```

---

### ISSUE #2: Create TypeScript Type Definitions

**Labels:** `types`, `p0`, `blocking`  
**Estimated Time:** 20 minutes  
**Dependencies:** #1  

#### WHY (Context from PRD)
The PRD defines specific data structures for recipes, ingredients, and matching results. TypeScript types ensure type safety and better IDE support, catching bugs early.

#### WHAT (Requirements)
Create comprehensive TypeScript interfaces/types for all data models used in the application.

#### HOW (Technical Approach from TDD)

**Step 1: Create types directory and file**
```bash
mkdir -p src/types
touch src/types/index.ts
```

**Step 2: Add type definitions**

File: `src/types/index.ts`
```typescript
/**
 * Core data models for Fridge Roulette
 * Based on PRD Section 3.3 and TDD Section 4
 */

export type Difficulty = 'Easy' | 'Medium';
export type IngredientCategory = 'protein' | 'vegetable' | 'dairy' | 'extra';
export type ViewMode = 'input' | 'results' | 'detail';

export interface Recipe {
  id: number;
  name: string;
  time: number; // minutes (15-30)
  difficulty: Difficulty;
  servings: number; // always 4 for v1.0
  ingredients: string[];
  steps: string[];
  tags?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  commonlyUsed: boolean;
}

export interface RecipeMatch {
  recipe: Recipe;
  matchPercentage: number; // 0-100
  missingIngredients: string[];
  hasAllIngredients: boolean;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
}

export interface GenerateRecipeResponse {
  recipe: Recipe;
}

export interface APIError {
  error: string;
}
```

#### ACCEPTANCE CRITERIA
- [ ] All interfaces exported from `src/types/index.ts`
- [ ] Types match PRD specifications exactly
- [ ] JSDoc comments explain each type
- [ ] No TypeScript errors when importing types

#### VALIDATION
```typescript
import { Recipe, Ingredient } from '@/types';

const testRecipe: Recipe = {
  id: 1,
  name: "Test",
  time: 20,
  difficulty: "Easy",
  servings: 4,
  ingredients: ["chicken"],
  steps: ["Step 1"]
};
```

---

### ISSUE #3: Create Static Data Files (Ingredients & Recipes)

**Labels:** `data`, `p0`, `blocking`  
**Estimated Time:** 45 minutes  
**Dependencies:** #2  

#### WHY (Context from PRD)
PRD Section 3.3 defines the standard ingredient list (26 items) and requires 25 curated recipes. These are the core data that drives recipe matching.

#### WHAT (Requirements)
1. Create ingredients.ts with all 26 ingredients organized by category
2. Create recipes.json with 25 kid-friendly, healthy recipes (15-30min each)

#### HOW (Technical Approach from TDD)

**Step 1: Create data directory**
```bash
mkdir -p src/data
```

**Step 2: Create ingredients data**

File: `src/data/ingredients.ts`
```typescript
import { Ingredient } from '@/types';

export const INGREDIENTS: Ingredient[] = [
  // Proteins (8)
  { id: 'chicken-breast', name: 'Chicken breast', category: 'protein', commonlyUsed: true },
  { id: 'ground-beef', name: 'Ground beef', category: 'protein', commonlyUsed: true },
  { id: 'ground-turkey', name: 'Ground turkey', category: 'protein', commonlyUsed: true },
  { id: 'pork-chops', name: 'Pork chops', category: 'protein', commonlyUsed: false },
  { id: 'eggs', name: 'Eggs', category: 'protein', commonlyUsed: true },
  { id: 'canned-tuna', name: 'Canned tuna', category: 'protein', commonlyUsed: false },
  { id: 'tofu', name: 'Tofu', category: 'protein', commonlyUsed: false },
  { id: 'shrimp', name: 'Shrimp', category: 'protein', commonlyUsed: false },
  
  // Vegetables (12)
  { id: 'broccoli', name: 'Broccoli', category: 'vegetable', commonlyUsed: true },
  { id: 'carrots', name: 'Carrots', category: 'vegetable', commonlyUsed: true },
  { id: 'bell-peppers', name: 'Bell peppers', category: 'vegetable', commonlyUsed: true },
  { id: 'onions', name: 'Onions', category: 'vegetable', commonlyUsed: true },
  { id: 'tomatoes', name: 'Tomatoes', category: 'vegetable', commonlyUsed: true },
  { id: 'spinach', name: 'Spinach/leafy greens', category: 'vegetable', commonlyUsed: true },
  { id: 'zucchini', name: 'Zucchini', category: 'vegetable', commonlyUsed: false },
  { id: 'cauliflower', name: 'Cauliflower', category: 'vegetable', commonlyUsed: false },
  { id: 'green-beans', name: 'Green beans', category: 'vegetable', commonlyUsed: false },
  { id: 'frozen-veg', name: 'Frozen mixed vegetables', category: 'vegetable', commonlyUsed: true },
  { id: 'potatoes', name: 'Potatoes', category: 'vegetable', commonlyUsed: true },
  { id: 'sweet-potatoes', name: 'Sweet potatoes', category: 'vegetable', commonlyUsed: false },
  
  // Dairy & Extras (6)
  { id: 'milk', name: 'Milk', category: 'dairy', commonlyUsed: true },
  { id: 'cheese', name: 'Cheese', category: 'dairy', commonlyUsed: true },
  { id: 'butter', name: 'Butter', category: 'dairy', commonlyUsed: true },
  { id: 'sour-cream', name: 'Sour cream/yogurt', category: 'dairy', commonlyUsed: false },
  { id: 'tortillas', name: 'Tortillas', category: 'extra', commonlyUsed: false },
  { id: 'bread', name: 'Bread', category: 'extra', commonlyUsed: true },
];

export const getIngredientsByCategory = (category: Ingredient['category']): Ingredient[] => {
  return INGREDIENTS.filter(i => i.category === category);
};
```**Step 3: Create recipes data**

File: `src/data/recipes.json`

**NOTE:** Due to length, I'll provide a condensed version. Use Claude CLI to generate all 25 recipes later.
```json
{
  "recipes": [
    {
      "id": 1,
      "name": "One-Pan Chicken & Broccoli Rice",
      "time": 25,
      "difficulty": "Easy",
      "servings": 4,
      "ingredients": [
        "chicken breast (1 lb, diced)",
        "broccoli (2 cups, chopped)",
        "rice (1 cup, uncooked)",
        "onion (1 medium, diced)",
        "soy sauce (2 tbsp)"
      ],
      "steps": [
        "Heat 1 tbsp oil in large pan over medium-high heat",
        "Add diced chicken, cook 5-6 minutes until browned",
        "Add broccoli and onions, cook 3 minutes",
        "Add rice and 2 cups water, bring to boil",
        "Reduce heat to low, cover, simmer 15 minutes",
        "Stir in soy sauce, serve hot"
      ],
      "tags": ["one-pan", "kid-friendly"]
    }
  ]
}
```

**NOTE:** Ask Claude CLI to generate remaining 24 recipes following same format.

#### ACCEPTANCE CRITERIA
- [ ] `src/data/ingredients.ts` exports INGREDIENTS array (26 items)
- [ ] `src/data/recipes.json` contains 25 recipes
- [ ] All recipes 15-30min, serve 4, Easy/Medium difficulty
- [ ] No TypeScript errors

---

### ISSUE #4: Create Utility Functions (Recipe Matching)

**Labels:** `utils`, `p0`, `blocking`  
**Estimated Time:** 45 minutes  
**Dependencies:** #2, #3  

#### WHY (Context from PRD)
PRD Section 3.1 (FR-2) requires recipe matching with percentage calculation. Core business logic.

#### WHAT (Requirements)
Create utility functions for calculating match percentage and finding recipe matches, with unit tests.

#### HOW (Technical Approach from TDD)

File: `src/utils/recipeMatching.ts`
```typescript
import { Recipe, RecipeMatch } from '@/types';

export const calculateMatchPercentage = (
  recipeIngredients: string[],
  userIngredients: string[]
): number => {
  if (recipeIngredients.length === 0) return 0;

  const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase().trim());
  let matchCount = 0;

  for (const recipeIng of recipeIngredients) {
    const normalizedRecipeIng = recipeIng.toLowerCase().trim();
    const hasMatch = normalizedUserIngredients.some(userIng => {
      return normalizedRecipeIng.includes(userIng) || userIng.includes(normalizedRecipeIng);
    });
    if (hasMatch) matchCount++;
  }

  return Math.round((matchCount / recipeIngredients.length) * 100);
};

export const findRecipeMatches = (
  userIngredients: string[],
  recipes: Recipe[],
  minMatchPercentage: number = 50,
  maxResults: number = 5
): RecipeMatch[] => {
  const matches: RecipeMatch[] = recipes.map(recipe => {
    const matchPercentage = calculateMatchPercentage(recipe.ingredients, userIngredients);
    const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase().trim());
    
    const missingIngredients = recipe.ingredients.filter(recipeIng => {
      const normalized = recipeIng.toLowerCase().trim();
      return !normalizedUserIngredients.some(
        userIng => normalized.includes(userIng) || userIng.includes(normalized)
      );
    });

    return {
      recipe,
      matchPercentage,
      missingIngredients,
      hasAllIngredients: missingIngredients.length === 0,
    };
  });

  return matches
    .filter(m => m.matchPercentage >= minMatchPercentage)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, maxResults);
};
```

File: `src/utils/recipeMatching.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { calculateMatchPercentage, findRecipeMatches } from './recipeMatching';

describe('calculateMatchPercentage', () => {
  it('returns 100% when user has all ingredients', () => {
    expect(calculateMatchPercentage(
      ['chicken', 'broccoli'], 
      ['chicken', 'broccoli', 'rice']
    )).toBe(100);
  });

  it('returns 75% when user has 3 of 4 ingredients', () => {
    expect(calculateMatchPercentage(
      ['chicken', 'broccoli', 'rice', 'soy sauce'],
      ['chicken', 'broccoli', 'rice']
    )).toBe(75);
  });

  it('handles partial matches', () => {
    expect(calculateMatchPercentage(
      ['chicken breast (1 lb)'],
      ['chicken']
    )).toBe(100);
  });
});
```

#### ACCEPTANCE CRITERIA
- [ ] Functions implemented correctly
- [ ] All unit tests pass
- [ ] Test coverage >90%
- [ ] No TypeScript errors

---

### ISSUE #5: Create Utility Functions (Ingredient Parsing)

**Labels:** `utils`, `p0`, `blocking`  
**Estimated Time:** 30 minutes  
**Dependencies:** #2  

#### WHY (Context from PRD)
PRD Section 3.1 (FR-1) requires parsing user-typed ingredients from text input.

#### WHAT (Requirements)
Parse comma/space-separated text into normalized ingredient array, with tests.

#### HOW (Technical Approach from TDD)

File: `src/utils/ingredientParsing.ts`
```typescript
export const parseIngredients = (input: string): string[] => {
  if (!input || input.trim().length === 0) return [];

  const items = input.split(/[,\s]+/);
  const processed = items
    .map(item => item.trim().toLowerCase())
    .filter(item => item.length > 0);

  return Array.from(new Set(processed));
};
```

File: `src/utils/ingredientParsing.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { parseIngredients } from './ingredientParsing';

describe('parseIngredients', () => {
  it('parses comma-separated', () => {
    expect(parseIngredients('chicken, broccoli')).toEqual(['chicken', 'broccoli']);
  });

  it('parses space-separated', () => {
    expect(parseIngredients('chicken broccoli')).toEqual(['chicken', 'broccoli']);
  });

  it('trims and lowercases', () => {
    expect(parseIngredients('  Chicken  ,  BROCCOLI  ')).toEqual(['chicken', 'broccoli']);
  });

  it('removes duplicates', () => {
    expect(parseIngredients('chicken, chicken, broccoli')).toEqual(['chicken', 'broccoli']);
  });
});
```

#### ACCEPTANCE CRITERIA
- [ ] Function implemented
- [ ] All tests pass
- [ ] Handles edge cases
- [ ] No TypeScript errors

---

### ISSUE #6: Create Common UI Components

**Labels:** `components`, `p0`, `blocking`  
**Estimated Time:** 30 minutes  
**Dependencies:** #1, #2  

#### WHY (Context from PRD)
Reusable components ensure consistent UI/UX across the app per PRD Section 5.

#### WHAT (Requirements)
Create Button, LoadingSpinner, and ErrorMessage components.

#### HOW (Technical Approach from TDD)

**Step 1: Create directory**
```bash
mkdir -p src/components/Common
```

File: `src/components/Common/Button.tsx`
```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };
  
  const sizeStyles = {
    small: 'px-3 py-2 text-sm min-h-[36px]',
    medium: 'px-4 py-3 text-base min-h-[44px]',
    large: 'px-6 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

File: `src/components/Common/LoadingSpinner.tsx`
```typescript
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  );
};
```

File: `src/components/Common/ErrorMessage.tsx`
```typescript
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      )}
    </div>
  );
};
```

File: `src/components/Common/index.ts`
```typescript
export { Button } from './Button';
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorMessage } from './ErrorMessage';
```

#### ACCEPTANCE CRITERIA
- [ ] All three components created
- [ ] Components are fully typed
- [ ] Tailwind classes work correctly
- [ ] Touch-friendly sizes (44px min height)
- [ ] Components exported from index.ts

---

### ISSUE #7: Create Ingredient Input Components

**Labels:** `components`, `p0`, `blocking`  
**Estimated Time:** 60 minutes  
**Dependencies:** #2, #3, #6  

#### WHY (Context from PRD)
PRD FR-1 requires hybrid input (text + checkboxes) for ingredient selection.

#### WHAT (Requirements)
Create TextInput, CheckboxGrid, CheckboxCategory, and IngredientInput components.

#### HOW (Technical Approach from TDD)

**Step 1: Create directory**
```bash
mkdir -p src/components/IngredientInput
```

File: `src/components/IngredientInput/TextInput.tsx`
```typescript
import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = 'Type extras: salmon, lemon...',
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    />
  );
};
```

File: `src/components/IngredientInput/CheckboxCategory.tsx`
```typescript
import React from 'react';
import { Ingredient } from '@/types';

interface CheckboxCategoryProps {
  title: string;
  ingredients: Ingredient[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export const CheckboxCategory: React.FC<CheckboxCategoryProps> = ({
  title,
  ingredients,
  selected,
  onToggle,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ingredients.map((ingredient) => (
          <label
            key={ingredient.id}
            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selected.has(ingredient.id)}
              onChange={() => onToggle(ingredient.id)}
              className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">{ingredient.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
```

File: `src/components/IngredientInput/CheckboxGrid.tsx`
```typescript
import React from 'react';
import { Ingredient } from '@/types';
import { CheckboxCategory } from './CheckboxCategory';

interface CheckboxGridProps {
  ingredients: Ingredient[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}

export const CheckboxGrid: React.FC<CheckboxGridProps> = ({
  ingredients,
  selected,
  onChange,
}) => {
  const proteins = ingredients.filter(i => i.category === 'protein');
  const vegetables = ingredients.filter(i => i.category === 'vegetable');
  const dairy = ingredients.filter(i => i.category === 'dairy' || i.category === 'extra');

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
        ingredients={dairy}
        selected={selected}
        onToggle={handleToggle}
      />
    </div>
  );
};
```

File: `src/components/IngredientInput/IngredientInput.tsx`
```typescript
import React from 'react';
import { TextInput } from './TextInput';
import { CheckboxGrid } from './CheckboxGrid';
import { Button } from '@/components/Common';
import { Ingredient } from '@/types';

interface IngredientInputProps {
  ingredients: Ingredient[];
  selectedIngredients: Set<string>;
  customIngredients: string[];
  onSelectedChange: (selected: Set<string>) => void;
  onCustomChange: (custom: string[]) => void;
  onSubmit: () => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  selectedIngredients,
  customIngredients,
  onSelectedChange,
  onCustomChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          What's in your fridge?
        </h2>
        <TextInput
          value={customIngredients.join(', ')}
          onChange={(value) => {
            const parsed = value.split(/[,\s]+/).filter(Boolean);
            onCustomChange(parsed);
          }}
        />
      </div>

      <div>
        <p className="text-gray-600 mb-4">Or uncheck what you don't have:</p>
        <CheckboxGrid
          ingredients={ingredients}
          selected={selectedIngredients}
          onChange={onSelectedChange}
        />
      </div>

      <Button onClick={onSubmit} className="w-full" size="large">
        🔍 Find Recipes
      </Button>
    </div>
  );
};
```

#### ACCEPTANCE CRITERIA
- [ ] All components created
- [ ] Text input parses ingredients
- [ ] Checkboxes organized by category
- [ ] Pre-checked logic works
- [ ] Mobile responsive (2-4 columns)
- [ ] Touch targets 44px minimum

---### ISSUE #8: Create Recipe Display Components

**Labels:** `components`, `p0`, `blocking`  
**Estimated Time:** 60 minutes  
**Dependencies:** #2, #6  

#### WHY (Context from PRD)
PRD FR-2 requires displaying recipe matches with percentage, time, and details.

#### WHAT (Requirements)
Create RecipeCard, RecipeDetail, and RecipeResults components.

#### HOW (Technical Approach from TDD)

**Step 1: Create directory**
```bash
mkdir -p src/components/RecipeResults
```

File: `src/components/RecipeResults/RecipeCard.tsx`
```typescript
import React from 'react';
import { RecipeMatch } from '@/types';

interface RecipeCardProps {
  match: RecipeMatch;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ match, onClick }) => {
  const { recipe, matchPercentage } = match;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {recipe.name}
      </h3>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
        <span className="flex items-center gap-1">
          ⭐ {matchPercentage}% Match
        </span>
        <span className="flex items-center gap-1">
          ⏱ {recipe.time} min
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
          {recipe.difficulty}
        </span>
      </div>
      
      <div className="text-sm text-blue-600 flex items-center gap-1">
        View Recipe →
      </div>
    </button>
  );
};
```

File: `src/components/RecipeResults/RecipeDetail.tsx`
```typescript
import React from 'react';
import { Recipe } from '@/types';
import { Button } from '@/components/Common';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
      >
        ← Back to Results
      </button>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {recipe.name}
      </h2>
      
      <div className="flex items-center gap-4 text-gray-600 mb-6">
        <span>⏱ {recipe.time} minutes</span>
        <span>👥 Serves {recipe.servings}</span>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
          {recipe.difficulty}
        </span>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Ingredients:
        </h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span className="text-gray-700">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Instructions:
        </h3>
        <ol className="space-y-3">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-700 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
```

File: `src/components/RecipeResults/RecipeResults.tsx`
```typescript
import React from 'react';
import { RecipeMatch } from '@/types';
import { RecipeCard } from './RecipeCard';
import { Button } from '@/components/Common';

interface RecipeResultsProps {
  matches: RecipeMatch[];
  onRecipeSelect: (match: RecipeMatch) => void;
  onBackToInput: () => void;
  onGenerateRecipe?: () => void;
}

export const RecipeResults: React.FC<RecipeResultsProps> = ({
  matches,
  onRecipeSelect,
  onBackToInput,
  onGenerateRecipe,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBackToInput}
        className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
      >
        ← Back to Ingredients
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Your Matches ({matches.length})
      </h2>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            No recipes found with your ingredients.
          </p>
          <p className="text-gray-500 mb-6">
            Try adding more ingredients or generating a custom recipe.
          </p>
          {onGenerateRecipe && (
            <Button onClick={onGenerateRecipe} variant="primary">
              ✨ Generate New Recipe
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {matches.map((match) => (
              <RecipeCard
                key={match.recipe.id}
                match={match}
                onClick={() => onRecipeSelect(match)}
              />
            ))}
          </div>

          {onGenerateRecipe && (
            <div className="border-t pt-6">
              <Button
                onClick={onGenerateRecipe}
                variant="secondary"
                className="w-full"
              >
                ✨ Generate New Recipe
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

#### ACCEPTANCE CRITERIA
- [ ] All components render correctly
- [ ] Recipe cards show match %, time, difficulty
- [ ] Recipe detail shows full ingredients and steps
- [ ] Back navigation works
- [ ] Mobile responsive
- [ ] Empty state handles no matches

---

### ISSUE #9: Create Main App Component with State Management

**Labels:** `app`, `p0`, `blocking`  
**Estimated Time:** 60 minutes  
**Dependencies:** #2, #3, #4, #5, #7, #8  

#### WHY (Context from PRD)
Main App component coordinates all state and view switching per TDD Section 5.2.1.

#### WHAT (Requirements)
Create App.tsx with state management, view switching, and recipe matching logic.

#### HOW (Technical Approach from TDD)

File: `src/App.tsx`
```typescript
import React, { useState } from 'react';
import { IngredientInput } from '@/components/IngredientInput/IngredientInput';
import { RecipeResults } from '@/components/RecipeResults/RecipeResults';
import { RecipeDetail } from '@/components/RecipeResults/RecipeDetail';
import { INGREDIENTS } from '@/data/ingredients';
import recipesData from '@/data/recipes.json';
import { findRecipeMatches } from '@/utils/recipeMatching';
import { parseIngredients } from '@/utils/ingredientParsing';
import { Recipe, RecipeMatch, ViewMode } from '@/types';

function App() {
  // Initialize with commonly used ingredients pre-checked
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set(INGREDIENTS.filter(i => i.commonlyUsed).map(i => i.id))
  );
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);
  const [recipeMatches, setRecipeMatches] = useState<RecipeMatch[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleFindRecipes = () => {
    // Combine selected ingredient IDs with their names, plus custom ingredients
    const selectedIngredientNames = Array.from(selectedIngredients).map(
      id => INGREDIENTS.find(i => i.id === id)?.name || id
    );
    const allIngredients = [...selectedIngredientNames, ...customIngredients];
    
    const matches = findRecipeMatches(allIngredients, recipesData.recipes as Recipe[]);
    setRecipeMatches(matches);
    setViewMode('results');
  };

  const handleRecipeSelect = (match: RecipeMatch) => {
    setSelectedRecipe(match.recipe);
    setViewMode('detail');
  };

  const handleBackToInput = () => {
    setViewMode('input');
  };

  const handleBackToResults = () => {
    setViewMode('results');
  };

  const handleCustomIngredientsChange = (text: string) => {
    const parsed = parseIngredients(text);
    setCustomIngredients(parsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            🍳 Fridge Roulette
          </h1>
          <p className="text-gray-600 mt-1">What's for dinner tonight?</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {viewMode === 'input' && (
          <IngredientInput
            ingredients={INGREDIENTS}
            selectedIngredients={selectedIngredients}
            customIngredients={customIngredients}
            onSelectedChange={setSelectedIngredients}
            onCustomChange={(custom) => handleCustomIngredientsChange(custom.join(', '))}
            onSubmit={handleFindRecipes}
          />
        )}

        {viewMode === 'results' && (
          <RecipeResults
            matches={recipeMatches}
            onRecipeSelect={handleRecipeSelect}
            onBackToInput={handleBackToInput}
          />
        )}

        {viewMode === 'detail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBackToResults}
          />
        )}
      </main>
    </div>
  );
}

export default App;
```

Update `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### ACCEPTANCE CRITERIA
- [ ] App renders without errors
- [ ] Ingredients pre-checked on load (commonlyUsed items)
- [ ] Text input updates customIngredients state
- [ ] "Find Recipes" triggers recipe matching
- [ ] View switches between input/results/detail
- [ ] Recipe selection works
- [ ] Back navigation works
- [ ] No console errors

---

### ISSUE #10: Create API Utility for AI Generation

**Labels:** `api`, `p1`, `backend`  
**Estimated Time:** 30 minutes  
**Dependencies:** #2  

#### WHY (Context from PRD)
PRD FR-4 requires AI recipe generation via Anthropic Claude API.

#### WHAT (Requirements)
Create API utility function that calls Vercel serverless function for recipe generation.

#### HOW (Technical Approach from TDD)

File: `src/utils/api.ts`
```typescript
import { Recipe } from '@/types';

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const generateRecipe = async (ingredients: string[]): Promise<Recipe> => {
  try {
    const response = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new APIError('Daily limit reached. Please try again tomorrow.');
      }
      if (response.status >= 500) {
        throw new APIError('Server error. Please try again in a moment.');
      }
      throw new APIError('Failed to generate recipe. Please try again.');
    }

    const data = await response.json();

    if (!data.recipe) {
      throw new APIError('Invalid response from server.');
    }

    return data.recipe;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new APIError('Network error. Check your connection and try again.');
    }

    throw new APIError('An unexpected error occurred. Please try again.');
  }
};
```

#### ACCEPTANCE CRITERIA
- [ ] Function handles all error cases
- [ ] Returns typed Recipe object
- [ ] Proper error messages for different failures
- [ ] No TypeScript errors

---

### ISSUE #11: Create Vercel Serverless Function for AI Generation

**Labels:** `backend`, `p1`, `serverless`  
**Estimated Time:** 45 minutes  
**Dependencies:** #2, #10  

#### WHY (Context from PRD)
PRD FR-4 requires AI recipe generation. Serverless function hides API key from client.

#### WHAT (Requirements)
Create Vercel serverless function that calls Anthropic Claude API to generate recipes.

#### HOW (Technical Approach from TDD)

**Step 1: Create API directory**
```bash
mkdir -p api
```

File: `api/generate-recipe.ts`
```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ingredients } = req.body;

  // Validate input
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'Invalid ingredients' });
  }

  // Limit ingredients to prevent abuse
  if (ingredients.length > 20) {
    return res.status(400).json({ error: 'Too many ingredients (max 20)' });
  }

  try {
    const prompt = `Create a healthy, kid-friendly dinner recipe using these ingredients: ${ingredients.join(', ')}.

Requirements:
- 15-30 minutes total cooking time
- Include protein and vegetables
- Simple cooking techniques (sauté, bake, simmer)
- Serves 4 people
- Kid-friendly (not too spicy)
- Maximum 10 ingredients total
- 5-8 simple steps

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "name": "Recipe Name",
  "time": 25,
  "difficulty": "Easy",
  "servings": 4,
  "ingredients": [
    "chicken breast (1 lb, diced)",
    "broccoli (2 cups, chopped)"
  ],
  "steps": [
    "Heat oil in pan...",
    "Add chicken..."
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const recipe = JSON.parse(jsonMatch[0]);

    // Add metadata
    recipe.id = Date.now();
    recipe.tags = ['ai-generated'];

    return res.status(200).json({ recipe });
  } catch (error) {
    console.error('Recipe generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate recipe. Please try again.',
    });
  }
}
```

**Step 2: Create vercel.json**

File: `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Step 3: Update .env.example**
```
ANTHROPIC_API_KEY=your-api-key-here
```

#### ACCEPTANCE CRITERIA
- [ ] Serverless function created
- [ ] Validates input correctly
- [ ] Calls Anthropic API
- [ ] Returns valid Recipe JSON
- [ ] Handles errors gracefully
- [ ] Environment variable configured

---

### ISSUE #12: Integrate AI Generation into App

**Labels:** `app`, `p1`, `feature`  
**Estimated Time:** 30 minutes  
**Dependencies:** #9, #10, #11  

#### WHY (Context from PRD)
PRD FR-4 requires AI generation button in results view.

#### WHAT (Requirements)
Add AI generation state and button to App component.

#### HOW (Technical Approach from TDD)

Update `src/App.tsx`:
```typescript
import { generateRecipe } from '@/utils/api';
import { LoadingSpinner, ErrorMessage } from '@/components/Common';

// Add to existing state
const [isGenerating, setIsGenerating] = useState(false);
const [aiError, setAiError] = useState<string | null>(null);

// Add handler
const handleGenerateRecipe = async () => {
  setIsGenerating(true);
  setAiError(null);
  
  try {
    const selectedIngredientNames = Array.from(selectedIngredients).map(
      id => INGREDIENTS.find(i => i.id === id)?.name || id
    );
    const allIngredients = [...selectedIngredientNames, ...customIngredients];
    
    const recipe = await generateRecipe(allIngredients);
    
    // Add to results
    const newMatch: RecipeMatch = {
      recipe,
      matchPercentage: 100,
      missingIngredients: [],
      hasAllIngredients: true,
    };
    
    setRecipeMatches([newMatch, ...recipeMatches]);
    setSelectedRecipe(recipe);
    setViewMode('detail');
  } catch (error) {
    setAiError(error instanceof Error ? error.message : 'Failed to generate recipe');
  } finally {
    setIsGenerating(false);
  }
};

// Update RecipeResults call
<RecipeResults
  matches={recipeMatches}
  onRecipeSelect={handleRecipeSelect}
  onBackToInput={handleBackToInput}
  onGenerateRecipe={handleGenerateRecipe}
  isGenerating={isGenerating}
  aiError={aiError}
/>
```

Update `src/components/RecipeResults/RecipeResults.tsx`:
```typescript
interface RecipeResultsProps {
  // ... existing props
  isGenerating?: boolean;
  aiError?: string | null;
}

// Add at bottom
{onGenerateRecipe && (
  <div className="border-t pt-6">
    {aiError && <ErrorMessage message={aiError} onRetry={onGenerateRecipe} />}
    
    <Button
      onClick={onGenerateRecipe}
      variant="secondary"
      className="w-full"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <LoadingSpinner />
          Generating...
        </>
      ) : (
        '✨ Generate New Recipe'
      )}
    </Button>
  </div>
)}
```

#### ACCEPTANCE CRITERIA
- [ ] AI generation button appears
- [ ] Loading state shows spinner
- [ ] Generated recipe added to results
- [ ] Error handling works
- [ ] User navigates to generated recipe

---### ISSUE #13: Add Responsive Styling and Mobile Optimization

**Labels:** `ui`, `p0`, `mobile`  
**Estimated Time:** 30 minutes  
**Dependencies:** #1, #7, #8, #9  

#### WHY (Context from PRD)
PRD NFR-1 requires mobile-first design with <2s load time. TDD Section 8 specifies responsive breakpoints.

#### WHAT (Requirements)
Ensure all components are mobile-responsive and meet touch target requirements.

#### HOW (Technical Approach from TDD)

Update `src/index.css`:
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Mobile-first base styles */
@layer base {
  html {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  body {
    @apply text-gray-900 bg-gray-50;
  }
  
  /* Ensure touch targets are 44x44px minimum */
  button,
  a,
  input[type="checkbox"],
  input[type="radio"] {
    @apply min-h-[44px];
  }
}

@layer utilities {
  /* Container with responsive padding */
  .container {
    @apply mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl;
  }
  
  /* Touch-friendly spacing */
  .touch-spacing {
    @apply p-3 sm:p-4;
  }
}
````

Update checkbox sizes in `CheckboxCategory.tsx`:
````typescript
<input
  type="checkbox"
  className="w-6 h-6 text-primary-500 rounded focus:ring-primary-500 cursor-pointer"
  // Minimum 44x44px clickable area via parent padding
/>
````

#### ACCEPTANCE CRITERIA
- [ ] All touch targets ≥44px
- [ ] Text ≥16px (no zoom on iOS)
- [ ] Responsive grid layouts work
- [ ] No horizontal scroll on mobile
- [ ] Test on real mobile device

---

### ISSUE #14: Create README and Documentation

**Labels:** `docs`, `p1`  
**Estimated Time:** 20 minutes  
**Dependencies:** #1  

#### WHY (Context from TDD)
TDD Section 16.4 requires clear documentation for maintainability.

#### WHAT (Requirements)
Create README with setup instructions, development workflow, and project overview.

#### HOW (Technical Approach)

File: `README.md`
````markdown
# Fridge Roulette 🍳

Weeknight dinner recipe finder for busy parents. Match recipes to ingredients you already have.

## Features

- 🔍 Smart recipe matching based on available ingredients
- 📱 Mobile-first design
- ✨ AI-powered recipe generation for unusual ingredient combos
- 🚀 Fast performance (<2s load time)
- 🎯 Kid-friendly, healthy recipes (15-30 min)

## Tech Stack

- React 18.3 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Vercel (hosting)
- Anthropic Claude API (AI generation)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fridge-roulette.git
cd fridge-roulette
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

4. Run development server
```bash
npm run dev
```

Visit http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure
````
src/
├── components/        # React components
│   ├── Common/       # Reusable UI components
│   ├── IngredientInput/
│   └── RecipeResults/
├── data/             # Static data (ingredients, recipes)
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── App.tsx           # Main app component