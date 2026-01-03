/** Maps A-Z to 0-25. */
const letterToIndex = (c: string): number => c.charCodeAt(0) - 65;

/** Maps 0-25 to A-Z. */
const indexToLetter = (n: number): string => String.fromCharCode(n + 65);

/** Normalizes to A-Z letters only, uppercased (removes spaces/punctuation). */
const normalizeLettersOnlyUpper = (text: string): string =>
  Array.from(text)
    .filter((c) => /[A-Za-z]/.test(c))
    .map((c) => c.toUpperCase())
    .join("");

export { letterToIndex, indexToLetter, normalizeLettersOnlyUpper };
