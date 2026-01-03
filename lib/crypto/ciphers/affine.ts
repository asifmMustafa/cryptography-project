import { AffineKey } from "../types/ciphers";
import { gcd, mod, modInverse, assertInteger } from "../utils/math";

/**
 * Encrypts text using Affine cipher: E(x) = (a*x + b) mod 26.
 * Preserves case and leaves non-letters unchanged.
 */
const affineEncrypt = (plaintext: string, key: AffineKey): string => {
  validateAffineKey(key);

  const a = mod(key.a, 26);
  const b = mod(key.b, 26);

  return Array.from(plaintext)
    .map((ch) => {
      const code = ch.charCodeAt(0);

      // A-Z
      if (code >= 65 && code <= 90) {
        const x = code - 65;
        const y = mod(a * x + b, 26);
        return String.fromCharCode(65 + y);
      }

      // a-z
      if (code >= 97 && code <= 122) {
        const x = code - 97;
        const y = mod(a * x + b, 26);
        return String.fromCharCode(97 + y);
      }

      return ch;
    })
    .join("");
};

/**
 * Decrypts Affine cipher text using x = a^{-1} * (y - b) mod 26.
 * Preserves case and leaves non-letters unchanged.
 */
const affineDecrypt = (ciphertext: string, key: AffineKey): string => {
  validateAffineKey(key);

  const a = mod(key.a, 26);
  const b = mod(key.b, 26);
  const aInv = modInverse(a, 26);

  return Array.from(ciphertext)
    .map((ch) => {
      const code = ch.charCodeAt(0);

      // A-Z
      if (code >= 65 && code <= 90) {
        const y = code - 65;
        const x = mod(aInv * (y - b), 26);
        return String.fromCharCode(65 + x);
      }

      // a-z
      if (code >= 97 && code <= 122) {
        const y = code - 97;
        const x = mod(aInv * (y - b), 26);
        return String.fromCharCode(97 + x);
      }

      return ch;
    })
    .join("");
};

/* ============================ Validation ============================ */

/** Validates that a,b are integers and that a is coprime with 26. */
const validateAffineKey = (key: AffineKey): void => {
  assertInteger(key.a, "Affine key.a");
  assertInteger(key.b, "Affine key.b");

  const a = mod(key.a, 26);
  const g = gcd(a, 26);

  if (g !== 1) {
    throw new Error(
      `Invalid affine key: 'a' must be coprime with 26. Got a=${key.a} (mod 26 => ${a}), gcd(a,26)=${g}.`
    );
  }
};

export { affineEncrypt, affineDecrypt };
