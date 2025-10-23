import { formatDate, formatRelativeTime, isToday } from '../date';

describe('Date utilities', () => {
  describe('formatDate', () => {
    it('should format date with default options', () => {
      const date = new Date('2023-12-25');
      const result = formatDate(date);
      expect(result).toBe('December 25, 2023');
    });

    it('should format date with custom options', () => {
      const date = new Date('2023-12-25');
      const result = formatDate(date, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      expect(result).toBe('Dec 25, 2023');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent dates', () => {
      const date = new Date();
      const result = formatRelativeTime(date);
      expect(result).toBe('just now');
    });

    it('should return correct relative time for hours', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const result = formatRelativeTime(date);
      expect(result).toBe('2 hours ago');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isToday(yesterday)).toBe(false);
    });
  });
});