export class SecretValidator {
  constructor() {
    this.SECRET = 'SORRY';
  }

  validate(input) {
    if (typeof input !== 'string') return false;
    if (input.length !== 5) return false;
    return input.toUpperCase() === this.SECRET;
  }
}
