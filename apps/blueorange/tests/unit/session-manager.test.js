import { describe, it, expect, beforeEach } from "vitest";
import { SessionManager } from "../../src/scripts/session-manager.js";

describe("SessionManager", () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  it("should return false initially when not validated", () => {
    const manager = new SessionManager();
    expect(manager.isValidated()).toBe(false);
  });

  it("should return true after markValidated", () => {
    const manager = new SessionManager();
    manager.markValidated();
    expect(manager.isValidated()).toBe(true);
  });

  it("should return false after clearValidation", () => {
    const manager = new SessionManager();
    manager.markValidated();
    manager.clearValidation();
    expect(manager.isValidated()).toBe(false);
  });

  it('should use "secretValidated" as storage key', () => {
    const manager = new SessionManager();
    manager.markValidated();
    expect(sessionStorage.getItem("secretValidated")).toBe("true");
  });

  it('should set "true" value after markValidated', () => {
    const manager = new SessionManager();
    manager.markValidated();
    expect(sessionStorage.getItem("secretValidated")).toBe("true");
  });
});
