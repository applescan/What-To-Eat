import { normalizeIngredients } from "./normalizeIngredients";

export const RECIPE_QUESTIONNAIRE_STORAGE_KEY = "recipeQuestionnaire";

export type PantrySupport = "ingredients-only" | "pantry-ok";

type RecipeQuestionnaireValues = {
  prompt: string;
  dietary: string;
  ingredients: string;
  avoidIngredients: string;
  cuisine: string;
  mealType: string;
  maxReadyTime: string;
  pantrySupport: PantrySupport;
};

export type RecipeQuestionnaireProfile = {
  prompt: string;
  dietary: string;
  ingredients: string[];
  avoidIngredients: string[];
  cuisine: string;
  mealType: string;
  maxReadyTime: number | null;
  pantrySupport: PantrySupport;
  keywords: string[];
  detectedTags: string[];
  searchQuery: string;
};

type Option = {
  label: string;
  value: string;
};

const DEFAULT_MAX_RESULTS = 12;

export const DIETARY_OPTIONS: Option[] = [
  { label: "No dietary requirement", value: "any" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Gluten-free", value: "gluten-free" },
  { label: "Dairy-free", value: "dairy-free" },
  { label: "Pescetarian", value: "pescetarian" },
  { label: "Paleo", value: "paleo" },
  { label: "Ketogenic", value: "ketogenic" },
  { label: "Whole30", value: "whole30" },
  { label: "Low-FODMAP", value: "low-fodmap" },
];

const CUISINE_OPTIONS: Option[] = [
  { label: "Any cuisine", value: "any" },
  { label: "American", value: "american" },
  { label: "Chinese", value: "chinese" },
  { label: "Indian", value: "indian" },
  { label: "Italian", value: "italian" },
  { label: "Japanese", value: "japanese" },
  { label: "Korean", value: "korean" },
  { label: "Mediterranean", value: "mediterranean" },
  { label: "Mexican", value: "mexican" },
  { label: "Middle Eastern", value: "middle eastern" },
  { label: "Thai", value: "thai" },
  { label: "Vietnamese", value: "vietnamese" },
];

const MEAL_TYPE_OPTIONS: Option[] = [
  { label: "Anything", value: "any" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Soup", value: "soup" },
  { label: "Salad", value: "salad" },
  { label: "Snack", value: "snack" },
  { label: "Dessert", value: "dessert" },
];

const SPOONACULAR_DIET_MAP: Record<string, string> = {
  "gluten-free": "gluten free",
  vegetarian: "vegetarian",
  vegan: "vegan",
  "dairy-free": "dairy free",
  pescetarian: "pescetarian",
  paleo: "paleo",
  ketogenic: "ketogenic",
  whole30: "whole30",
  "low-fodmap": "low fodmap",
};

const SPOONACULAR_TYPE_MAP: Record<string, string> = {
  breakfast: "breakfast",
  lunch: "main course",
  dinner: "main course",
  soup: "soup",
  salad: "salad",
  snack: "snack",
  dessert: "dessert",
};

const DIETARY_ALIASES: Record<string, string[]> = {
  vegetarian: ["vegetarian", "veggie", "meatless"],
  vegan: ["vegan", "plant based", "plant-forward"],
  "gluten-free": ["gluten free", "gf", "no gluten"],
  "dairy-free": ["dairy free", "no dairy", "without dairy", "lactose free"],
  pescetarian: ["pescetarian", "pescatarian"],
  paleo: ["paleo"],
  ketogenic: ["keto", "ketogenic", "low carb"],
  whole30: ["whole30", "whole 30"],
  "low-fodmap": ["low fodmap", "fodmap friendly"],
};

const CUISINE_ALIASES: Record<string, string[]> = {
  american: ["american", "burger", "bbq", "barbecue"],
  chinese: ["chinese", "stir fry", "fried rice", "dumpling"],
  indian: ["indian", "curry", "masala", "tikka"],
  italian: ["italian", "pasta", "risotto", "pizza"],
  japanese: ["japanese", "teriyaki", "ramen", "udon"],
  korean: ["korean", "gochujang", "bibimbap", "bulgogi"],
  mediterranean: ["mediterranean", "greek", "mezze"],
  mexican: ["mexican", "taco", "burrito", "quesadilla", "enchilada"],
  "middle eastern": ["middle eastern", "shawarma", "falafel", "hummus"],
  thai: ["thai", "satay", "pad thai", "coconut curry"],
  vietnamese: ["vietnamese", "pho", "banh mi"],
};

const MEAL_ALIASES: Record<string, string[]> = {
  breakfast: ["breakfast", "brunch", "morning"],
  lunch: ["lunch", "midday"],
  dinner: ["dinner", "supper", "evening meal", "weeknight"],
  soup: ["soup", "broth", "stew"],
  salad: ["salad", "grain bowl", "bowl"],
  snack: ["snack", "bite", "finger food"],
  dessert: ["dessert", "sweet", "cake", "cookie"],
};

const KEYWORD_ALIASES: Record<string, string[]> = {
  spicy: ["spicy", "hot", "fiery"],
  cozy: ["cozy", "comfort", "comforting"],
  crispy: ["crispy", "crunchy"],
  creamy: ["creamy", "rich"],
  fresh: ["fresh", "light", "zesty"],
  healthy: ["healthy", "nutritious", "clean"],
  "high protein": ["high protein", "protein packed", "protein-rich"],
  easy: ["easy", "simple", "no fuss"],
};

const QUICK_TIME_ALIASES: Array<{ aliases: string[]; minutes: number }> = [
  { aliases: ["quick", "fast", "speedy"], minutes: 30 },
  { aliases: ["weeknight"], minutes: 35 },
  { aliases: ["slow cooked", "slow-cooked"], minutes: 120 },
];

const PANTRY_ALIASES: Array<{ aliases: string[]; value: PantrySupport }> = [
  {
    aliases: [
      "only what i have",
      "only use what i have",
      "no pantry",
      "no extra pantry",
      "no shopping",
      "just what i have",
    ],
    value: "ingredients-only",
  },
  {
    aliases: ["pantry is fine", "pantry ok", "basic pantry is fine", "staples are fine"],
    value: "pantry-ok",
  },
];

const normalizeText = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const includesAlias = (text: string, alias: string) =>
  new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i").test(text);

const findMatch = (text: string, dictionary: Record<string, string[]>) => {
  for (const [value, aliases] of Object.entries(dictionary)) {
    if (aliases.some((alias) => includesAlias(text, alias))) {
      return value;
    }
  }

  return "";
};

const extractKeywords = (text: string) => {
  const keywords = new Set<string>();

  for (const [label, aliases] of Object.entries(KEYWORD_ALIASES)) {
    if (aliases.some((alias) => includesAlias(text, alias))) {
      keywords.add(label);
    }
  }

  return Array.from(keywords);
};

const extractPromptTime = (text: string) => {
  const underMinutesMatch = text.match(
    /\b(?:under|less than|within|max|maximum|no more than)\s+(\d{1,3})\s*(?:minutes?|mins?|min)\b/i,
  );
  if (underMinutesMatch) {
    return Number(underMinutesMatch[1]);
  }

  const minutesMatch = text.match(/\b(\d{1,3})\s*(?:minutes?|mins?|min)\b/i);
  if (minutesMatch) {
    return Number(minutesMatch[1]);
  }

  const hoursMatch = text.match(/\b(\d{1,2})\s*(?:hours?|hrs?|hr)\b/i);
  if (hoursMatch) {
    return Number(hoursMatch[1]) * 60;
  }

  for (const option of QUICK_TIME_ALIASES) {
    if (option.aliases.some((alias) => includesAlias(text, alias))) {
      return option.minutes;
    }
  }

  return null;
};

const extractAvoidIngredients = (prompt: string) => {
  const segments = prompt
    .split(/,| but | and | except /i)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const avoided = new Set<string>();

  for (const segment of segments) {
    const cleaned = segment.replace(
      /^(without|no|avoid|excluding|exclude|skip|minus)\s+/i,
      "",
    );
    if (cleaned !== segment) {
      const normalized = normalizeIngredients(cleaned);
      normalized
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => avoided.add(value));
    }
  }

  return Array.from(avoided);
};

const extractPantrySupport = (text: string) => {
  for (const option of PANTRY_ALIASES) {
    if (option.aliases.some((alias) => includesAlias(text, alias))) {
      return option.value;
    }
  }

  return null;
};

const normalizeIngredientList = (input: string) =>
  normalizeIngredients(input)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const dedupe = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const toSearchQuery = ({
  ingredients,
  mealType,
  keywords,
  cuisine,
}: Pick<RecipeQuestionnaireProfile, "ingredients" | "mealType" | "keywords" | "cuisine">) => {
  const searchTerms = new Set<string>();

  if (mealType && mealType !== "any" && !["lunch", "dinner"].includes(mealType)) {
    searchTerms.add(mealType);
  }

  if (cuisine && cuisine !== "any") {
    searchTerms.add(cuisine);
  }

  keywords.slice(0, 3).forEach((keyword) => searchTerms.add(keyword));
  ingredients.slice(0, 3).forEach((ingredient) => searchTerms.add(ingredient));

  return Array.from(searchTerms).join(" ");
};

const labelForOption = (options: Option[], value: string, emptyLabel: string) =>
  options.find((option) => option.value === value)?.label ?? emptyLabel;

export const createRecipeQuestionnaireProfile = (
  values: RecipeQuestionnaireValues,
): RecipeQuestionnaireProfile => {
  const normalizedPrompt = values.prompt.trim();
  const promptText = normalizeText(values.prompt);
  const promptDietary = findMatch(promptText, DIETARY_ALIASES);
  const promptCuisine = findMatch(promptText, CUISINE_ALIASES);
  const promptMealType = findMatch(promptText, MEAL_ALIASES);
  const promptTime = extractPromptTime(promptText);
  const promptPantry = extractPantrySupport(promptText);
  const promptIngredients = normalizeIngredientList(values.prompt);
  const manualIngredients = normalizeIngredientList(values.ingredients);
  const manualAvoidIngredients = normalizeIngredientList(values.avoidIngredients);
  const promptAvoidIngredients = extractAvoidIngredients(values.prompt);
  const dietary = values.dietary !== "any" ? values.dietary : promptDietary || "any";
  const cuisine = values.cuisine !== "any" ? values.cuisine : promptCuisine || "any";
  const mealType = values.mealType !== "any" ? values.mealType : promptMealType || "any";
  const maxReadyTime = values.maxReadyTime
    ? Number(values.maxReadyTime)
    : promptTime ?? null;
  const pantrySupport =
    values.pantrySupport || promptPantry || ("pantry-ok" as PantrySupport);
  const keywords = extractKeywords(promptText);
  const ingredients = dedupe([...manualIngredients, ...promptIngredients]);
  const avoidIngredients = dedupe([...manualAvoidIngredients, ...promptAvoidIngredients]);
  const detectedTags = dedupe([
    dietary !== "any" ? labelForOption(DIETARY_OPTIONS, dietary, dietary) : "",
    cuisine !== "any" ? labelForOption(CUISINE_OPTIONS, cuisine, cuisine) : "",
    mealType !== "any" ? labelForOption(MEAL_TYPE_OPTIONS, mealType, mealType) : "",
    maxReadyTime ? `Under ${maxReadyTime} min` : "",
    ...keywords.map(capitalize),
  ]);
  const searchQuery = toSearchQuery({ ingredients, cuisine, mealType, keywords });

  return {
    prompt: normalizedPrompt,
    dietary,
    ingredients,
    avoidIngredients,
    cuisine,
    mealType,
    maxReadyTime,
    pantrySupport,
    keywords,
    detectedTags,
    searchQuery,
  };
};

const buildSearchParams = (
  profile: RecipeQuestionnaireProfile,
  options: { offset?: number; relaxed?: boolean } = {},
) => {
  const params = new URLSearchParams({
    apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY ?? "",
    number: String(DEFAULT_MAX_RESULTS),
    offset: String(options.offset ?? 0),
    addRecipeInformation: "true",
    fillIngredients: "true",
    instructionsRequired: "true",
    sort: "popularity",
    sortDirection: "desc",
  });

  const relaxed = options.relaxed ?? false;
  const includeIngredients = profile.ingredients.slice(0, relaxed ? 4 : 8).join(",");
  const excludeIngredients = profile.avoidIngredients.slice(0, 6).join(",");
  const diet = profile.dietary !== "any" ? SPOONACULAR_DIET_MAP[profile.dietary] : "";
  const cuisine = !relaxed && profile.cuisine !== "any" ? profile.cuisine : "";
  const type = profile.mealType !== "any" ? SPOONACULAR_TYPE_MAP[profile.mealType] ?? "" : "";
  const maxReadyTime = profile.maxReadyTime
    ? String(relaxed ? profile.maxReadyTime + 15 : profile.maxReadyTime)
    : "";
  const query = relaxed
    ? profile.keywords.slice(0, 2).join(" ")
    : profile.searchQuery;

  if (diet) params.set("diet", diet);
  if (includeIngredients) params.set("includeIngredients", includeIngredients);
  if (excludeIngredients) params.set("excludeIngredients", excludeIngredients);
  if (query) params.set("query", query);
  if (cuisine) params.set("cuisine", cuisine);
  if (type) params.set("type", type);
  if (maxReadyTime) params.set("maxReadyTime", maxReadyTime);
  if (profile.pantrySupport === "ingredients-only") params.set("ignorePantry", "true");

  return params;
};

export const buildRecipeSearchVariants = (profile: RecipeQuestionnaireProfile) => [
  buildSearchParams(profile),
  buildSearchParams(profile, { offset: DEFAULT_MAX_RESULTS }),
  buildSearchParams(profile, { relaxed: true }),
];

export type SearchRecipeResult = {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  summary?: string;
};

const hasWordMatch = (haystack: string[], needle: string) =>
  haystack.some((value) => normalizeText(value) === normalizeText(needle));

const scoreByTime = (readyInMinutes: number | undefined, maxReadyTime: number | null) => {
  if (!readyInMinutes || !maxReadyTime) return 0;
  if (readyInMinutes <= maxReadyTime) return 10;
  if (readyInMinutes <= maxReadyTime + 15) return 4;
  return -6;
};

export const scoreRecipeForProfile = (
  recipe: SearchRecipeResult,
  profile: RecipeQuestionnaireProfile,
) => {
  let score = 0;
  const searchableText = normalizeText(`${recipe.title} ${recipe.summary ?? ""}`);

  score += (recipe.usedIngredientCount ?? 0) * 5;
  score -= (recipe.missedIngredientCount ?? 0) * (profile.pantrySupport === "ingredients-only" ? 4 : 1);
  score += scoreByTime(recipe.readyInMinutes, profile.maxReadyTime);

  if (profile.cuisine !== "any" && hasWordMatch(recipe.cuisines ?? [], profile.cuisine)) {
    score += 8;
  }

  if (
    profile.mealType !== "any" &&
    (hasWordMatch(recipe.dishTypes ?? [], profile.mealType) ||
      (profile.mealType === "dinner" && hasWordMatch(recipe.dishTypes ?? [], "main course")) ||
      (profile.mealType === "lunch" && hasWordMatch(recipe.dishTypes ?? [], "main course")))
  ) {
    score += 7;
  }

  profile.keywords.forEach((keyword) => {
    if (searchableText.includes(keyword)) {
      score += 3;
    }
  });

  return score;
};

export const getDietaryLabel = (value: string) =>
  labelForOption(DIETARY_OPTIONS, value, "No dietary filter");

export const getCuisineLabel = (value: string) =>
  labelForOption(CUISINE_OPTIONS, value, "Any cuisine");

export const getMealTypeLabel = (value: string) =>
  labelForOption(MEAL_TYPE_OPTIONS, value, "Anything");

export const getPantryLabel = (value: PantrySupport) =>
  value === "ingredients-only" ? "Only what I listed" : "Pantry staples are okay";
