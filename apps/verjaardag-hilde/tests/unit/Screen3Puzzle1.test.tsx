import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock useHaEntity hook
const mockUseNumericSelect = vi.fn();

vi.mock("../../src/hooks/useHaEntity", () => ({
  useNumericSelect: (entityId: string) => mockUseNumericSelect(entityId),
}));

// Mock @hakit/core for ProgressCode
vi.mock("@hakit/core", () => ({
  useEntity: vi.fn(() => ({
    state: "0",
    attributes: { options: ["0", "1", "2", "3", "4", "5"] },
  })),
  useHass: () => ({
    callService: vi.fn(),
  }),
}));

import { Screen3Puzzle1 } from "../../src/screens/Screen3Puzzle1";

describe("Screen3Puzzle1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: puzzle in progress (2 of 5 complete)
    mockUseNumericSelect.mockReturnValue({
      value: 2,
      maxValue: 5,
      progress: 0.4,
      isComplete: false,
      isLoading: false,
    });
  });

  it("renders the screen container with correct test id", () => {
    render(<Screen3Puzzle1 />);
    expect(screen.getByTestId("screen-3-puzzle-1")).toBeDefined();
  });

  it("has correct accessibility attributes", () => {
    render(<Screen3Puzzle1 />);
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
    expect(main.getAttribute("aria-label")).toBe("Deuren Controle");
  });

  it("renders ProgressPuzzle with correct title", () => {
    render(<Screen3Puzzle1 />);
    expect(screen.getByText("Deuren Controle")).toBeDefined();
  });

  it("renders ProgressPuzzle with correct description", () => {
    render(<Screen3Puzzle1 />);
    expect(
      screen.getByText(
        "Open en/of sluit 5 verschillende deuren in het huis in de juiste volgorde."
      )
    ).toBeDefined();
  });

  it("subscribes to correct entity ID", () => {
    render(<Screen3Puzzle1 />);
    expect(mockUseNumericSelect).toHaveBeenCalledWith(
      "input_select.verjaardag_hilde_puzzle_1_select"
    );
  });

  it("shows completed door names for revealed items with progressive disclosure", () => {
    render(<Screen3Puzzle1 />);
    // With 2 complete, first 2 door names should be visible
    expect(screen.getByText("Slaapkamerdeur")).toBeDefined();
    expect(screen.getByText("Babykamerdeur")).toBeDefined();
  });

  it("shows placeholder for hidden items with progressive disclosure", () => {
    render(<Screen3Puzzle1 />);
    // Remaining 3 should show placeholder "Deur ?"
    const placeholders = screen.getAllByText("Deur ?");
    expect(placeholders.length).toBe(3);
  });

  it("shows progress text for partial completion", () => {
    render(<Screen3Puzzle1 />);
    expect(screen.getByText("2 van 5 voltooid")).toBeDefined();
  });

  it("shows checkmarks for completed items", () => {
    render(<Screen3Puzzle1 />);
    // 2 completed = 2 checkmarks
    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBe(2);
  });

  it("shows pending indicators for incomplete items", () => {
    render(<Screen3Puzzle1 />);
    // 3 pending = 3 circles
    const pending = screen.getAllByText("○");
    expect(pending.length).toBe(3);
  });

  it("shows loading state when entity is loading", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 0,
      maxValue: 5,
      progress: 0,
      isComplete: false,
      isLoading: true,
    });

    render(<Screen3Puzzle1 />);
    expect(screen.getByText("Puzzel laden...")).toBeDefined();
  });

  it("applies puzzle-complete class for green fade when puzzle is complete", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 5,
      maxValue: 5,
      progress: 1,
      isComplete: true,
      isLoading: false,
    });

    render(<Screen3Puzzle1 />);
    // ProgressCode should have puzzle-complete class for green fade animation
    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(true);
  });

  it("shows all door names when puzzle is complete", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 5,
      maxValue: 5,
      progress: 1,
      isComplete: true,
      isLoading: false,
    });

    render(<Screen3Puzzle1 />);
    // All door names should be visible in new order
    expect(screen.getByText("Slaapkamerdeur")).toBeDefined();
    expect(screen.getByText("Babykamerdeur")).toBeDefined();
    expect(screen.getByText("Badkamerdeur")).toBeDefined();
    expect(screen.getByText("Voordeur")).toBeDefined();
    expect(screen.getByText("Achterdeur")).toBeDefined();
  });

  it("shows 0 progress at start with all items hidden", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 0,
      maxValue: 5,
      progress: 0,
      isComplete: false,
      isLoading: false,
    });

    render(<Screen3Puzzle1 />);
    expect(screen.getByText("0 van 5 voltooid")).toBeDefined();
    // All 5 should be pending and show placeholder
    const pending = screen.getAllByText("○");
    expect(pending.length).toBe(5);
    const placeholders = screen.getAllByText("Deur ?");
    expect(placeholders.length).toBe(5);
  });

  it("renders ProgressCode component", () => {
    render(<Screen3Puzzle1 />);
    // ProgressCode shows "Kluis code:" label
    expect(screen.getByText("Kluis code:")).toBeDefined();
  });
});
