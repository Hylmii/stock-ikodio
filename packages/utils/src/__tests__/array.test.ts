import { unique, uniqueBy, chunk, shuffle, sample } from '../array';

describe('Array utilities', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key function', () => {
      const items = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'John Doe' }
      ];
      const result = uniqueBy(items, item => item.id);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John');
    });
  });

  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('shuffle', () => {
    it('should return array with same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result).toHaveLength(input.length);
      expect(result).toEqual(expect.arrayContaining(input));
    });
  });

  describe('sample', () => {
    it('should return item from array', () => {
      const input = [1, 2, 3];
      const result = sample(input);
      expect(input).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(sample([])).toBeUndefined();
    });
  });
});