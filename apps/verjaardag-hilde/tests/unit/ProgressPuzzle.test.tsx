import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

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
        title="De Deuren"
        description="Open 5 deuren"
        items={["Deur 1", "Deur 2", "Deur 3"]}
      />
    );

    expect(screen.getByText("Puzzel 1: De Deuren")).toBeDefined();
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

  it("shows hint when not complete", () => {
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
        hint="This is a hint"
      />
    );

    expect(screen.getByText(/This is a hint/)).toBeDefined();
  });

  it("shows completion message when puzzle is complete", () => {
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
        hint="This hint should be hidden"
      />
    );

    expect(screen.getByText("Puzzel opgelost!")).toBeDefined();
    expect(screen.queryByText(/This hint should be hidden/)).toBeNull();
  });
});
