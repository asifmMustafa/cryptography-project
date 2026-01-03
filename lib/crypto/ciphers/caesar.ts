import { mod, assertInteger } from "../utils/math";

/** Encrypts text with a Caesar shift (letters only; preserves case & non-letters). */
const caesarEncrypt = (plaintext: string, shift: number): string => {
  assertInteger(shift, "shift");
  return shiftAlphabeticCharacters(plaintext, shift);
};

/** Decrypts text with a Caesar shift (inverse operation of caesarEncrypt). */
const caesarDecrypt = (ciphertext: string, shift: number): string => {
  assertInteger(shift, "shift");
  return shiftAlphabeticCharacters(ciphertext, -shift);
};

/** Shifts A-Z / a-z by the given amount (mod 26), leaving other chars unchanged. */
const shiftAlphabeticCharacters = (input: string, shift: number): string => {
  const normalizedShift = mod(shift, 26);

  return Array.from(input)
    .map((ch) => {
      const code = ch.charCodeAt(0);

      // A-Z
      if (code >= 65 && code <= 90) {
        const base = 65;
        return String.fromCharCode(
          base + mod(code - base + normalizedShift, 26)
        );
      }

      // a-z
      if (code >= 97 && code <= 122) {
        const base = 97;
        return String.fromCharCode(
          base + mod(code - base + normalizedShift, 26)
        );
      }

      return ch;
    })
    .join("");
};

export { caesarEncrypt, caesarDecrypt };
