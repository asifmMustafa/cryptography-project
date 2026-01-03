/** Affine cipher key: E(x) = (a*x + b) mod 26, with gcd(a,26)=1. */
export type AffineKey = { a: number; b: number };

/** 5x5 Playfair key square with quick lookup of letter positions. */
export type PlayfairKeySquare = {
  square: string[]; // length 25
  pos: Map<string, { r: number; c: number }>;
};

/** 2x2 Hill key matrix (values interpreted mod 26). */
export type TwoByTwoMatrix = [[number, number], [number, number]];

/**
 * Hill key input:
 * - Matrix form: [[a,b],[c,d]]
 * - String form: exactly 4 letters (e.g., "HILL"), mapped A->0 ... Z->25
 */
export type HillKeyInput = TwoByTwoMatrix | string;

export type HillRecoveredKey = {
  /** 2x2 key matrix in row-major form: [[a,b],[c,d]] (values in 0..25). */
  matrix: TwoByTwoMatrix;
  /** 4-letter string in row-major order: a b c d (A=0..Z=25). */
  keyString: string;
};
