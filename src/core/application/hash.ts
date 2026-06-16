export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

export function stableProblemId(seedKey: string): string {
  const hash = hashString(seedKey);
  return hash.toString(36);
}
