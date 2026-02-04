TECHNICAL DESIGN DOCUMENT (TDD)
Fridge Roulette - Weeknight Dinner Recipe Finder
Version: 1.0
Date: February 3, 2026
Author: Engineering Team
Status: Final - Ready for Implementation
Related Documents: PRD v1.0

Table of Contents

System Overview
Architecture Design
Technology Stack
Data Models
Component Specifications
API Design
State Management
UI/UX Implementation
Performance Optimization
Testing Strategy
Deployment & DevOps
Security Considerations
Error Handling
Monitoring & Observability
Development Workflow
Code Standards
Migration Path


1. System Overview
1.1 High-Level Architecture
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React SPA (Vite + Tailwind)             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐ │  │
│  │  │ Input       │  │ Recipe       │  │ Recipe   │ │  │
│  │  │ Component   │→ │ Matching     │→ │ Display  │ │  │
│  │  └─────────────┘  │ Logic        │  └──────────┘ │  │
│  │                   └──────────────┘                │  │
│  │         ↓                                         │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │   recipes.json (static data)             │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
│                         ↓                                │
│                   (AI Generation)                        │
│                         ↓                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Vercel Serverless Function                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  /api/generate-recipe.js                          │  │
│  │  - Receives ingredient list                       │  │
│  │  - Calls Anthropic Claude API                     │  │
│  │  - Returns generated recipe JSON                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Anthropic Claude API                        │
│  - Model: claude-sonnet-4-5-20250929                    │
│  - Free tier usage tracking                             │
└─────────────────────────────────────────────────────────┘
1.2 System Characteristics
Type: Single Page Application (SPA)
Deployment Model: Static site + serverless functions
Data Flow: Client-side only (no database)
State Persistence: None (ephemeral, session-based)
API Calls: Only for AI recipe generation
1.3 Design Principles

Simplicity First: Minimize dependencies, maximize maintainability
Mobile-First: Primary use case is phone in kitchen
Zero Configuration: No user setup required
Fail Gracefully: AI failure shouldn't break core functionality
Performance Budget: <2s load, <100ms interactions
Accessibility: WCAG 2.1 AA compliance target


2. Architecture Design
2.1 System Architecture Pattern
Pattern: JAMstack (JavaScript, APIs, Markup)
Justification:

✅ Perfect for static content with dynamic behavior
✅ Excellent performance (CDN-served)
✅ Simple deployment (Vercel handles everything)
✅ Cost-effective (free tier sufficient)
✅ Scales automatically

2.2 Component Architecture
Pattern: Component-Based Architecture (React)
App (Root)
├── IngredientInputSection
│   ├── TextInput
│   └── CheckboxGrid
│       ├── CheckboxCategory (Proteins)
│       ├── CheckboxCategory (Vegetables)
│       └── CheckboxCategory (Dairy/Extras)
├── RecipeResults
│   ├── RecipeCard (×3-5)
│   │   └── RecipeDetail (modal/expansion)
│   └── AIGenerateButton
└── LoadingSpinner
Component Responsibility:

Each component manages its own UI state
Parent components pass data down via props
Child components emit events up via callbacks
No prop drilling (max 2 levels deep)

2.3 Data Flow Architecture
Pattern: Unidirectional Data Flow
User Input (checkboxes/text)
    ↓
State Update (useState)
    ↓
Recipe Matching Logic (pure function)
    ↓
Filtered Results
    ↓
UI Re-render (React)
Key Characteristics:

Single source of truth (component state)
Predictable state transitions
Easy to debug (React DevTools)
No side effects in render


3. Technology Stack
3.1 Frontend Stack
LayerTechnologyVersionJustificationFrameworkReact18.3.xIndustry standard, excellent DX, component reusabilityBuild ToolVite5.xFast HMR, modern ESM support, zero configStylingTailwind CSS3.4.xRapid development, consistent design, mobile-firstLanguageTypeScript5.xType safety, better IDE support, catch bugs earlyTestingVitest1.xFast, Vite-native, modern test runnerLintingESLint8.xCode quality, consistent styleFormattingPrettier3.xAutomated code formatting
3.2 Backend Stack
LayerTechnologyJustificationHostingVercelFree tier, automatic deployments, serverless functionsServerlessVercel FunctionsSimple, integrated with deploymentAI APIAnthropic ClaudeHigh-quality generation, generous free tier
3.3 Development Tools
ToolPurposeCursorPrimary code editor with AI assistanceClaude CLIAgentic code generationGitVersion controlGitHubRepository hosting, CI/CD triggerChrome DevToolsDebugging, performance profiling
3.4 Package Dependencies
Core Dependencies:
json{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@anthropic-ai/sdk": "^0.20.0"
  }
}
Dev Dependencies:
json{
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.4",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "vitest": "^1.3.1",
    "@testing-library/react": "^14.2.1",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5"
  }
}
Dependency Justification:

Minimal dependencies = faster installs, fewer security risks
All packages have active maintenance
TypeScript for type safety without runtime overhead
Testing libraries for core logic validation


