import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const nanoid = (size: number = 21) => customAlphabet(alphabet, size)();

export const generateKey = (size: number = 21) => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return customAlphabet(alphabet, size)();
};
