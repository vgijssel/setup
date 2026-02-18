import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock hooks
const mockUseCollectionProgress = vi.fn();
vi.mock("../../src/hooks/useHaEntity", () => ({
  useCollectionProgress: (entityIds: string[]) =>
    mockUseCollectionProgress(entityIds),
}));

import { CollectionPuzzle } from "../../src/components/CollectionPuzzle";

const defaultItems = [
  { entityId: "input_boolean.test_red", label: "Rood", description: "Red" },
  { entityId: "input_boolean.test_blue", label: "Blauw", description: "Blue" },
  {
    entityId: "input_boolean.test_green",
    label: "Groen",
    description: "Green",
  },
];

describe("CollectionPuzzle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no items collected
    mockUseCollectionProgress.mockReturnValue({
      items: [{ completed: false }, { completed: false }, { completed: false }],
      completedCount: 0,
      totalCount: 3,
      progress: 0,
      isComplete: false,
      isLoading: false,
      hasNotFoundEntities: false,
    });
  });

  it("renders loading state", () => {
    mockUseCollectionProgress.mockReturnValue({
      items: [],
      completedCount: 0,
      totalCount: 0,
      progress: 0,
      isComplete: false,
      isLoading: true,
      hasNotFoundEntities: false,
    });

    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test Puzzle"
        description="Test description"
        items={defaultItems}
      />
    );

    expect(screen.getByTestId("puzzle-loading")).toBeDefined();
    expect(screen.getByText("Puzzel laden...")).toBeDefined();
  });

  it("renders puzzle title and description", () => {
    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Spraak Controle"
        description="Use voice commands"
        items={defaultItems}
      />
    );

    expect(screen.getByText("Spraak Controle")).toBeDefined();
    expect(screen.getByText("Use voice commands")).toBeDefined();
  });

  it("shows progress bar with correct count", () => {
    mockUseCollectionProgress.mockReturnValue({
      items: [{ completed: true }, { completed: false }, { completed: false }],
      completedCount: 1,
      totalCount: 3,
      progress: 0.33,
      isComplete: false,
      isLoading: false,
      hasNotFoundEntities: false,
    });

    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
      />
    );

    expect(screen.getByText("1 van 3 gevonden")).toBeDefined();
  });

  it("hides labels when items are not collected and showLabelsWhenPending is false", () => {
    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
        showLabelsWhenPending={false}
      />
    );

    // All items should show "???" instead of labels
    const hiddenLabels = screen.getAllByText("???");
    expect(hiddenLabels.length).toBe(3);
    expect(screen.queryByText("Rood")).toBeNull();
    expect(screen.queryByText("Blauw")).toBeNull();
    expect(screen.queryByText("Groen")).toBeNull();
  });

  it("shows labels when items are not collected but showLabelsWhenPending is true", () => {
    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
        showLabelsWhenPending={true}
      />
    );

    // Labels should be visible even when not collected
    expect(screen.getByText("Rood")).toBeDefined();
    expect(screen.getByText("Blauw")).toBeDefined();
    expect(screen.getByText("Groen")).toBeDefined();
    expect(screen.queryByText("???")).toBeNull();
  });

  it("shows labels when items are collected regardless of showLabelsWhenPending", () => {
    mockUseCollectionProgress.mockReturnValue({
      items: [{ completed: true }, { completed: true }, { completed: true }],
      completedCount: 3,
      totalCount: 3,
      progress: 1,
      isComplete: true,
      isLoading: false,
      hasNotFoundEntities: false,
    });

    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
        showLabelsWhenPending={false}
      />
    );

    // Labels should be visible for collected items
    expect(screen.getByText("Rood")).toBeDefined();
    expect(screen.getByText("Blauw")).toBeDefined();
    expect(screen.getByText("Groen")).toBeDefined();
  });

  it("applies collected class to collected items", () => {
    mockUseCollectionProgress.mockReturnValue({
      items: [{ completed: true }, { completed: false }, { completed: false }],
      completedCount: 1,
      totalCount: 3,
      progress: 0.33,
      isComplete: false,
      isLoading: false,
      hasNotFoundEntities: false,
    });

    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
      />
    );

    const collectionItems = document.querySelectorAll(".collection-item");
    expect(collectionItems[0].classList.contains("collected")).toBe(true);
    expect(collectionItems[1].classList.contains("pending")).toBe(true);
    expect(collectionItems[2].classList.contains("pending")).toBe(true);
  });

  it("shows checkmark icon for collected items", () => {
    mockUseCollectionProgress.mockReturnValue({
      items: [{ completed: true }, { completed: false }, { completed: false }],
      completedCount: 1,
      totalCount: 3,
      progress: 0.33,
      isComplete: false,
      isLoading: false,
      hasNotFoundEntities: false,
    });

    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
      />
    );

    // One checkmark, two question marks
    expect(screen.getAllByText("?").length).toBe(2);
  });

  it("shows warning when entities are not found", () => {
    mockUseCollectionProgress.mockReturnValue({
      items: [{ completed: false }, { completed: false }, { completed: false }],
      completedCount: 0,
      totalCount: 3,
      progress: 0,
      isComplete: false,
      isLoading: false,
      hasNotFoundEntities: true,
    });

    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
      />
    );

    expect(screen.getByTestId("puzzle-warning")).toBeDefined();
  });

  it("defaults showLabelsWhenPending to false", () => {
    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
      />
    );

    // Should hide labels by default
    const hiddenLabels = screen.getAllByText("???");
    expect(hiddenLabels.length).toBe(3);
  });

  it("renders ProgressCode component", () => {
    render(
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Test"
        description="Test"
        items={defaultItems}
      />
    );

    expect(screen.getByText("Kluis code:")).toBeDefined();
  });
});