4. Data Models
4.1 Recipe Data Model
TypeScript Interface:
typescriptinterface Recipe {
  id: number;
  name: string;
  time: number; // minutes
  difficulty: 'Easy' | 'Medium';
  servings: number;
  ingredients: string[]; // "chicken breast (1 lb, diced)"
  steps: string[];
  tags?: string[]; // optional: ["kid-friendly", "one-pan"]
}
JSON Schema:
json{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "time", "difficulty", "servings", "ingredients", "steps"],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "minLength": 5,
      "maxLength": 100
    },
    "time": {
      "type": "integer",
      "minimum": 15,
      "maximum": 30
    },
    "difficulty": {
      "type": "string",
      "enum": ["Easy", "Medium"]
    },
    "servings": {
      "type": "integer",
      "const": 4
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 4,
      "maxItems": 10
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 5,
      "maxItems": 8
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
Example Recipe:
json{
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
  "tags": ["kid-friendly", "one-pan"]
}
4.2 Ingredient Data Model
TypeScript Interface:
typescriptinterface Ingredient {
  id: string; // "chicken-breast"
  name: string; // "Chicken breast"
  category: 'protein' | 'vegetable' | 'dairy' | 'extra';
  commonlyUsed: boolean; // for pre-check logic
}
Static Data Structure:
typescriptconst INGREDIENTS: Ingredient[] = [
  // Proteins
  { id: 'chicken-breast', name: 'Chicken breast', category: 'protein', commonlyUsed: true },
  { id: 'ground-beef', name: 'Ground beef', category: 'protein', commonlyUsed: true },
  { id: 'ground-turkey', name: 'Ground turkey', category: 'protein', commonlyUsed: true },
  { id: 'pork-chops', name: 'Pork chops', category: 'protein', commonlyUsed: false },
  { id: 'eggs', name: 'Eggs', category: 'protein', commonlyUsed: true },
  { id: 'canned-tuna', name: 'Canned tuna', category: 'protein', commonlyUsed: false },
  { id: 'tofu', name: 'Tofu', category: 'protein', commonlyUsed: false },
  { id: 'shrimp', name: 'Shrimp', category: 'protein', commonlyUsed: false },
  
  // Vegetables
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
  
  // Dairy & Extras
  { id: 'milk', name: 'Milk', category: 'dairy', commonlyUsed: true },
  { id: 'cheese', name: 'Cheese', category: 'dairy', commonlyUsed: true },
  { id: 'butter', name: 'Butter', category: 'dairy', commonlyUsed: true },
  { id: 'sour-cream', name: 'Sour cream/yogurt', category: 'dairy', commonlyUsed: false },
  { id: 'tortillas', name: 'Tortillas', category: 'extra', commonlyUsed: false },
  { id: 'bread', name: 'Bread', category: 'extra', commonlyUsed: true }
];
4.3 Recipe Match Result Model
TypeScript Interface:
typescriptinterface RecipeMatch {
  recipe: Recipe;
  matchPercentage: number; // 0-100
  missingIngredients: string[]; // ingredients user doesn't have
  hasAllIngredients: boolean;
}
Usage:
typescriptconst matches: RecipeMatch[] = [
  {
    recipe: { /* recipe object */ },
    matchPercentage: 95,
    missingIngredients: [],
    hasAllIngredients: true
  },
  {
    recipe: { /* recipe object */ },
    matchPercentage: 75,
    missingIngredients: ["lime juice"],
    hasAllIngredients: false
  }
];
4.4 UI State Model
TypeScript Interface:
typescriptinterface AppState {
  // Input state
  selectedIngredients: Set<string>; // ingredient IDs
  customIngredients: string[]; // typed ingredients
  
  // Results state
  recipeMatches: RecipeMatch[];
  viewMode: 'input' | 'results' | 'detail';
  selectedRecipe: Recipe | null;
  
  // AI state
  isGenerating: boolean;
  generatedRecipe: Recipe | null;
  aiError: string | null;
}
```

---

## **5. Component Specifications**

### **5.1 Component Hierarchy**
```
src/
├── App.tsx (root component)
├── components/
│   ├── IngredientInput/
│   │   ├── IngredientInput.tsx
│   │   ├── TextInput.tsx
│   │   ├── CheckboxGrid.tsx
│   │   └── CheckboxCategory.tsx
│   ├── RecipeResults/
│   │   ├── RecipeResults.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   └── AIGenerateButton.tsx
│   └── Common/
│       ├── Button.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── utils/
│   ├── recipeMatching.ts
│   ├── ingredientParsing.ts
│   └── api.ts
├── data/
│   ├── recipes.json
│   └── ingredients.ts
└── types/
    └── index.ts
5.2 Component Details
5.2.1 App.tsx (Root Component)
Responsibilities:

Manage global application state
Coordinate view switching
Handle recipe matching logic

Props: None (root component)
State:
typescriptconst [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
  new Set(INGREDIENTS.filter(i => i.commonlyUsed).map(i => i.id))
);
const [customIngredients, setCustomIngredients] = useState<string[]>([]);
const [recipeMatches, setRecipeMatches] = useState<RecipeMatch[]>([]);
const [viewMode, setViewMode] = useState<'input' | 'results' | 'detail'>('input');
const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
const [isGenerating, setIsGenerating] = useState(false);
const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
const [aiError, setAiError] = useState<string | null>(null);
Key Methods:
typescriptconst handleFindRecipes = () => {
  const allIngredients = [
    ...Array.from(selectedIngredients),
    ...customIngredients
  ];
  const matches = findRecipeMatches(allIngredients, recipes);
  setRecipeMatches(matches);
  setViewMode('results');
};

const handleGenerateRecipe = async () => {
  setIsGenerating(true);
  setAiError(null);
  try {
    const allIngredients = [
      ...Array.from(selectedIngredients),
      ...customIngredients
    ];
    const recipe = await generateRecipe(allIngredients);
    setGeneratedRecipe(recipe);
  } catch (error) {
    setAiError('Failed to generate recipe. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};
Render Logic:
tsxreturn (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow">
      <h1 className="text-3xl font-bold text-gray-900 p-4">
        🍳 Fridge Roulette
      </h1>
    </header>
    
    <main className="container mx-auto px-4 py-8">
      {viewMode === 'input' && (
        <IngredientInput
          selectedIngredients={selectedIngredients}
          customIngredients={customIngredients}
          onSelectedChange={setSelectedIngredients}
          onCustomChange={setCustomIngredients}
          onSubmit={handleFindRecipes}
        />
      )}
      
      {viewMode === 'results' && (
        <RecipeResults
          matches={recipeMatches}
          generatedRecipe={generatedRecipe}
          isGenerating={isGenerating}
          aiError={aiError}
          onRecipeSelect={(recipe) => {
            setSelectedRecipe(recipe);
            setViewMode('detail');
          }}
          onGenerateRecipe={handleGenerateRecipe}
          onBackToInput={() => setViewMode('input')}
        />
      )}
      
      {viewMode === 'detail' && selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setViewMode('results')}
        />
      )}
    </main>
  </div>
);

5.2.2 IngredientInput Component
File: src/components/IngredientInput/IngredientInput.tsx
Responsibilities:

Display text input for custom ingredients
Display checkbox grid
Handle submission

Props:
typescriptinterface IngredientInputProps {
  selectedIngredients: Set<string>;
  customIngredients: string[];
  onSelectedChange: (ingredients: Set<string>) => void;
  onCustomChange: (ingredients: string[]) => void;
  onSubmit: () => void;
}
Implementation:
tsxexport const IngredientInput: React.FC<IngredientInputProps> = ({
  selectedIngredients,
  customIngredients,
  onSelectedChange,
  onCustomChange,
  onSubmit
}) => {
  const handleTextInput = (value: string) => {
    const parsed = parseIngredients(value);
    onCustomChange(parsed);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          What's in your fridge?
        </h2>
        <TextInput
          value={customIngredients.join(', ')}
          onChange={handleTextInput}
          placeholder="Type extras: salmon, lemon..."
        />
      </div>
      
      <div>
        <p className="text-gray-600 mb-4">
          Or uncheck what you don't have:
        </p>
        <CheckboxGrid
          ingredients={INGREDIENTS}
          selected={selectedIngredients}
          onChange={onSelectedChange}
        />
      </div>
      
      <Button
        onClick={onSubmit}
        className="w-full"
        size="large"
      >
        🔍 Find Recipes
      </Button>
    </div>
  );
};

5.2.3 CheckboxGrid Component
File: src/components/IngredientInput/CheckboxGrid.tsx
Responsibilities:

Group ingredients by category
Render checkbox categories
Handle selection changes

Props:
typescriptinterface CheckboxGridProps {
  ingredients: Ingredient[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}
Implementation:
tsxexport const CheckboxGrid: React.FC<CheckboxGridProps> = ({
  ingredients,
  selected,
  onChange
}) => {
  const groupedIngredients = {
    protein: ingredients.filter(i => i.category === 'protein'),
    vegetable: ingredients.filter(i => i.category === 'vegetable'),
    dairy: ingredients.filter(i => i.category === 'dairy' || i.category === 'extra')
  };
  
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
        ingredients={groupedIngredients.protein}
        selected={selected}
        onToggle={handleToggle}
      />
      <CheckboxCategory
        title="Vegetables"
        ingredients={groupedIngredients.vegetable}
        selected={selected}
        onToggle={handleToggle}
      />
      <CheckboxCategory
        title="Dairy & Extras"
        ingredients={groupedIngredients.dairy}
        selected={selected}
        onToggle={handleToggle}
      />
    </div>
  );
};

5.2.4 RecipeCard Component
File: src/components/RecipeResults/RecipeCard.tsx
Responsibilities:

Display recipe summary
Show match percentage
Handle click to view details

Props:
typescriptinterface RecipeCardProps {
  match: RecipeMatch;
  onClick: (recipe: Recipe) => void;
}
Implementation:
tsxexport const RecipeCard: React.FC<RecipeCardProps> = ({ match, onClick }) => {
  const { recipe, matchPercentage } = match;
  
  return (
    <button
      onClick={() => onClick(recipe)}
      className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {recipe.name}
      </h3>
      
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          ⭐ {matchPercentage}% Match
        </span>
        <span className="flex items-center gap-1">
          ⏱ {recipe.time} min
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
          {recipe.difficulty}
        </span>
      </div>
      
      <div className="mt-3 text-sm text-blue-600 flex items-center gap-1">
        View Recipe →
      </div>
    </button>
  );
};

5.2.5 RecipeDetail Component
File: src/components/RecipeResults/RecipeDetail.tsx
Responsibilities:

Display full recipe details
Show ingredients and steps
Provide back navigation

Props:
typescriptinterface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}
Implementation:
tsxexport const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
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

6. API Design
6.1 Serverless Function: Generate Recipe
File: api/generate-recipe.ts
Endpoint: POST /api/generate-recipe
Request Body:
typescript{
  "ingredients": string[] // e.g., ["chicken", "broccoli", "rice"]
}
Response (Success):
typescript{
  "recipe": Recipe
}
Response (Error):
typescript{
  "error": string
}
Implementation:
typescriptimport Anthropic from '@anthropic-ai/sdk';
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
  
  try {
    const prompt = `Create a healthy, kid-friendly dinner recipe using these ingredients: ${ingredients.join(', ')}.

Requirements:
- 15-30 minutes total cooking time
- Include protein and vegetables
- Simple cooking techniques (sauté, bake, simmer - no fancy equipment)
- Serves 4 people
- Kid-friendly (not too spicy, familiar flavors)
- Maximum 10 ingredients total
- 5-8 simple steps

Respond ONLY with valid JSON matching this exact format (no markdown, no code blocks):
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
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    // Extract JSON from response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    // Parse JSON (remove any markdown code blocks if present)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }
    
    const recipe = JSON.parse(jsonMatch[0]);
    
    // Add generated ID and tags
    recipe.id = Date.now(); // temporary ID
    recipe.tags = ['ai-generated'];
    
    return res.status(200).json({ recipe });
    
  } catch (error) {
    console.error('Recipe generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate recipe. Please try again.' 
    });
  }
}
Environment Variables (Vercel):
bashANTHROPIC_API_KEY=sk-ant-...
Error Handling:

400: Invalid request (missing ingredients)
405: Wrong HTTP method
500: API failure, parsing error, or quota exceeded


7. State Management
7.1 State Strategy
Approach: React useState hooks (component-level state)
Justification:

Simple mental model
No external dependencies
Sufficient for v1.0 scope
Easy to migrate to Context API later if needed

7.2 State Location
StateLocationRationaleSelected ingredientsApp.tsxShared between input and resultsCustom ingredientsApp.tsxShared between input and resultsRecipe matchesApp.tsxNeeded for results displayView modeApp.tsxControls which component rendersSelected recipeApp.tsxNeeded for detail viewAI generation statusApp.tsxShared state for loading UICheckbox hover stateCheckboxCategory.tsxLocal UI state only
7.3 State Updates
Pattern: Immutable updates
typescript// ✅ Correct: Create new Set
const newSelected = new Set(selectedIngredients);
newSelected.add(id);
setSelectedIngredients(newSelected);

// ❌ Wrong: Mutate existing Set
selectedIngredients.add(id);
setSelectedIngredients(selectedIngredients);

8. UI/UX Implementation
8.1 Responsive Breakpoints
css/* Tailwind breakpoints */
sm: 640px   /* Small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
Mobile-First Strategy:

Default styles for mobile (320px+)
Add complexity at larger breakpoints
Touch targets 44x44px minimum
Text 16px minimum (prevents zoom on iOS)

8.2 Layout Patterns
Mobile (<640px):

Single column
Full-width buttons
Stacked checkboxes (2 per row max)
Bottom-fixed CTA button

Tablet (640px-1024px):

Single column with max-width
Checkboxes in 3-column grid
Centered content

Desktop (1024px+):

Max-width container (768px)
Checkboxes in 4-column grid
Centered content

8.3 Color System
typescript// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffe5d9',
          500: '#ff6b35', // Main brand color
          600: '#e65a2a',
          700: '#cc4e24',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          600: '#4b5563',
          900: '#111827',
        },
      },
    },
  },
};
Usage:

Primary (orange): CTA buttons, active states
Gray: Text, borders, backgrounds
Green: Success states, match percentage
Blue: Links, secondary actions
Red: Errors, warnings

8.4 Typography Scale
css/* Tailwind classes */
text-xs: 12px
text-sm: 14px
text-base: 16px   /* Body text */
text-lg: 18px     /* Recipe steps */
text-xl: 20px     /* Section headers */
text-2xl: 24px    /* Recipe titles */
text-3xl: 30px    /* App title */
Font Stack:
cssfont-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
8.5 Spacing System
css/* Tailwind spacing (8px base grid) */
p-2: 8px
p-4: 16px
p-6: 24px
p-8: 32px

gap-2: 8px
gap-4: 16px
gap-6: 24px
Touch Targets:
css/* Minimum 44x44px for touch */
.button {
  @apply min-h-[44px] min-w-[44px] px-4;
}

.checkbox {
  @apply w-6 h-6; /* Visual size */
  /* But actual clickable area is padded parent */
}
8.6 Animations
Transitions:
css/* Hover states */
transition-all duration-200 ease-in-out

/* Loading states */
animate-pulse
animate-spin

/* View changes */
transition-opacity duration-300
Loading Spinner:
tsx<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />

9. Performance Optimization
9.1 Performance Budget
MetricTargetMaximumFirst Contentful Paint (FCP)<1.0s1.5sLargest Contentful Paint (LCP)<1.5s2.0sTime to Interactive (TTI)<2.0s3.0sCumulative Layout Shift (CLS)<0.10.25Total Bundle Size<150KB200KB
9.2 Code Splitting
Strategy: Route-based splitting (minimal for SPA)
typescript// Lazy load recipe detail if needed
const RecipeDetail = lazy(() => import('./components/RecipeResults/RecipeDetail'));

// Use Suspense for loading state
<Suspense fallback={<LoadingSpinner />}>
  <RecipeDetail recipe={selectedRecipe} />
</Suspense>
Vite Automatic Splitting:

Vite automatically code-splits vendor libraries
React/ReactDOM in separate chunk
Application code in main chunk

9.3 Asset Optimization
Images:

No images in v1.0 (text-only)
If added later: WebP format, lazy loading

Fonts:

Use system fonts (no web fonts)
Eliminates font loading delay
Better performance on mobile

CSS:

Tailwind JIT mode (only used classes)
PurgeCSS in production build
Expected final CSS <20KB

9.4 Runtime Optimization
Memoization:
typescript// Memoize expensive calculations
const recipeMatches = useMemo(() => {
  return findRecipeMatches(allIngredients, recipes);
}, [allIngredients, recipes]);

// Memoize callbacks passed to children
const handleRecipeSelect = useCallback((recipe: Recipe) => {
  setSelectedRecipe(recipe);
  setViewMode('detail');
}, []);
Debouncing:
typescript// Debounce text input parsing
const debouncedParse = useMemo(
  () => debounce((value: string) => {
    const parsed = parseIngredients(value);
    setCustomIngredients(parsed);
  }, 300),
  []
);
```

### **9.5 Network Optimization**

**Static Assets:**
- Served from Vercel CDN (global)
- Gzip/Brotli compression automatic
- HTTP/2 multiplexing

**API Calls:**
- Only one API call (AI generation)
- Optimistic UI updates
- Retry logic with exponential backoff

---

## **10. Testing Strategy**

### **10.1 Testing Philosophy**

**Approach:** Test core logic, skip UI for v1.0

**Rationale:**
- Limited development time
- Single developer (you)
- Personal tool (lower risk)
- Manual testing sufficient for UI
- Focus tests on business logic

### **10.2 Test Coverage Goals**

| Layer | Target | Priority |
|-------|--------|----------|
| Utils (recipe matching, parsing) | 90%+ | P0 |
| Components | 0% (manual only) | P2 |
| API | Basic smoke test | P1 |
| E2E | 0% (manual only) | P2 |

### **10.3 Unit Tests (Vitest)**

**Test Files:**
```
src/
├── utils/
│   ├── recipeMatching.test.ts
│   ├── ingredientParsing.test.ts
│   └── api.test.ts
Example: Recipe Matching Tests
File: src/utils/recipeMatching.test.ts
typescriptimport { describe, it, expect } from 'vitest';
import { calculateMatchPercentage, findRecipeMatches } from './recipeMatching';

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
  
  it('returns 0% when user has no matching ingredients', () => {
    const recipeIngredients = ['chicken', 'broccoli'];
    const userIngredients = ['beef', 'carrots'];
    
    const result = calculateMatchPercentage(recipeIngredients, userIngredients);
    
    expect(result).toBe(0);
  });
  
  it('handles partial ingredient name matches', () => {
    const recipeIngredients = ['chicken breast'];
    const userIngredients = ['chicken'];
    
    const result = calculateMatchPercentage(recipeIngredients, userIngredients);
    
    expect(result).toBe(100);
  });
});

describe('findRecipeMatches', () => {
  const mockRecipes = [
    {
      id: 1,
      name: 'Chicken & Broccoli',
      ingredients: ['chicken', 'broccoli', 'rice'],
      time: 20,
      difficulty: 'Easy' as const,
      servings: 4,
      steps: ['Step 1']
    },
    {
      id: 2,
      name: 'Beef Stir-Fry',
      ingredients: ['beef', 'carrots', 'soy sauce'],
      time: 25,
      difficulty: 'Easy' as const,
      servings: 4,
      steps: ['Step 1']
    }
  ];
  
  it('returns matches sorted by percentage', () => {
    const userIngredients = ['chicken', 'broccoli', 'rice', 'beef'];
    
    const matches = findRecipeMatches(userIngredients, mockRecipes);
    
    expect(matches[0].recipe.name).toBe('Chicken & Broccoli');
    expect(matches[0].matchPercentage).toBe(100);
  });
  
  it('filters out recipes below 50% match', () => {
    const userIngredients = ['chicken'];
    
    const matches = findRecipeMatches(userIngredients, mockRecipes);
    
    expect(matches.length).toBe(1);
    expect(matches[0].recipe.name).toBe('Chicken & Broccoli');
  });
  
  it('returns maximum 5 results', () => {
    const manyRecipes = Array(10).fill(mockRecipes[0]);
    const userIngredients = ['chicken', 'broccoli', 'rice'];
    
    const matches = findRecipeMatches(userIngredients, manyRecipes);
    
    expect(matches.length).toBeLessThanOrEqual(5);
  });
});
Example: Ingredient Parsing Tests
File: src/utils/ingredientParsing.test.ts
typescriptimport { describe, it, expect } from 'vitest';
import { parseIngredients } from './ingredientParsing';

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
  
  it('handles mixed separators', () => {
    const input = 'chicken, broccoli rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });
  
  it('trims whitespace', () => {
    const input = '  chicken  ,  broccoli  ';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli']);
  });
  
  it('converts to lowercase', () => {
    const input = 'Chicken, BROCCOLI, Rice';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli', 'rice']);
  });
  
  it('removes empty strings', () => {
    const input = 'chicken,  , broccoli';
    const result = parseIngredients(input);
    expect(result).toEqual(['chicken', 'broccoli']);
  });
});
10.4 Running Tests
Commands:
bash# Run all tests
npm run test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Coverage Report:**
```
PASS  src/utils/recipeMatching.test.ts
PASS  src/utils/ingredientParsing.test.ts

Test Files  2 passed (2)
     Tests  12 passed (12)
  
Coverage:
---------
File                   | % Stmts | % Branch | % Funcs | % Lines
-----------------------|---------|----------|---------|--------
utils/recipeMatching   |   95.5  |   90.0   |  100.0  |  95.5
utils/ingredientParsing|   100.0 |   100.0  |  100.0  | 100.0
```

### **10.5 Manual Testing Checklist**

**Pre-Deployment:**
- [ ] Test on iPhone (Safari)
- [ ] Test on Android phone (Chrome)
- [ ] Test on desktop (Chrome, Firefox)
- [ ] All checkboxes pre-checked on load
- [ ] Text input parses ingredients correctly
- [ ] Recipe matching returns sensible results
- [ ] AI generation works (generates valid recipe)
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Recipe detail view renders properly
- [ ] Back navigation works
- [ ] No console errors
- [ ] Lighthouse score >90 (mobile)

**Post-Deployment:**
- [ ] Live site loads in <2s
- [ ] AI generation works on live site
- [ ] Mobile responsive on real device
- [ ] Test with 3 different ingredient combos
- [ ] Verify Vercel environment variables set

---

## **11. Deployment & DevOps**

### **11.1 Deployment Pipeline**

**Platform:** Vercel

**Git Workflow:**
```
main branch (production)
  ↓
  Push to GitHub
  ↓
  Vercel auto-deploys
  ↓
  Production live
No Staging Environment:

Personal tool, low risk
Can add staging branch later if needed

11.2 Vercel Configuration
File: vercel.json
json{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  }
}
11.3 Environment Variables
Vercel Dashboard Setup:

Go to Project Settings → Environment Variables
Add:

ANTHROPIC_API_KEY: Your Claude API key


Available in: Production, Preview, Development

Local Development:
File: .env.local (not committed)
bashANTHROPIC_API_KEY=sk-ant-...
File: .env.example (committed as template)
bashANTHROPIC_API_KEY=your-api-key-here
11.4 Build Configuration
File: vite.config.ts
typescriptimport { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable for debugging
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
11.5 Deployment Steps
Initial Deployment:

Push code to GitHub:

bash   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/fridge-roulette.git
   git push -u origin main

Connect to Vercel:

Go to vercel.com
Click "Import Project"
Select GitHub repository
Framework preset: Vite
Add environment variable: ANTHROPIC_API_KEY
Click "Deploy"


Verify deployment:

Check build logs (should succeed)
Visit production URL
Test AI generation feature
Check Vercel Analytics dashboard



Subsequent Deployments:

Just push to main branch
Vercel auto-deploys in ~1-2 minutes

11.6 Rollback Strategy
If deployment breaks:

Option A: Revert commit

bash   git revert HEAD
   git push

Option B: Redeploy previous version

Go to Vercel dashboard
Deployments tab
Click "Promote to Production" on previous working deployment


Option C: Hot fix

bash   # Fix the bug
   git commit -m "Hot fix: ..."
   git push
```

---

## **12. Security Considerations**

### **12.1 API Key Protection**

**Problem:** Frontend apps expose all code to users

**Solution:** Serverless function proxy
```
User → Frontend → Vercel Function → Anthropic API
                  (API key hidden)
Never do this:
typescript// ❌ WRONG: API key in frontend code
const anthropic = new Anthropic({
  apiKey: 'sk-ant-...' // EXPOSED TO USERS!
});
Do this instead:
typescript// ✅ CORRECT: API key in serverless function
// Frontend calls your API
const response = await fetch('/api/generate-recipe', {
  method: 'POST',
  body: JSON.stringify({ ingredients })
});
12.2 Input Validation
Serverless Function:
typescript// Validate ingredients array
if (!ingredients || !Array.isArray(ingredients)) {
  return res.status(400).json({ error: 'Invalid input' });
}

// Limit array length (prevent abuse)
if (ingredients.length > 20) {
  return res.status(400).json({ error: 'Too many ingredients' });
}

// Sanitize strings
const sanitized = ingredients.map(i => 
  i.trim().toLowerCase().slice(0, 50) // Max 50 chars per ingredient
);
12.3 Rate Limiting
Vercel built-in limits:

100 requests/hour per IP (free tier)
10s max function duration

Additional protection (if needed):
typescript// Simple in-memory rate limit (resets on function restart)
const requestCounts = new Map<string, number>();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const count = requestCounts.get(ip) || 0;
  
  if (count > 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  requestCounts.set(ip, count + 1);
  
  // ... rest of handler
}
12.4 Content Security Policy
Vercel Headers Configuration:
File: vercel.json
json{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
12.5 Dependency Security
Regular audits:
bashnpm audit
npm audit fix
Automated updates:

Dependabot (GitHub) enabled
Auto-merge minor/patch updates
Manual review for major updates


13. Error Handling
13.1 Error Categories
TypeExampleUser MessageActionNetworkAPI timeout"Connection failed. Check your internet."Retry buttonAPI500 from Claude"Failed to generate recipe. Try again."Retry buttonValidationInvalid input"Please enter at least one ingredient."Inline errorQuotaFree tier exceeded"Daily limit reached. Try tomorrow."Disable AIParseMalformed JSON"Something went wrong. Please try again."Retry
13.2 Error Handling Implementation
API Call with Error Handling:
typescriptconst generateRecipe = async (ingredients: string[]): Promise<Recipe> => {
  try {
    const response = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });
    
    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 429) {
        throw new Error('Daily limit reached. Please try again tomorrow.');
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again in a moment.');
      }
      throw new Error('Failed to generate recipe. Please try again.');
    }
    
    const data = await response.json();
    
    if (!data.recipe) {
      throw new Error('Invalid response from server.');
    }
    
    return data.recipe;
    
  } catch (error) {
    // Network errors (no internet, timeout, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Check your connection and try again.');
    }
    
    // Re-throw with user-friendly message
    throw error;
  }
};
Component Error Display:
tsxconst AIGenerateButton: React.FC = ({ onGenerate, isGenerating, error }) => {
  return (
    <div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="..."
      >
        {isGenerating ? (
          <>
            <LoadingSpinner />
            Generating...
          </>
        ) : (
          '✨ Generate New Recipe'
        )}
      </button>
      
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
          <button
            onClick={() => onGenerate()} // Retry
            className="ml-2 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};
13.3 Graceful Degradation
If AI generation fails:

User can still use curated recipes
Clear error message explains what happened
Retry option available
No crash, no blank screen

If no recipe matches:
tsx{recipeMatches.length === 0 && (
  <div className="text-center py-12">
    <p className="text-lg text-gray-600 mb-4">
      No recipes found with your ingredients.
    </p>
    <p className="text-gray-500 mb-6">
      Try adding more ingredients or generating a custom recipe.
    </p>
    <AIGenerateButton ... />
  </div>
)}

14. Monitoring & Observability
14.1 Monitoring Strategy (v1.0)
Approach: Minimal monitoring, manual tracking
What to track:

Deployment status (Vercel dashboard)
API errors (console logs in Vercel Functions)
Usage patterns (manual observation)

What NOT to track (v1.0):

User analytics (no GA, no tracking)
Performance metrics (use Lighthouse manually)
Error tracking service (no Sentry yet)

Rationale: Personal tool, free tier constraints
14.2 Vercel Analytics (Free)
Automatically tracked:

Page views
Top pages
Devices
Browsers
Countries

Access: Vercel Dashboard → Analytics tab
14.3 Console Logging
Serverless Function Logs:
typescriptexport default async function handler(req, res) {
  console.log('[Generate Recipe] Request received', {
    ingredientCount: req.body.ingredients?.length,
    timestamp: new Date().toISOString()
  });
  
  try {
    // ... API call
    
    console.log('[Generate Recipe] Success', {
      recipeName: recipe.name,
      generationTime: Date.now() - startTime
    });
    
  } catch (error) {
    console.error('[Generate Recipe] Error', {
      error: error.message,
      stack: error.stack
    });
  }
}
Access logs: Vercel Dashboard → Functions → Logs
14.4 Health Checks
Manual weekly checks:

 Visit production site
 Test recipe matching
 Test AI generation
 Check Vercel deployment status
 Review function logs for errors
 Check Anthropic API usage (avoid quota)


15. Development Workflow
15.1 Local Development Setup
Initial Setup:
bash# 1. Clone repo
git clone https://github.com/yourusername/fridge-roulette.git
cd fridge-roulette

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Start dev server
npm run dev

# Open http://localhost:3000
15.2 NPM Scripts
File: package.json
json{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
15.3 Development Workflow (Using Claude CLI)
Typical Development Session:

Start Claude CLI in project:

bash   cd fridge-roulette
   claude
```

2. **Describe what you want to build:**
```
   Add a "difficulty filter" feature:
   - Checkboxes for Easy/Medium
   - Filter recipe results by difficulty
   - Update UI to show filter

Claude CLI generates code:

Creates/modifies necessary files
Shows you the changes
Asks for approval


Review changes in Cursor:

Claude CLI opens files in Cursor
You can manually tweak if needed


Test locally:

bash   npm run dev
   # Open browser, test the feature

Run tests:

bash   npm run test

Commit and deploy:

bash   git add .
   git commit -m "Add difficulty filter feature"
   git push
   # Vercel auto-deploys
15.4 Git Workflow
Branch Strategy: Trunk-based (main only)
Rationale: Personal project, low risk, fast iteration
Commit Messages:
bash# Good commit messages
git commit -m "Add AI recipe generation feature"
git commit -m "Fix: Recipe matching now handles partial matches"
git commit -m "Refactor: Extract ingredient parsing to util"

# Bad commit messages
git commit -m "wip"
git commit -m "fixes"
git commit -m "update"
When to commit:

After completing a feature
Before starting something risky
Before taking a break (save progress)


16. Code Standards
16.1 TypeScript Configuration
File: tsconfig.json
json{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
16.2 ESLint Configuration
File: .eslintrc.json
json{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_" 
    }],
    "no-console": ["warn", { 
      "allow": ["warn", "error"] 
    }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
16.3 Prettier Configuration
File: .prettierrc
json{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
16.4 Coding Conventions
Naming:
typescript// Components: PascalCase
const RecipeCard = () => {};

// Functions: camelCase
const findRecipeMatches = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_RECIPES = 5;

// Types/Interfaces: PascalCase
interface Recipe {}
type RecipeMatch = {};
File Structure:
typescript// 1. Imports
import React from 'react';
import { Recipe } from '@/types';

// 2. Types/Interfaces
interface RecipeCardProps {
  recipe: Recipe;
}

// 3. Constants
const MAX_TITLE_LENGTH = 50;

// 4. Component
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  // 4a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 4b. Event handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  // 4c. Render
  return (
    <div onClick={handleClick}>
      {recipe.name}
    </div>
  );
};
Comments:
typescript// ✅ Good comments: Explain WHY
// We limit to 5 results to avoid overwhelming the user
const MAX_RESULTS = 5;

// Partial matching allows "chicken" to match "chicken breast"
if (recipeIng.toLowerCase().includes(userIng)) {
  return true;
}

// ❌ Bad comments: State the obvious
// Set loading to true
setLoading(true);

// Loop through recipes
for (const recipe of recipes) {
  // ...
}

17. Migration Path
17.1 Future Architecture Evolution
v1.0 → v1.5 (Browser localStorage):
Changes needed:

Add localStorage utility functions
Save selected ingredients on change
Load ingredients on app mount
Add "Reset preferences" button

Implementation:
typescript// Save to localStorage
useEffect(() => {
  localStorage.setItem('selectedIngredients', JSON.stringify(Array.from(selectedIngredients)));
}, [selectedIngredients]);

// Load from localStorage
useEffect(() => {
  const saved = localStorage.getItem('selectedIngredients');
  if (saved) {
    setSelectedIngredients(new Set(JSON.parse(saved)));
  }
}, []);
```

**v1.5 → v2.0 (User accounts + backend):**

**Major changes:**
- Add authentication (Clerk, Auth0, or Supabase)
- Add database (Supabase, Firebase, or PostgreSQL)
- Migrate recipes to database
- Add user preferences table
- Refactor state management to React Query

**Migration strategy:**
1. Set up Supabase (generous free tier)
2. Create schema (users, preferences, recipes, favorites)
3. Add authentication wrapper
4. Migrate localStorage data to user account
5. Update API calls to use user ID
6. Deploy incrementally (feature flags)

### **17.2 Scaling Considerations**

**If app grows beyond personal use:**

**Performance:**
- Add React Query for data caching
- Implement service worker for offline support
- Add image optimization (if adding photos)
- Consider edge caching for recipes

**Cost Management:**
- Switch to paid Anthropic plan if needed
- Consider recipe caching to reduce API calls
- Implement usage analytics
- Add rate limiting per user

**Infrastructure:**
- Consider moving database to dedicated service
- Add CDN for static assets (Vercel already provides)
- Implement Redis for caching (if high traffic)

---

## **18. Appendices**

### **Appendix A: File Structure (Complete)**
```
fridge-roulette/
├── .github/
│   └── workflows/
│       └── ci.yml (optional CI/CD)
├── api/
│   └── generate-recipe.ts
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── IngredientInput/
│   │   │   ├── IngredientInput.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── CheckboxGrid.tsx
│   │   │   └── CheckboxCategory.tsx
│   │   └── RecipeResults/
│   │       ├── RecipeResults.tsx
│   │       ├── RecipeCard.tsx
│   │       ├── RecipeDetail.tsx
│   │       └── AIGenerateButton.tsx
│   ├── data/
│   │   ├── recipes.json
│   │   └── ingredients.ts
│   ├── utils/
│   │   ├── recipeMatching.ts
│   │   ├── recipeMatching.test.ts
│   │   ├── ingredientParsing.ts
│   │   ├── ingredientParsing.test.ts
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env.local (not committed)
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
├── PRD.md
├── TDD.md (this document)
└── README.md
Appendix B: Key Algorithms
Recipe Matching Algorithm:
typescript/**
 * Calculate match percentage between user ingredients and recipe
 * 
 * Algorithm:
 * 1. Normalize all ingredient names (lowercase, trim)
 * 2. For each recipe ingredient:
 *    - Check if ANY user ingredient is substring match
 *    - Example: user has "chicken" → matches "chicken breast"
 * 3. Calculate percentage: (matches / total recipe ingredients) * 100
 * 
 * @param recipeIngredients - Array of ingredient strings from recipe
 * @param userIngredients - Array of ingredient strings from user input
 * @returns Match percentage (0-100)
 */
export const calculateMatchPercentage = (
  recipeIngredients: string[],
  userIngredients: string[]
): number => {
  if (recipeIngredients.length === 0) return 0;
  
  const normalizedUserIngredients = userIngredients.map(i => 
    i.toLowerCase().trim()
  );
  
  let matchCount = 0;
  
  for (const recipeIng of recipeIngredients) {
    const normalizedRecipeIng = recipeIng.toLowerCase().trim();
    
    // Check if any user ingredient matches
    const hasMatch = normalizedUserIngredients.some(userIng => {
      // Bidirectional substring matching
      return normalizedRecipeIng.includes(userIng) || 
             userIng.includes(normalizedRecipeIng);
    });
    
    if (hasMatch) matchCount++;
  }
  
  return Math.round((matchCount / recipeIngredients.length) * 100);
};
Ingredient Parsing Algorithm:
typescript/**
 * Parse user input text into array of ingredients
 * 
 * Algorithm:
 * 1. Split on commas and/or whitespace
 * 2. Trim each item
 * 3. Convert to lowercase
 * 4. Remove empty strings
 * 5. Remove duplicates
 * 
 * @param input - Raw user input string
 * @returns Array of parsed ingredient strings
 */
export const parseIngredients = (input: string): string[] => {
  if (!input || input.trim().length === 0) return [];
  
  // Split on comma or multiple spaces
  const items = input.split(/[,\s]+/);
  
  // Process each item
  const processed = items
    .map(item => item.trim().toLowerCase())
    .filter(item => item.length > 0);
  
  // Remove duplicates
  return Array.from(new Set(processed));
};
```

### **Appendix C: Lighthouse Performance Targets**

**Mobile (Primary):**
```
Performance:  >90
Accessibility: >95
Best Practices: >95
SEO:          >90
```

**Key Metrics:**
```
First Contentful Paint:  <1.5s
Largest Contentful Paint: <2.0s
Total Blocking Time:     <200ms
Cumulative Layout Shift: <0.1
Speed Index:             <2.5s
Optimization Checklist:

 Minify JavaScript (Vite automatic)
 Remove unused CSS (Tailwind JIT)
 Use system fonts (no web fonts)
 Lazy load offscreen content
 Optimize images (none in v1.0)
 Enable text compression (Vercel automatic)
 Reduce JavaScript execution time (<2s)
 Minimize main-thread work


END OF TECHNICAL DESIGN DOCUMENT
Document Approval:
RoleNameSignatureDateProduct Owner[Your Name]_________2026-02-03Engineering Lead[Your Name]_________2026-02-03
Next Steps: