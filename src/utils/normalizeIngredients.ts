const INGREDIENT_DICTIONARY = [
    "apple",
    "apricot",
    "avocado",
    "bacon",
    "bagel",
    "banana",
    "basil",
    "bean",
    "beef",
    "bell pepper",
    "black beans",
    "blueberry",
    "bread",
    "broccoli",
    "brown rice",
    "butter",
    "cabbage",
    "carrot",
    "cashew",
    "cauliflower",
    "celery",
    "cheddar",
    "cheese",
    "chicken",
    "chickpeas",
    "chili",
    "chives",
    "cilantro",
    "coconut milk",
    "corn",
    "cottage cheese",
    "cucumber",
    "cumin",
    "cream",
    "egg",
    "eggplant",
    "feta",
    "flour",
    "garlic",
    "ginger",
    "goat cheese",
    "green beans",
    "ground beef",
    "ham",
    "honey",
    "jalapeno",
    "kale",
    "ketchup",
    "lemon",
    "lettuce",
    "lime",
    "milk",
    "mozzarella",
    "mushroom",
    "mustard",
    "noodles",
    "oats",
    "oil",
    "olive oil",
    "onion",
    "orange",
    "oregano",
    "paprika",
    "parmesan",
    "parsley",
    "pasta",
    "pea",
    "peanut butter",
    "pear",
    "pepper",
    "pepperoni",
    "pesto",
    "pineapple",
    "pork",
    "potato",
    "prosciutto",
    "quinoa",
    "radish",
    "rice",
    "rosemary",
    "salmon",
    "salsa",
    "salt",
    "sausage",
    "scallion",
    "shrimp",
    "spinach",
    "steak",
    "strawberry",
    "sugar",
    "sweet potato",
    "thyme",
    "tofu",
    "tomato",
    "tortilla",
    "tuna",
    "turkey",
    "vanilla",
    "vinegar",
    "walnut",
    "yogurt",
    "zucchini"
];

const DICTIONARY_SET = new Set(INGREDIENT_DICTIONARY);

const STOP_WORDS = new Set(["fresh", "chopped", "diced", "minced", "sliced", "ground", "grated", "crushed"]);

const QUANTITY_PREFIX = /^(\d+(\.\d+)?\s*)?(cups?|cup|tbsp|tablespoons?|tsp|teaspoons?|pounds?|lbs?|lb|oz|ounces?|grams?|g|kg|cloves?|clove|cans?|can|pieces?|piece|slices?|slice|packets?|packet|bunches?|bunch|heads?|head)?\s*(of\s+)?/;

const splitOnSeparators = (input: string) =>
    input
        .split(/,|\band\b|\bwith\b|\bplus\b|\bthen\b|\balso\b/gi)
        .map((token) => token.trim())
        .filter(Boolean);

const stripQuantityAndStopWords = (input: string) => {
    const withoutQuantity = input.replace(QUANTITY_PREFIX, "").trim();
    if (!withoutQuantity) return "";
    const words = withoutQuantity.split(/\s+/).filter((word) => !STOP_WORDS.has(word));
    return words.join(" ");
};

const singularize = (word: string) => {
    if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
    if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
    return word;
};

const levenshtein = (a: string, b: string) => {
    const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
};

const maxAllowedDistance = (token: string) => {
    if (token.length <= 4) return 1;
    if (token.length <= 8) return 2;
    return 3;
};

const findBestMatch = (token: string) => {
    let best = "";
    let bestDistance = Number.POSITIVE_INFINITY;
    const threshold = maxAllowedDistance(token);

    for (const candidate of INGREDIENT_DICTIONARY) {
        const distance = levenshtein(token, candidate);
        if (distance < bestDistance) {
            bestDistance = distance;
            best = candidate;
        }
        if (bestDistance === 0) break;
    }

    return bestDistance <= threshold ? best : token;
};

const normalizeToken = (token: string) => {
    const trimmed = stripQuantityAndStopWords(token);
    if (!trimmed) return "";

    const direct = DICTIONARY_SET.has(trimmed) ? trimmed : "";
    if (direct) return direct;

    const singular = singularize(trimmed);
    if (DICTIONARY_SET.has(singular)) return singular;

    return findBestMatch(trimmed);
};

export const normalizeIngredients = (input: string) => {
    if (!input || !input.trim()) return "";

    const cleaned = input
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[()]/g, " ")
        .replace(/[^a-z0-9,\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const tokens = splitOnSeparators(cleaned);
    const normalized = tokens
        .map(normalizeToken)
        .filter(Boolean);

    const unique = Array.from(new Set(normalized));
    return unique.join(", ");
};
