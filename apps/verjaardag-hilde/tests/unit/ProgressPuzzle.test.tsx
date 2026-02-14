import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { "data-testid"?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock @hakit/core
const mockUseEntity = vi.fn();

vi.mock("@hakit/core", () => ({
  useEntity: (entityId: string, options?: unknown) =>
    mockUseEntity(entityId, options),
  useHass: () => ({
    callService: vi.fn(),
  }),
}));

import { ProgressPuzzle } from "../../src/components/ProgressPuzzle";

describe("ProgressPuzzle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when entity is loading", () => {
    mockUseEntity.mockReturnValue(null);

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test Puzzle"
        description="Test description"
        items={["Item 1", "Item 2", "Item 3"]}
      />
    );

    expect(screen.getByText("Puzzel laden...")).toBeDefined();
  });

  it("displays puzzle title and description", () => {
    mockUseEntity.mockReturnValue({
      state: "1",
      attributes: { options: ["0", "1", "2", "3"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Deuren Controle"
        description="Open 5 deuren"
        items={["Deur 1", "Deur 2", "Deur 3"]}
      />
    );

    // Title is now just the title without "Puzzel X:" prefix
    expect(screen.getByText("Deuren Controle")).toBeDefined();
    expect(screen.getByText("Open 5 deuren")).toBeDefined();
  });

  it("shows correct progress", () => {
    mockUseEntity.mockReturnValue({
      state: "2",
      attributes: { options: ["0", "1", "2", "3", "4", "5"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test"
        description="Test"
        items={["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]}
      />
    );

    expect(screen.getByText("2 van 5 voltooid")).toBeDefined();
  });

  it("marks completed items with checkmark", () => {
    mockUseEntity.mockReturnValue({
      state: "2",
      attributes: { options: ["0", "1", "2", "3"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test"
        description="Test"
        items={["Item 1", "Item 2", "Item 3"]}
      />
    );

    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBe(2);

    const pending = screen.getAllByText("○");
    expect(pending.length).toBe(1);
  });

  it("applies puzzle-complete class to ProgressCode when puzzle is complete", () => {
    mockUseEntity.mockReturnValue({
      state: "3",
      attributes: { options: ["0", "1", "2", "3"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test"
        description="Test"
        items={["Item 1", "Item 2", "Item 3"]}
      />
    );

    // ProgressCode should have puzzle-complete class for green fade animation
    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(true);
  });

  it("does not apply puzzle-complete class when puzzle is not complete", () => {
    mockUseEntity.mockReturnValue({
      state: "1",
      attributes: { options: ["0", "1", "2", "3"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test"
        description="Test"
        items={["Item 1", "Item 2", "Item 3"]}
      />
    );

    // ProgressCode should NOT have puzzle-complete class
    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(false);
  });

  it("shows placeholder for pending items with progressive disclosure", () => {
    mockUseEntity.mockReturnValue({
      state: "2",
      attributes: { options: ["0", "1", "2", "3", "4", "5"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test"
        description="Test"
        items={[
          "Slaapkamerdeur",
          "Babykamerdeur",
          "Badkamerdeur",
          "Voordeur",
          "Achterdeur",
        ]}
        progressiveDisclosure={true}
        hiddenPlaceholder="Deur ?"
      />
    );

    // First 2 items should show actual names
    expect(screen.getByText("Slaapkamerdeur")).toBeDefined();
    expect(screen.getByText("Babykamerdeur")).toBeDefined();

    // Remaining 3 should show placeholder
    const placeholders = screen.getAllByText("Deur ?");
    expect(placeholders.length).toBe(3);

    // Hidden names should NOT be visible
    expect(screen.queryByText("Badkamerdeur")).toBeNull();
  });

  it("shows all labels when progressiveDisclosure is false (default)", () => {
    mockUseEntity.mockReturnValue({
      state: "0",
      attributes: { options: ["0", "1", "2", "3"] },
    });

    render(
      <ProgressPuzzle
        entityId="input_select.test"
        screenNumber={3}
        puzzleNumber={1}
        title="Test"
        description="Test"
        items={["Item 1", "Item 2", "Item 3"]}
      />
    );

    expect(screen.getByText("Item 1")).toBeDefined();
    expect(screen.getByText("Item 2")).toBeDefined();
    expect(screen.getByText("Item 3")).toBeDefined();
  });
});
