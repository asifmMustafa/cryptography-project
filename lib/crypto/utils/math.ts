import { TwoByTwoMatrix } from "../types/ciphers";

/** Mathematical modulus that always returns a value in [0, m-1]. */
const mod = (n: number, m: number): number => ((n % m) + m) % m;

/** Greatest common divisor via Euclidean algorithm. */
const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
};

/** Extended Euclidean algorithm: returns g=gcd(a,b) and Bézout coefficients x,y. */
const egcd = (a: number, b: number): { g: number; x: number; y: number } => {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const { g, x: x1, y: y1 } = egcd(b, a % b);
  return { g, x: y1, y: x1 - Math.floor(a / b) * y1 };
};

/**
 * Modular inverse of a modulo m. Throws if gcd(a,m) != 1.
 * Returns value in [0, m-1].
 */
const modInverse = (a: number, m: number): number => {
  const { g, x } = egcd(a, m);
  if (g !== 1) throw new Error(`No modular inverse for a=${a} mod m=${m}`);
  return mod(x, m);
};

/** Ensures the number is a finite integer; otherwise throws. */
const assertInteger = (value: number, name: string): void => {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(`${name} must be a finite integer. Got: ${value}`);
  }
};

/** Determinant of a 2x2 matrix mod 26. */
const det2x2Mod26 = (m: TwoByTwoMatrix): number => {
  const [[a, b], [c, d]] = m;
  return mod(a * d - b * c, 26);
};

/** Inverts a 2x2 matrix mod 26 (throws if not invertible). */
const invert2x2Mod26 = (m: TwoByTwoMatrix): TwoByTwoMatrix => {
  const [[a, b], [c, d]] = m;
  const det = det2x2Mod26(m);
  const detInv = modInverse(det, 26);

  return [
    [mod(d * detInv, 26), mod(-b * detInv, 26)],
    [mod(-c * detInv, 26), mod(a * detInv, 26)],
  ];
};

/** Multiplies two 2x2 matrices mod 26. */
const multiply2x2Mod26 = (
  A: TwoByTwoMatrix,
  B: TwoByTwoMatrix
): TwoByTwoMatrix => {
  const [[a00, a01], [a10, a11]] = A;
  const [[b00, b01], [b10, b11]] = B;

  return [
    [mod(a00 * b00 + a01 * b10, 26), mod(a00 * b01 + a01 * b11, 26)],
    [mod(a10 * b00 + a11 * b10, 26), mod(a10 * b01 + a11 * b11, 26)],
  ];
};

/** Multiplies a 2x2 matrix by a 2x1 vector mod 26. */
const multiply2x2ByVectorMod26 = (
  M: TwoByTwoMatrix,
  v: [number, number]
): [number, number] => {
  const [[a, b], [c, d]] = M;
  return [mod(a * v[0] + b * v[1], 26), mod(c * v[0] + d * v[1], 26)];
};

/** Normalizes key entries to [0..25]. */
const normalizeKeyMatrix = (k: TwoByTwoMatrix): TwoByTwoMatrix => {
  const [[a, b], [c, d]] = k;
  return [
    [mod(a, 26), mod(b, 26)],
    [mod(c, 26), mod(d, 26)],
  ];
};

/**
 * Constructs a 2x2 matrix from two column vectors v1 and v2:
 * v1=(x1,y1), v2=(x2,y2) => [[x1,x2],[y1,y2]].
 */
const matrixFromColumns = (
  v1: [number, number],
  v2: [number, number]
): TwoByTwoMatrix => [
  [v1[0], v2[0]],
  [v1[1], v2[1]],
];

export {
  mod,
  gcd,
  modInverse,
  egcd,
  assertInteger,
  det2x2Mod26,
  invert2x2Mod26,
  multiply2x2Mod26,
  multiply2x2ByVectorMod26,
  normalizeKeyMatrix,
  matrixFromColumns,
};
