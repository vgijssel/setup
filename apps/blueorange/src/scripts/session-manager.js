export class SessionManager {
  constructor() {
    this.STORAGE_KEY = 'secretValidated';
    this.storage = window.sessionStorage;
  }

  markValidated() {
    this.storage.setItem(this.STORAGE_KEY, 'true');
  }

  isValidated() {
    return this.storage.getItem(this.STORAGE_KEY) === 'true';
  }

  clearValidation() {
    this.storage.removeItem(this.STORAGE_KEY);
  }
}
