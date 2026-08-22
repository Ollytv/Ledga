const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** Converts an integer (0–999,999,999) into English words, e.g. 15000 -> "fifteen thousand". */
export function amountToWords(amount: number): string {
  const n = Math.round(Math.abs(amount));
  if (n === 0) return "zero";

  function chunk(num: number): string {
    const parts: string[] = [];
    if (num >= 100) {
      parts.push(`${ONES[Math.floor(num / 100)]} hundred`);
      num %= 100;
    }
    if (num >= 20) {
      parts.push(TENS_WORDS[Math.floor(num / 10)] + (num % 10 ? `-${ONES[num % 10]}` : ""));
    } else if (num >= 10) {
      parts.push(TEENS[num - 10]);
    } else if (num > 0) {
      parts.push(ONES[num]);
    }
    return parts.join(" ");
  }

  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const rest = n % 1_000;

  const segments: string[] = [];
  if (millions) segments.push(`${chunk(millions)} million`);
  if (thousands) segments.push(`${chunk(thousands)} thousand`);
  if (rest) segments.push(chunk(rest));

  return segments.join(" ").trim();
}

const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

/**
 * Formats a whole-Naira integer as "₦15,000". Rounds defensively in case a
 * float slips through, since money is always handled as integer Naira.
 */
export function formatNaira(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return NAIRA_FORMATTER.format(safe);
}

/**
 * Parses free-text amount input (from the numeric field or, later, a voice
 * transcript) into a whole-Naira integer. Strips currency symbols and
 * thousands separators. Returns null when the input isn't a valid positive
 * amount.
 */
export function parseAmountInput(raw: string): number | null {
  const cleaned = raw.replace(/[₦,\s]/g, "");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}
