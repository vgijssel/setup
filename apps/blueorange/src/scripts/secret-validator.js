export class SecretValidator {
  constructor() {
    this.SECRET = "sorry";
  }

  validate(input) {
    if (typeof input !== "string") return false;
    if (input.length !== 5) return false;
    return input.toLowerCase() === this.SECRET;
  }
}
