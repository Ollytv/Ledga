/**
 * Converts a spoken/transcribed phrase into a whole-Naira integer amount.
 *
 * Handles: raw digits ("15000", "15,000"), English number words ("fifteen
 * thousand"), and casual Nigerian trader phrasing ("he owes me fifteen
 * thousand naira", "I collected five thousand"). Deliberately simple —
 * this is amount capture, not general NLU.
 */

const UNITS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fourty: 40, // common misspelling/mishearing
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const MAGNITUDES: Record<string, number> = {
  hundred: 100,
  thousand: 1_000,
  million: 1_000_000,
};

// Words that carry no numeric value but commonly appear around an amount in
// natural trader speech — stripped before parsing.
const NOISE_WORDS = new Set([
  "naira",
  "niara",
  "nairas",
  "he",
  "she",
  "they",
  "owes",
  "owe",
  "me",
  "us",
  "i",
  "collected",
  "paid",
  "received",
  "got",
  "and",
  "only",
  "just",
  "a",
  "an",
  "the",
  "is",
  "was",
  "of",
]);

/**
 * Attempts to parse a raw numeric token first (handles "15000", "15,000",
 * "₦15,000"). Returns null if the cleaned string isn't purely numeric.
 */
function tryParseDigits(raw: string): number | null {
  const cleaned = raw.trim().replace(/[₦,\s]/g, "");
  if (cleaned === "" || !/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value) : null;
}

/**
 * Parses a sequence of number words (e.g. "fifteen thousand five hundred")
 * into an integer, following standard English number-word grammar:
 * magnitudes (hundred/thousand/million) multiply the accumulated segment,
 * larger magnitudes add the running total and reset the segment.
 */
function parseNumberWords(words: string[]): number | null {
  let total = 0;
  let segment = 0;
  let matchedAny = false;

  for (const word of words) {
    if (word in UNITS) {
      segment += UNITS[word];
      matchedAny = true;
    } else if (word in TENS) {
      segment += TENS[word];
      matchedAny = true;
    } else if (word === "hundred") {
      segment = (segment || 1) * 100;
      matchedAny = true;
    } else if (word === "thousand" || word === "million") {
      const mult = MAGNITUDES[word];
      total += (segment || 1) * mult;
      segment = 0;
      matchedAny = true;
    } else if (/^\d+$/.test(word)) {
      segment += Number(word);
      matchedAny = true;
    }
    // Unrecognized tokens are ignored (already filtered via NOISE_WORDS,
    // but stray words from the speech recognizer shouldn't abort parsing).
  }

  if (!matchedAny) return null;
  return total + segment;
}

/**
 * Converts a spoken-amount transcript into a whole-Naira integer.
 * Returns null when no usable amount could be extracted.
 */
export function parseSpokenAmount(transcript: string): number | null {
  if (!transcript || !transcript.trim()) return null;

  // Fast path: the whole transcript is already a plain number.
  const direct = tryParseDigits(transcript);
  if (direct !== null && direct > 0) return direct;

  const words = transcript
    .toLowerCase()
    .replace(/[₦,]/g, " ")
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !NOISE_WORDS.has(w));

  if (words.length === 0) return null;

  // If a bare digit sequence is embedded among words (e.g. "amount is 15000
  // naira"), prefer that direct number over word-parsing.
  if (words.length === 1) {
    const single = tryParseDigits(words[0]);
    if (single !== null && single > 0) return single;
  }

  const parsed = parseNumberWords(words);
  if (parsed !== null && parsed > 0) return Math.round(parsed);

  return null;
}
