import { describe, it, expect } from 'vitest';
import { SecretValidator } from '../../src/scripts/secret-validator.js';

describe('SecretValidator', () => {
  it('should validate correct secret "sorry"', () => {
    const validator = new SecretValidator();
    expect(validator.validate('sorry')).toBe(true);
  });

  it('should reject wrong case "Sorry"', () => {
    const validator = new SecretValidator();
    expect(validator.validate('Sorry')).toBe(false);
  });

  it('should reject wrong value "hello"', () => {
    const validator = new SecretValidator();
    expect(validator.validate('hello')).toBe(false);
  });

  it('should reject too short input "sorr"', () => {
    const validator = new SecretValidator();
    expect(validator.validate('sorr')).toBe(false);
  });

  it('should reject too long input "sorrys"', () => {
    const validator = new SecretValidator();
    expect(validator.validate('sorrys')).toBe(false);
  });

  it('should reject special characters "sorr!"', () => {
    const validator = new SecretValidator();
    expect(validator.validate('sorr!')).toBe(false);
  });
});
