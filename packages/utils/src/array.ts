/**
 * Remove duplicates from an array
 * @param array - The array to remove duplicates from
 * @returns The array without duplicates
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates from an array by a key function
 * @param array - The array to remove duplicates from
 * @param keyFn - The function to generate keys for comparison
 * @returns The array without duplicates
 */
export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Chunk an array into smaller arrays
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns The chunked array
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle an array
 * @param array - The array to shuffle
 * @returns The shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get a random item from an array
 * @param array - The array to get a random item from
 * @returns A random item from the array
 */
export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}