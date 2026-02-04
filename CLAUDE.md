# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fridge Roulette is a mobile-first web app that helps working parents decide what to cook for weeknight dinners by matching available ingredients to recipes, with AI-powered generation for unusual ingredient combinations.

## Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (tsc && vite build)
npm run preview      # Preview production build
npm run test         # Run tests (vitest run)
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Vercel

**Pattern:** JAMstack SPA with serverless function for AI

```
User's Browser (React SPA)
    ├── IngredientInput (checkboxes + text input)
    ├── Recipe Matching Logic (client-side)
    ├── RecipeResults (display matches)
    └── Static recipes.json
           ↓
    AI Generation (optional)
           ↓
Vercel Serverless Function (/api/generate-recipe.ts)
           ↓
Anthropic Claude API (claude-sonnet-4-5-20250929)
```

**Component Hierarchy:**
```
App.tsx (state management, view switching)
├── IngredientInput/
│   ├── TextInput (custom ingredients)
│   └── CheckboxGrid → CheckboxCategory (26 standard ingredients)
├── RecipeResults/
│   ├── RecipeCard (match %, time, difficulty)
│   ├── RecipeDetail (full recipe view)
│   └── AIGenerateButton
└── Common/
    ├── Button, LoadingSpinner, ErrorMessage
```

**State Management:** React useState hooks (no Redux/Context needed for v1.0)

**Data Flow:** Unidirectional - user input → state update → recipe matching → UI re-render

## Key Files

- `src/data/ingredients.ts` - 26 standard ingredients with categories and commonlyUsed flags
- `src/data/recipes.json` - 25 curated recipes (15-30min, serves 4, Easy/Medium)
- `src/utils/recipeMatching.ts` - Match percentage calculation with partial string matching
- `src/utils/ingredientParsing.ts` - Parse comma/space-separated input
- `api/generate-recipe.ts` - Vercel serverless function for Claude API

## Key Interfaces

```typescript
interface Recipe {
  id: number;
  name: string;
  time: number;        // 15-30 minutes
  difficulty: 'Easy' | 'Medium';
  servings: number;    // always 4
  ingredients: string[];
  steps: string[];
  tags?: string[];
}

interface RecipeMatch {
  recipe: Recipe;
  matchPercentage: number;  // 0-100, filtered at 50% minimum
  missingIngredients: string[];
  hasAllIngredients: boolean;
}
```

## Recipe Matching Logic

- Match percentage = (matched ingredients / total recipe ingredients) × 100
- Partial string matching: "chicken" matches "chicken breast (1 lb, diced)"
- Results filtered to ≥50% match, sorted highest first, max 5 results
- Pantry staples (rice, pasta, oil, spices) assumed available, not counted

## Mobile-First Requirements

- Touch targets: minimum 44×44px
- Base font: 16px (prevents iOS zoom)
- Responsive grid: 2 cols mobile → 3 cols tablet → 4 cols desktop
- Target load time: <2s on 4G

## Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Required for AI generation
```

Set in `.env.local` for development, Vercel dashboard for production.

## AI Generation Constraints

- Model: claude-sonnet-4-5-20250929
- Temperature: 0.7
- Max tokens: 1000
- Recipe constraints enforced via prompt: 15-30min, kid-friendly, protein+veg, simple techniques
