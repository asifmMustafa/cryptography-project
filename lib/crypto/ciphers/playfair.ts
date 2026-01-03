import { PlayfairKeySquare } from "../types/ciphers";
import { mod } from "../utils/math";

const FILLER_LETTER = "X";

/**
 * Encrypts with Playfair cipher using the given key.
 * - Letters are normalized to A-Z, J is merged into I.
 * - Non-letters are preserved in-place; output may be longer due to filler insertion,
 *   in which case extra letters are appended at the end.
 */
const playfairEncrypt = (plaintext: string, key: string): string => {
  const keySquare = buildKeySquare(key);

  return transformPreservingNonLetters(plaintext, (lettersOnly) => {
    const preparedDigraphs = preparePlayfairDigraphs(lettersOnly);
    return applyPlayfair(preparedDigraphs, keySquare, "encrypt");
  });
};

/**
 * Decrypts Playfair cipher text using the given key.
 * - Letters are normalized to A-Z, J is treated as I.
 * - Non-letters are preserved in-place; if ciphertext has extra letters, they are appended.
 */
const playfairDecrypt = (ciphertext: string, key: string): string => {
  const keySquare = buildKeySquare(key);

  return transformPreservingNonLetters(ciphertext, (lettersOnly) => {
    const normalized = normalizePlayfairLetters(lettersOnly);
    return applyPlayfair(normalized, keySquare, "decrypt");
  });
};

/** Applies Playfair digraph rules to an even-length A-Z string (no J). */
const applyPlayfair = (
  prepared: string,
  keySquare: PlayfairKeySquare,
  mode: "encrypt" | "decrypt"
): string => {
  if (prepared.length % 2 !== 0) {
    throw new Error(
      "Playfair input must have even length (letters-only after preparation)."
    );
  }

  const step = mode === "encrypt" ? 1 : -1;
  const out: string[] = [];

  for (let i = 0; i < prepared.length; i += 2) {
    const first = prepared[i]!;
    const second = prepared[i + 1]!;

    const firstPos = keySquare.pos.get(first);
    const secondPos = keySquare.pos.get(second);

    if (!firstPos || !secondPos) {
      throw new Error(
        `Letter not in key square: ${!firstPos ? first : second}`
      );
    }

    // Same row: shift columns
    if (firstPos.r === secondPos.r) {
      out.push(getKeySquareChar(keySquare, firstPos.r, firstPos.c + step));
      out.push(getKeySquareChar(keySquare, secondPos.r, secondPos.c + step));
      continue;
    }

    // Same column: shift rows
    if (firstPos.c === secondPos.c) {
      out.push(getKeySquareChar(keySquare, firstPos.r + step, firstPos.c));
      out.push(getKeySquareChar(keySquare, secondPos.r + step, secondPos.c));
      continue;
    }

    // Rectangle swap: keep row, swap columns
    out.push(getKeySquareChar(keySquare, firstPos.r, secondPos.c));
    out.push(getKeySquareChar(keySquare, secondPos.r, firstPos.c));
  }

  return out.join("");
};

/* ============================ Key square ============================ */

/** Builds a 5x5 Playfair key square (A-Z without J), plus a position map for lookup. */
const buildKeySquare = (key: string): PlayfairKeySquare => {
  // Key must contain only letters (and not be empty)
  const compact = key.replace(/\s+/g, "");
  if (compact.length === 0) {
    throw new Error("Playfair key must not be empty.");
  }
  if (!/^[A-Za-z]+$/.test(compact)) {
    throw new Error(
      `Playfair key must contain letters only (A-Z). Got: "${key}"`
    );
  }

  const keyLetters = normalizePlayfairLetters(compact);
  const used = new Set<string>();
  const square: string[] = [];

  // Key first
  for (const ch of keyLetters) {
    if (!used.has(ch)) {
      used.add(ch);
      square.push(ch);
    }
  }

  // Then remaining alphabet (excluding J)
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    if (ch === "J") continue;
    if (!used.has(ch)) {
      used.add(ch);
      square.push(ch);
    }
  }

  if (square.length !== 25) {
    throw new Error(`Key square must be 25 characters, got ${square.length}`);
  }

  const pos = new Map<string, { r: number; c: number }>();
  square.forEach((ch, idx) =>
    pos.set(ch, { r: Math.floor(idx / 5), c: idx % 5 })
  );

  return { square, pos };
};

/** Normalizes text to letters only, uppercase, mapping J -> I. */
const normalizePlayfairLetters = (input: string): string =>
  Array.from(input)
    .filter((ch) => /[A-Za-z]/.test(ch))
    .map((ch) => {
      const up = ch.toUpperCase();
      return up === "J" ? "I" : up;
    })
    .join("");

/** Prepares letters into Playfair digraphs (handles doubles and odd length with filler). */
const preparePlayfairDigraphs = (lettersOnly: string): string => {
  const s = normalizePlayfairLetters(lettersOnly);
  const out: string[] = [];
  let i = 0;

  while (i < s.length) {
    const a = s[i]!;
    const b = s[i + 1];

    if (!b) {
      out.push(a, FILLER_LETTER);
      break;
    }

    if (a === b) {
      out.push(a, FILLER_LETTER);
      i += 1;
    } else {
      out.push(a, b);
      i += 2;
    }
  }

  return out.join("");
};

/** Returns the character at (row, col), wrapping around the 5x5 square. */
const getKeySquareChar = (
  ks: PlayfairKeySquare,
  row: number,
  col: number
): string => ks.square[mod(row, 5) * 5 + mod(col, 5)]!;

/* ============================ Formatting preservation ============================ */

/**
 * Applies a letters-only transform, then re-inserts transformed letters into the original string.
 * Non-letters remain unchanged. If the transformed output has extra letters, they are appended.
 */
const transformPreservingNonLetters = (
  original: string,
  transformLettersOnly: (lettersOnly: string) => string
): string => {
  const letterMeta: { isUpper: boolean }[] = [];

  const lettersOnly = Array.from(original)
    .filter((ch) => /[A-Za-z]/.test(ch))
    .map((ch) => {
      letterMeta.push({ isUpper: ch === ch.toUpperCase() });
      return ch;
    })
    .join("");

  const transformed = transformLettersOnly(lettersOnly);

  let idx = 0;
  const rebuilt = Array.from(original).map((ch) => {
    if (!/[A-Za-z]/.test(ch)) return ch;

    const outCh = transformed[idx];
    if (!outCh) return ch; // defensive fallback; should not happen in normal operation

    const upper = letterMeta[idx]?.isUpper ?? true;
    idx++;

    return upper ? outCh.toUpperCase() : outCh.toLowerCase();
  });

  // If encryption inserted fillers, append remaining letters.
  if (idx < transformed.length) rebuilt.push(transformed.slice(idx));

  return rebuilt.join("");
};

export { playfairEncrypt, playfairDecrypt };
