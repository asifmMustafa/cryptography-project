import { TwoByTwoMatrix, HillRecoveredKey } from "../types/ciphers";
import { letterToIndex, indexToLetter } from "../utils/alphabets";
import {
  gcd,
  det2x2Mod26,
  invert2x2Mod26,
  multiply2x2Mod26,
  multiply2x2ByVectorMod26,
  normalizeKeyMatrix,
  matrixFromColumns,
} from "../utils/math";

/**
 * Recovers a 2x2 Hill key (mod 26) from aligned known plaintext + ciphertext.
 *
 * Behavior:
 * - Silently strips all non-letters from both inputs, then uppercases.
 * - Requires at least 4 letters in each input after normalization.
 * - Requires equal normalized lengths and even length (whole digraphs).
 * - Derives K using any invertible plaintext digraph-pair, then verifies K across the full snippet.
 *
 * Returns both matrix and 4-letter string (row-major).
 */
const crackHillKeyKnownPlaintext = (
  knownPlaintext: string,
  correspondingCiphertext: string
): HillRecoveredKey => {
  const P = normalizeLettersOnlyUpper(knownPlaintext);
  const C = normalizeLettersOnlyUpper(correspondingCiphertext);

  if (P.length < 4)
    throw new Error(
      "Known plaintext must contain at least 4 letters (2 digraphs)."
    );
  if (C.length < 4)
    throw new Error("Ciphertext must contain at least 4 letters (2 digraphs).");

  if (P.length !== C.length) {
    throw new Error(
      `Known plaintext and ciphertext must have the same number of letters after removing punctuation/spaces. ` +
        `Got plaintext=${P.length}, ciphertext=${C.length}.`
    );
  }

  if (P.length % 2 !== 0) {
    throw new Error(
      "Known plaintext/ciphertext must have an even number of letters after normalization (whole digraphs)."
    );
  }

  const pVecs = toDigraphVectors(P);
  const cVecs = toDigraphVectors(C);

  // Find any invertible plaintext digraph-pair Ppair.
  for (let i = 0; i < pVecs.length; i++) {
    for (let j = i + 1; j < pVecs.length; j++) {
      const Ppair = matrixFromColumns(pVecs[i]!, pVecs[j]!);
      const detP = det2x2Mod26(Ppair);

      if (gcd(detP, 26) !== 1) continue; // not invertible; try another pair

      const Cpair = matrixFromColumns(cVecs[i]!, cVecs[j]!);
      const invP = invert2x2Mod26(Ppair);
      const K = normalizeKeyMatrix(multiply2x2Mod26(Cpair, invP));

      // Verify against the entire aligned snippet.
      if (!verifyKeyAgainstVectors(K, pVecs, cVecs)) {
        throw new Error(
          "The provided plaintext/ciphertext snippet is not consistent with a single 2x2 Hill key (mod 26). " +
            "Double-check that your snippet is truly aligned and produced by the same Hill implementation."
        );
      }

      return {
        matrix: K,
        keyString: TwoByTwoMatrixToString(K),
      };
    }
  }

  throw new Error(
    "Cannot derive a unique Hill key from this snippet because none of the plaintext digraph pairs form an invertible 2x2 matrix modulo 26. " +
      "Try a different aligned snippet (still 4+ letters) where the plaintext digraphs are more 'varied'."
  );
};

/* ============================ Helpers ============================ */

/** Strips non-letters, uppercases A-Z. Punctuation/spaces are ignored silently. */
const normalizeLettersOnlyUpper = (text: string): string =>
  Array.from(text)
    .filter((c) => /[A-Za-z]/.test(c))
    .map((c) => c.toUpperCase())
    .join("");

/** Converts normalized A-Z string into digraph vectors (A->0..Z->25). */
const toDigraphVectors = (lettersUpper: string): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i < lettersUpper.length; i += 2) {
    out.push([
      letterToIndex(lettersUpper[i]!),
      letterToIndex(lettersUpper[i + 1]!),
    ]);
  }
  return out;
};

/** Converts matrix [[a,b],[c,d]] to 4-letter row-major key "ABCD" with A=0..Z=25. */
const TwoByTwoMatrixToString = (k: TwoByTwoMatrix): string => {
  const [[a, b], [c, d]] = k;
  return [a, b, c, d].map(indexToLetter).join("");
};

/** Verifies K*P == C for all provided digraph vectors. */
const verifyKeyAgainstVectors = (
  key: TwoByTwoMatrix,
  plaintextVecs: [number, number][],
  ciphertextVecs: [number, number][]
): boolean => {
  for (let i = 0; i < plaintextVecs.length; i++) {
    const p = plaintextVecs[i]!;
    const expected = ciphertextVecs[i]!;
    const actual = multiply2x2ByVectorMod26(key, p);
    if (actual[0] !== expected[0] || actual[1] !== expected[1]) return false;
  }
  return true;
};

export { crackHillKeyKnownPlaintext };
