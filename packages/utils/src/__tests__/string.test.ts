import { capitalize, kebabCase, camelCase, truncate, randomString } from '../string';

describe('String utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('HELLO');
      expect(capitalize('')).toBe('');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('HelloWorld')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
      expect(kebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
      expect(camelCase('hello world')).toBe('helloWorld');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('hello world', 5)).toBe('he...');
      expect(truncate('hello', 10)).toBe('hello');
      expect(truncate('hello world', 5, '---')).toBe('he---');
    });
  });

  describe('randomString', () => {
    it('should generate string of specified length', () => {
      const result = randomString(10);
      expect(result).toHaveLength(10);
    });

    it('should use custom charset', () => {
      const result = randomString(5, 'abc');
      expect(result).toMatch(/^[abc]+$/);
    });
  });
});