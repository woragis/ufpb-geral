const BASE62 =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function randomShareableSeed(length = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE62[Math.floor(Math.random() * BASE62.length)]!;
  }
  return result;
}
