import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressCode } from "../../src/components/ProgressCode";

/**
 * ProgressCode tests - Updated for 8 puzzles across 11 screens
 *
 * The full code is "83924980" (8 individual digits) plus 'A' suffix.
 * Each completed puzzle reveals exactly ONE digit:
 * - Screen 3 (start): "__ __ __ __ A" (0 digits + A)
 * - Screen 4 (after puzzle 1): "8_ __ __ __ A" (1 digit + A)
 * - Screen 5 (after puzzle 2): "83 __ __ __ A" (2 digits + A)
 * - Screen 6 (after puzzle 3): "83 9_ __ __ A" (3 digits + A)
 * - Screen 7 (after puzzle 4): "83 92 __ __ A" (4 digits + A)
 * - Screen 8 (after puzzle 5): "83 92 4_ __ A" (5 digits + A)
 * - Screen 9 (after puzzle 6): "83 92 49 __ A" (6 digits + A)
 * - Screen 10 (after puzzle 7): "83 92 49 8_ A" (7 digits + A)
 * - Screen 11 (after puzzle 8): "83 92 49 80 A" (all 8 digits + A)
 */
describe("ProgressCode", () => {
  it("shows no digits on screen 3", () => {
    render(<ProgressCode screenNumber={3} />);

    // All 8 individual digits should be hidden (shown as '_')
    const hiddenDigits = screen.getAllByText("_");
    expect(hiddenDigits.length).toBe(8);

    // Should show the 'A' suffix
    expect(screen.getByText("A")).toBeDefined();

    // Should show the Klaassandra instruction text
    expect(
      screen.getByText(
        "Diagnostiseer systemen om Klaassandra haar geheugen te helpen herstellen"
      )
    ).toBeDefined();
  });

  it("shows first digit on screen 4", () => {
    render(<ProgressCode screenNumber={4} />);

    // First digit '8' should be revealed
    expect(screen.getByText("8")).toBeDefined();

    // 7 digits should still be hidden
    const hiddenDigits = screen.getAllByText("_");
    expect(hiddenDigits.length).toBe(7);

    // Should show digit count with "hersteld" text
    expect(screen.getByText("1/8 cijfers hersteld")).toBeDefined();
  });

  it("shows two digits on screen 5", () => {
    render(<ProgressCode screenNumber={5} />);

    // First two digits '8' and '3' should be revealed
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();

    // 6 digits should still be hidden
    const hiddenDigits = screen.getAllByText("_");
    expect(hiddenDigits.length).toBe(6);

    expect(screen.getByText("2/8 cijfers hersteld")).toBeDefined();
  });

  it("shows three digits on screen 6", () => {
    render(<ProgressCode screenNumber={6} />);

    // First three digits '8', '3', '9' should be revealed
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("9")).toBeDefined();

    // 5 digits should still be hidden
    const hiddenDigits = screen.getAllByText("_");
    expect(hiddenDigits.length).toBe(5);

    expect(screen.getByText("3/8 cijfers hersteld")).toBeDefined();
  });

  it("shows four digits on screen 7", () => {
    render(<ProgressCode screenNumber={7} />);

    // First four digits '8', '3', '9', '2' should be revealed
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    // Note: '9' and '2' are individual characters, each appears once
    expect(screen.getAllByText("9").length).toBe(1);
    expect(screen.getByText("2")).toBeDefined();

    // 4 digits should still be hidden
    const hiddenDigits = screen.getAllByText("_");
    expect(hiddenDigits.length).toBe(4);

    expect(screen.getByText("4/8 cijfers hersteld")).toBeDefined();
  });

  it("shows all digits on screen 11", () => {
    render(<ProgressCode screenNumber={11} />);

    // All digits should be revealed: 8, 3, 9, 2, 4, 9, 8, 0
    // Check for presence of revealed digits
    const codeDisplay = screen.getByText((_, element) => {
      return element?.classList.contains("code-display") ?? false;
    });
    expect(codeDisplay).toBeDefined();

    // No hidden digits
    expect(screen.queryAllByText("_").length).toBe(0);

    expect(screen.getByText("8/8 cijfers hersteld")).toBeDefined();
  });

  it("handles screen 1 and 2 gracefully", () => {
    render(<ProgressCode screenNumber={1} />);

    // Should show no digits revealed (negative puzzles completed = 0)
    const hiddenDigits = screen.getAllByText("_");
    expect(hiddenDigits.length).toBe(8);

    // Should still show the 'A' suffix
    expect(screen.getByText("A")).toBeDefined();
  });

  it("has puzzle-complete class when puzzleJustCompleted is true", () => {
    render(<ProgressCode screenNumber={5} puzzleJustCompleted={true} />);

    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(true);
  });

  it("does not have puzzle-complete class when puzzleJustCompleted is false", () => {
    render(<ProgressCode screenNumber={5} puzzleJustCompleted={false} />);

    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(false);
  });

  it("does not have puzzle-complete class by default", () => {
    render(<ProgressCode screenNumber={5} />);

    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(false);
  });
});
