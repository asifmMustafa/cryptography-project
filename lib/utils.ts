import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const parseIntStrict = (value: string): number => {
  // empty => NaN; caller handles error
  return Number.parseInt(value, 10);
};

const isFiniteInteger = (n: number): boolean => {
  return Number.isFinite(n) && Number.isInteger(n);
};

export { parseIntStrict, isFiniteInteger };
