# Product Requirements Document (PRD)
## Fridge Roulette - Weeknight Dinner Recipe Finder

**Version:** 1.0  
**Date:** February 3, 2026  
**Author:** Product Team  
**Status:** Final - Ready for Development  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [User Research & Personas](#2-user-research--personas)
3. [Product Requirements](#3-product-requirements)
4. [Out of Scope](#4-out-of-scope-v10)
5. [User Interface Requirements](#5-user-interface-requirements)
6. [Technical Constraints](#6-technical-constraints)
7. [Risks & Mitigation](#7-risks--mitigation)
8. [Success Criteria](#8-success-criteria)
9. [Future Roadmap](#9-future-roadmap-post-v10)
10. [Appendices](#10-appendices)

---

## 1. Executive Summary

### 1.1 Product Vision
Fridge Roulette eliminates weeknight dinner decision fatigue for working parents by instantly suggesting recipes based on ingredients they already have, without requiring meal planning, recipe browsing, or creative thinking.

### 1.2 Problem Statement
Working parents with young children face a recurring problem: arriving home at 6:30pm with hungry kids, a fridge full of ingredients, but zero mental energy to decide what to cook. They default to unhealthy quick options (frozen meals, pasta, takeout) despite having the ingredients and ability to cook better meals.

### 1.3 Success Metrics
- **Primary:** User successfully cooks 3+ new meals in first week
- **Secondary:** Average time from app open to recipe selection < 30 seconds
- **Tertiary:** 80%+ of suggested recipes are actually cookable with stated ingredients

### 1.4 Scope
**In Scope (v1.0):** Personal/family tool, recipe matching, AI generation, mobile-first web app  
**Out of Scope (v1.0):** User accounts, social features, meal planning, shopping lists, nutrition tracking

---

## 2. User Research & Personas

### 2.1 Primary Persona: "Exhausted Emily"

**Demographics:**
- Age: 32-42
- Occupation: Working professional (full-time)
- Family: Married, 2 kids (ages 4-9)
- Location: Suburban/urban US
- Income: Middle class ($75k-150k household)

**Behavioral Characteristics:**
- Gets home 6:00-6:30pm on weeknights
- Has 30-45 minutes to prepare dinner
- Shops for groceries 1-2x per week (Sundays typical)
- Does NOT enjoy cooking (sees it as a chore)
- Can follow recipes but lacks confidence/creativity
- Feels guilty about serving "lazy" meals too often

**Pain Points:**
- **Decision paralysis:** Stares at fridge, can't think of what to make
- **Mental exhaustion:** Too tired to browse recipe sites or think creatively
- **Wasted food:** Buys ingredients that go bad because forgot how to use them
- **Kid rejection:** Makes effort, kids refuse to eat it
- **Time pressure:** Kids are hungry and impatient

**Current Workarounds:**
- Rotates same 5-7 meals every week (boring)
- Defaults to pasta, grilled cheese, frozen nuggets when overwhelmed
- Orders takeout 2-3x per week ($$$)
- Occasionally tries meal kit services but fails to plan ahead
- Googles "chicken recipes" and gets overwhelmed by options

**Goals:**
- Feed family healthy meals without thinking too hard
- Use groceries before they expire
- Reduce takeout spending
- Feel like a "good parent" re: nutrition
- Minimize dinner-related stress

### 2.2 User Journey (Current State - Without Product)

**Timeline:**
- **6:00pm:** Arrives home, exhausted
- **6:15pm:** Kids ask "what's for dinner?"
- **6:20pm:** Opens fridge, stares blankly
- **6:22pm:** Googles "quick chicken dinner"
- **6:25pm:** Scrolls through 15 recipes with life stories
- **6:30pm:** Realizes recipe needs ingredient she doesn't have
- **6:32pm:** Gives up, makes pasta with butter
- **6:45pm:** Feels guilty while kids eat plain carbs

**Metrics:**
- Total time wasted on decision: 25 minutes
- Mental energy expended: High
- Outcome satisfaction: Low

### 2.3 User Journey (Target State - With Product)

**Timeline:**
- **6:00pm:** Arrives home, exhausted
- **6:15pm:** Kids ask "what's for dinner?"
- **6:16pm:** Opens Fridge Roulette on phone
- **6:17pm:** Unchecks "shrimp" (don't have), types "salmon" (have)
- **6:18pm:** Sees 3 recipes, picks "Sheet Pan Salmon & Broccoli" (22min)
- **6:20pm:** Starts cooking, following simple steps
- **6:42pm:** Dinner on table, kids eating

**Metrics:**
- Total decision time: 2 minutes
- Mental energy expended: Minimal
- Outcome satisfaction: High

---

## 3. Product Requirements

### 3.1 Functional Requirements

#### FR-1: Ingredient Input
**Priority:** P0 (Must Have)

**User Story:** As a tired parent, I want to quickly tell the app what ingredients I have so I can get recipe suggestions without typing everything.

**Acceptance Criteria:**
- **AC-1.1:** User sees text input field for typing additional ingredients
- **AC-1.2:** User sees ~30 common ingredients as checkboxes, all pre-checked by default
- **AC-1.3:** User can uncheck ingredients they don't have (2-3 clicks typical)
- **AC-1.4:** Typed ingredients are parsed from comma or space-separated text
- **AC-1.5:** Checkboxes are organized into logical categories (Proteins, Vegetables, Dairy/Extras)
- **AC-1.6:** Interface is touch-friendly for mobile (minimum 44px touch targets)
- **AC-1.7:** Combined ingredient list (typed + checked) is used for recipe matching

**Implementation Notes:**
- Text parsing should handle: "chicken, broccoli" OR "chicken broccoli" OR "chicken,broccoli"
- Fuzzy matching optional but nice-to-have for typos
- Pre-checked items based on common US household pantry data

---

#### FR-2: Recipe Matching & Display
**Priority:** P0 (Must Have)

**User Story:** As a user, I want to see recipes I can actually make right now with ingredients I have, ranked by how well they match.

**Acceptance Criteria:**
- **AC-2.1:** System calculates match percentage for each recipe (user ingredients / recipe ingredients × 100)
- **AC-2.2:** Display top 3-5 recipes with match % ≥ 50%
- **AC-2.3:** Recipes sorted by match percentage (highest first)
- **AC-2.4:** Each recipe card shows: name, total time, difficulty, match percentage
- **AC-2.5:** Clicking recipe expands to show: full ingredient list with quantities, step-by-step instructions
- **AC-2.6:** All recipes are 15-30 minutes total time
- **AC-2.7:** All recipes include protein + vegetable components
- **AC-2.8:** All recipes serve 4 people

**Implementation Notes:**
- Match calculation should handle partial matches (e.g., user has "chicken" matches recipe requiring "chicken breast")
- If no recipes match ≥50%, show message suggesting AI generation
- Recipe difficulty limited to "Easy" or "Medium" only

---

#### FR-3: Recipe Database
**Priority:** P0 (Must Have)

**User Story:** As a user, I want access to a curated set of kid-friendly, healthy recipes that actually work.

**Acceptance Criteria:**
- **AC-3.1:** Database contains 25 recipes minimum at launch
- **AC-3.2:** Each recipe includes: unique ID, name, time (15-30min), difficulty, serving size, ingredients array, steps array
- **AC-3.3:** All recipes are kid-friendly (not too spicy, familiar flavors)
- **AC-3.4:** All recipes use ingredients from the standard ingredient list
- **AC-3.5:** Recipes use simple cooking techniques (chop, sauté, bake, simmer)
- **AC-3.6:** Maximum 1-2 pans/pots per recipe
- **AC-3.7:** No recipes requiring specialty equipment or advance prep

**Data Schema:**
```json
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
  ]
}
```

---

#### FR-4: AI Recipe Generation
**Priority:** P1 (Should Have)

**User Story:** As a user, I want the option to generate a custom recipe when the curated database doesn't match my specific ingredient combination.

**Acceptance Criteria:**
- **AC-4.1:** "Generate New Recipe ✨" button visible on results page
- **AC-4.2:** Button triggers API call to Claude with user's ingredient list
- **AC-4.3:** Loading state shown during generation (5-10 seconds typical)
- **AC-4.4:** Generated recipe follows same format as curated recipes
- **AC-4.5:** Disclaimer shown: "✨ AI-generated - adjust to taste"
- **AC-4.6:** Option to "Generate Another" if user doesn't like first result
- **AC-4.7:** Error handling for API failures with fallback message

**API Integration Requirements:**
- Model: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
- Max tokens: 1000
- Temperature: 0.7 (balance creativity and reliability)
- Prompt template enforces: 15-30min time, kid-friendly, protein+veg, simple techniques

**Cost Management:**
- Free tier usage monitoring
- Graceful degradation if quota exceeded
- Personal use only (1-2 requests/day sustainable)

---

#### FR-5: Mobile-Responsive Design
**Priority:** P0 (Must Have)

**User Story:** As a user, I primarily use my phone in the kitchen, so the app must work seamlessly on mobile.

**Acceptance Criteria:**
- **AC-5.1:** Responsive layout works on screen sizes 320px - 1920px width
- **AC-5.2:** Touch targets minimum 44x44px (Apple HIG standard)
- **AC-5.3:** Text readable without zooming (minimum 16px base font)
- **AC-5.4:** No horizontal scrolling on any device
- **AC-5.5:** Recipe steps readable while cooking (clear hierarchy, white space)
- **AC-5.6:** Fast load time on 3G connection (<3 seconds)

**Target Devices:**
- **Primary:** iPhone 12-15 (various sizes), recent Android phones
- **Secondary:** iPad, tablets
- **Tertiary:** Desktop browsers

---

### 3.2 Non-Functional Requirements

#### NFR-1: Performance
- Page load (cold start): <2 seconds on 4G
- Recipe filtering: <100ms (perceived instant)
- AI generation: <15 seconds (with loading indicator)
- No layout shift during load (CLS <0.1)

#### NFR-2: Usability
- Zero learning curve - intuitive on first use
- Maximum 3 taps from open to recipe selection
- Clear visual hierarchy (scan in <5 seconds)
- Accessible to users with basic smartphone literacy

#### NFR-3: Reliability
- 99% uptime on Vercel (infrastructure handled by platform)
- Graceful degradation if AI service unavailable
- No data loss (stateless design)
- Error messages clear and actionable

#### NFR-4: Maintainability
- Code follows standard conventions (ESLint, Prettier)
- Clear separation of concerns (data, logic, presentation)
- Inline comments for complex logic
- README with setup instructions

#### NFR-5: Security
- API keys never exposed in client code
- Serverless function handles Anthropic API calls
- No user data collection (privacy by default)
- HTTPS only (Vercel default)

#### NFR-6: Browser Support
- Chrome/Safari/Firefox (latest 2 versions)
- iOS Safari 14+
- Chrome Mobile (Android)
- Graceful degradation for older browsers

---

### 3.3 Ingredient List (Standard Set)

#### Proteins (8 items)
- Chicken breast
- Ground beef
- Ground turkey
- Pork chops
- Eggs
- Canned tuna
- Tofu
- Shrimp

#### Vegetables (12 items)
- Broccoli
- Carrots
- Bell peppers
- Onions
- Tomatoes
- Spinach/leafy greens
- Zucchini
- Cauliflower
- Green beans
- Frozen mixed vegetables
- Potatoes
- Sweet potatoes

#### Dairy & Extras (6 items)
- Milk
- Cheese (shredded/parmesan)
- Butter
- Sour cream/Greek yogurt
- Tortillas
- Bread

#### Assumed Pantry Staples (not selectable)
Rice, pasta, canned tomatoes, broth, oils, soy sauce, garlic, basic spices (salt, pepper, cumin, paprika, Italian seasoning), flour, sugar

**Rationale:** Based on USDA most-purchased grocery items + common suburban household pantry composition

---

## 4. Out of Scope (v1.0)

These features are explicitly excluded from v1.0 to maintain focus and ship quickly:

### User Accounts & Persistence
- No login/signup
- No saved preferences
- No favorite recipes
- No meal history

### Advanced Features
- Dietary restriction filters (vegetarian, gluten-free, etc.)
- Nutritional information
- Shopping list generation
- Meal planning calendar
- Recipe ratings/reviews
- Social sharing
- Recipe comments

### Content Management
- User-submitted recipes
- Recipe editing interface
- Admin dashboard

### Integrations
- Grocery delivery services
- Smart home devices
- Calendar apps

**Rationale:** These add complexity without validating core value proposition. Can be added post-launch based on usage data.

---

## 5. User Interface Requirements

### 5.1 Information Architecture
```
Home Page (Single Page App)
├── Header
│   └── App title/logo
├── Ingredient Input Section
│   ├── Text input field
│   └── Checkbox grid (organized by category)
├── Action Button
│   └── "Find Recipes" CTA
├── Results Section
│   ├── Recipe cards (top 3-5 matches)
│   └── "Generate New Recipe ✨" button
└── Recipe Detail Modal/Expansion
    ├── Full ingredient list
    ├── Step-by-step instructions
    └── Close/back button
```

### 5.2 Wireframes

#### Home State (Before Search)
```
┌─────────────────────────────────────┐
│  🍳 Fridge Roulette                 │
│  What's for dinner tonight?         │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ Type extras: salmon, lemon... │  │
│  └───────────────────────────────┘  │
│                                     │
│  Or uncheck what you don't have:   │
│                                     │
│  Proteins                           │
│  ☑ Chicken  ☑ Beef  ☑ Eggs  ...   │
│                                     │
│  Vegetables                         │
│  ☑ Broccoli ☑ Carrots ☑ Peppers   │
│  ...                                │
│                                     │
│  Dairy & Extras                     │
│  ☑ Milk ☑ Cheese ☑ Butter ...     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   🔍 Find Recipes             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Results State
```
┌─────────────────────────────────────┐
│  ← Back to Ingredients              │
├─────────────────────────────────────┤
│  Your Matches (3)                   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Sheet Pan Chicken & Broccoli  │  │
│  │ ⭐ 95% Match | ⏱ 22 min       │  │
│  │ Easy                           │  │
│  │ [View Recipe →]                │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Quick Beef Stir-Fry           │  │
│  │ ⭐ 88% Match | ⏱ 18 min       │  │
│  │ Easy                           │  │
│  │ [View Recipe →]                │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ✨ Generate New Recipe        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Recipe Detail View
```
┌─────────────────────────────────────┐
│  ← Back to Results                  │
├─────────────────────────────────────┤
│  Sheet Pan Chicken & Broccoli       │
│  ⏱ 22 minutes | 👥 Serves 4        │
│  Difficulty: Easy                   │
│                                     │
│  Ingredients:                       │
│  • Chicken breast (1 lb, diced)    │
│  • Broccoli (2 cups, chopped)      │
│  • Rice (1 cup)                     │
│  • Onion (1 medium, diced)         │
│  • Soy sauce (2 tbsp)              │
│                                     │
│  Instructions:                      │
│  1. Heat oil in large pan...       │
│  2. Add chicken, cook 5-6 min...   │
│  3. Add broccoli and onions...     │
│  4. Add rice and water...          │
│  5. Reduce heat, cover...          │
│  6. Stir in soy sauce, serve       │
└─────────────────────────────────────┘
```

### 5.3 Design System Requirements

#### Color Palette
- **Primary:** Warm, inviting (suggest: #FF6B35 or similar)
- **Background:** Clean white or very light gray (#F9F9F9)
- **Text:** High contrast dark gray (#333333)
- **Success/Match:** Green (#4CAF50)
- **Accent:** Complementary to primary

#### Typography
- **Base font size:** 16px (mobile), 18px (desktop)
- **Headings:** Clear hierarchy (2.5rem, 2rem, 1.5rem, 1.25rem)
- **Body text:** Readable sans-serif (system fonts for performance)
- **Recipe steps:** Slightly larger (18px) for readability while cooking

#### Spacing
- Consistent 8px grid system
- Generous white space (not cramped)
- Touch targets: 44x44px minimum

#### Interactive Elements
- Clear hover/active states
- Button loading states (spinner + dimmed)
- Smooth transitions (200ms ease)

---

## 6. Technical Constraints

### 6.1 Platform Constraints
- Must run entirely in browser (no native apps for v1.0)
- Free tier hosting only (Vercel)
- Free tier AI usage only (Anthropic Claude)
- No backend database (stateless, client-side only)

### 6.2 Development Constraints
- Developer has zero coding experience
- Using Claude CLI in agentic mode for development
- Using Cursor for code editing
- 2-3 day timeline to working prototype

### 6.3 Cost Constraints
- $0/month operational cost target
- Willing to pay $10-20/month if usage grows (future consideration)
- AI generation limited to free tier capacity

---

## 7. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI-generated recipes are bland/bad | High | Medium | Test 3-4 recipes before launch; replace bad ones manually |
| Free tier API quota exceeded | Medium | High | Monitor usage; disable AI if quota hit; add warning |
| Kids reject suggested meals | Medium | Low | Include "kid-tested" flag in future; accept not all recipes work |
| Recipe times inaccurate | Medium | Medium | Add 5min buffer to all times; note "times may vary" |
| Mobile performance poor | Low | High | Optimize images; minimize JS; use Lighthouse audits |
| Ingredients don't match well | Low | Medium | Ensure 25+ diverse recipes; fuzzy matching helps |

---

## 8. Success Criteria

### 8.1 Launch Criteria (Must Pass Before Deploy)
- ✅ All P0 functional requirements implemented
- ✅ Tested on iPhone and Android phone
- ✅ Recipe matching works with 3+ test cases
- ✅ AI generation returns valid recipes
- ✅ Page loads in <2s on 4G
- ✅ No console errors
- ✅ Deployed successfully to Vercel

### 8.2 Post-Launch Success (First Week)
- User (you) uses app 5+ times
- Successfully cooks 3+ different recipes
- At least 2 recipes become family favorites
- App feels faster than Googling recipes
- Kids eat majority of meals without major complaints

### 8.3 Metrics to Track (Manual)
- Number of times app opened
- Which recipes selected most often
- Time from open to recipe selection
- Recipes that didn't work (to replace)
- Feature requests/pain points discovered

---

## 9. Future Roadmap (Post-v1.0)

### v1.5 (Week 2-3) - Quick Wins
- Browser localStorage for ingredient preferences
- "Recently made" section to avoid repeats
- Simple vegetarian toggle filter
- Improved recipe quality (replace worst performers)

### v2.0 (Month 2) - Personalization
- Optional user accounts
- Save favorite recipes
- "My kids hate mushrooms" preferences
- Shopping list generator from selected recipe

### v3.0 (Month 3+) - Advanced Features
- Meal planning calendar
- Leftover tracking
- Recipe ratings/notes
- Social sharing
- Native mobile app consideration

---

## 10. Appendices

### Appendix A: Competitive Analysis

#### Supercook (supercook.com)
- ✅ Searches recipes by ingredients
- ❌ Cluttered UI, too many options
- ❌ Not optimized for mobile
- ❌ Requires browsing many recipes

#### Cooklist (cooklist.com)
- ✅ Ingredient-based search
- ❌ Requires login
- ❌ Complex meal planning features
- ❌ Not focused on "quick weeknight dinner" use case

#### ChatGPT/Claude (general AI)
- ✅ Can generate recipes on demand
- ❌ Requires crafting good prompts each time
- ❌ No saved ingredient state
- ❌ Not optimized for this specific workflow

#### Fridge Roulette Differentiation
- ✅ Zero friction ingredient input (pre-checked + text)
- ✅ Instant results (no browsing)
- ✅ Mobile-first for kitchen use
- ✅ AI fallback for unusual combos
- ✅ No accounts, no complexity

### Appendix B: User Testing Plan

**Test Group:** Personal/family use only

**Test Scenarios:**
1. Tuesday 6:30pm - Quick dinner needed
2. Have unusual ingredient combo (e.g., salmon + sweet potato)
3. Missing common ingredient (no chicken)
4. Kids are extra picky today

**What to Observe:**
- Time to recipe selection
- Recipe match quality
- Actual cooking time vs stated time
- Kid acceptance rate
- Pain points discovered

**Iteration Plan:**
- Cook 3-4 AI-generated recipes first week
- Replace bad recipes with manual entries
- Adjust ingredient list based on what you actually buy
- Refine UI based on real kitchen usage

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-03 | Product Team | Initial release |

---

**END OF DOCUMENT**