import { HillKeyInput, TwoByTwoMatrix } from "../types/ciphers";
import {
  gcd,
  mod,
  assertInteger,
  multiply2x2ByVectorMod26,
  invert2x2Mod26,
} from "../utils/math";
import {
  letterToIndex,
  indexToLetter,
  normalizeLettersOnlyUpper,
} from "../utils/alphabets";

const PAD_LETTER = "X";

/**
 * Encrypts plaintext using a 2x2 Hill cipher over A-Z (mod 26).
 * - Input is normalized to letters only and uppercased (punctuation/spaces removed).
 * - If length is odd, PAD_LETTER is appended.
 */
const hillEncrypt = (plaintext: string, keyInput: HillKeyInput): string => {
  const key = parseAndValidateHillKey(keyInput);

  const prepared = prepareHillPlaintext(plaintext);
  let result = "";

  for (let i = 0; i < prepared.length; i += 2) {
    const vector: [number, number] = [
      letterToIndex(prepared[i]!),
      letterToIndex(prepared[i + 1]!),
    ];

    const encryptedVector = multiply2x2ByVectorMod26(key, vector);
    result +=
      indexToLetter(encryptedVector[0]) + indexToLetter(encryptedVector[1]);
  }

  return result;
};

/**
 * Decrypts Hill cipher text using the modular inverse of the key matrix.
 * - Input is normalized to letters only and uppercased.
 * - Ciphertext length must be even.
 */
const hillDecrypt = (ciphertext: string, keyInput: HillKeyInput): string => {
  const key = parseAndValidateHillKey(keyInput);
  const inverseKey = invert2x2Mod26(key);

  const normalized = normalizeLettersOnlyUpper(ciphertext);

  if (normalized.length % 2 !== 0) {
    throw new Error(
      "Hill ciphertext length must be even (letters-only after normalization)."
    );
  }

  let result = "";

  for (let i = 0; i < normalized.length; i += 2) {
    const vector: [number, number] = [
      letterToIndex(normalized[i]!),
      letterToIndex(normalized[i + 1]!),
    ];

    const decryptedVector = multiply2x2ByVectorMod26(inverseKey, vector);
    result +=
      indexToLetter(decryptedVector[0]) + indexToLetter(decryptedVector[1]);
  }

  return result;
};

/* ============================ Helpers ============================ */

/**
 * Accepts either:
 * - TwoByTwoMatrix: [[a,b],[c,d]]
 * - String: exactly 4 letters, e.g. "HILL" => [[7,8],[11,11]]
 */
const parseAndValidateHillKey = (keyInput: HillKeyInput): TwoByTwoMatrix => {
  const keyMatrix =
    typeof keyInput === "string" ? parseHillKeyString(keyInput) : keyInput;

  validateTwoByTwoMatrix(keyMatrix);
  return normalizeTwoByTwoMatrix(keyMatrix);
};

/** Parses a 4-letter string key into a 2x2 matrix (A->0 ... Z->25). */
const parseHillKeyString = (key: string): TwoByTwoMatrix => {
  const compact = key.replace(/\s+/g, "");
  if (compact.length !== 4) {
    throw new Error(
      `Hill string key must be exactly 4 characters (letters). Got length ${compact.length}.`
    );
  }

  if (!/^[A-Za-z]{4}$/.test(compact)) {
    throw new Error(
      `Hill string key must contain only letters A-Z. Got: "${key}"`
    );
  }

  const letters = compact.toUpperCase().split("");
  const nums = letters.map(letterToIndex);

  return [
    [nums[0]!, nums[1]!],
    [nums[2]!, nums[3]!],
  ];
};

/** Ensures all entries are integers and the determinant is invertible mod 26. */
const validateTwoByTwoMatrix = (key: TwoByTwoMatrix): void => {
  const [[a, b], [c, d]] = key;

  assertInteger(a, "Hill key[0][0]");
  assertInteger(b, "Hill key[0][1]");
  assertInteger(c, "Hill key[1][0]");
  assertInteger(d, "Hill key[1][1]");

  const det = mod(a * d - b * c, 26);
  if (gcd(det, 26) !== 1) {
    throw new Error(
      `Invalid Hill key: determinant ${det} is not invertible mod 26.`
    );
  }
};

/** Normalizes all entries into [0..25] to avoid surprises with negatives/large values. */
const normalizeTwoByTwoMatrix = (key: TwoByTwoMatrix): TwoByTwoMatrix => {
  const [[a, b], [c, d]] = key;
  return [
    [mod(a, 26), mod(b, 26)],
    [mod(c, 26), mod(d, 26)],
  ];
};

/** Prepares Hill plaintext: normalized letters only, padded to even length. */
const prepareHillPlaintext = (text: string): string => {
  let s = normalizeLettersOnlyUpper(text);
  if (s.length % 2 !== 0) s += PAD_LETTER;
  return s;
};

export { hillEncrypt, hillDecrypt };
