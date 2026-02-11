import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
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
    expect(main.getAttribute("aria-label")).toBe("Puzzel 1: De Deuren");
  });

  it("renders ProgressPuzzle with correct title", () => {
    render(<Screen3Puzzle1 />);
    expect(screen.getByText("Puzzel 1: De Deuren")).toBeDefined();
  });

  it("renders ProgressPuzzle with correct description", () => {
    render(<Screen3Puzzle1 />);
    expect(
      screen.getByText(
        "Open 5 verschillende deuren in het huis om de eerste code te ontgrendelen."
      )
    ).toBeDefined();
  });

  it("subscribes to correct entity ID", () => {
    render(<Screen3Puzzle1 />);
    expect(mockUseNumericSelect).toHaveBeenCalledWith(
      "input_select.verjaardag_hilde_puzzle_1_select"
    );
  });

  it("displays all 5 door items", () => {
    render(<Screen3Puzzle1 />);
    expect(screen.getByText("Voordeur")).toBeDefined();
    expect(screen.getByText("Achterdeur")).toBeDefined();
    expect(screen.getByText("Garagedeur")).toBeDefined();
    expect(screen.getByText("Slaapkamerdeur")).toBeDefined();
    expect(screen.getByText("Badkamerdeur")).toBeDefined();
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

  it("shows hint when puzzle is not complete", () => {
    render(<Screen3Puzzle1 />);
    expect(
      screen.getByText(
        /Loop door het huis en open elke deur\. De sensoren detecteren automatisch wanneer een deur opengaat\./
      )
    ).toBeDefined();
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

  it("shows completion message when puzzle is complete", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 5,
      maxValue: 5,
      progress: 1,
      isComplete: true,
      isLoading: false,
    });

    render(<Screen3Puzzle1 />);
    expect(screen.getByText("Puzzel opgelost!")).toBeDefined();
  });

  it("hides hint when puzzle is complete", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 5,
      maxValue: 5,
      progress: 1,
      isComplete: true,
      isLoading: false,
    });

    render(<Screen3Puzzle1 />);
    expect(
      screen.queryByText(/Loop door het huis en open elke deur/)
    ).toBeNull();
  });

  it("shows 0 progress at start", () => {
    mockUseNumericSelect.mockReturnValue({
      value: 0,
      maxValue: 5,
      progress: 0,
      isComplete: false,
      isLoading: false,
    });

    render(<Screen3Puzzle1 />);
    expect(screen.getByText("0 van 5 voltooid")).toBeDefined();
    // All 5 should be pending
    const pending = screen.getAllByText("○");
    expect(pending.length).toBe(5);
  });

  it("renders ProgressCode component", () => {
    render(<Screen3Puzzle1 />);
    // ProgressCode shows "Code:" label
    expect(screen.getByText("Code:")).toBeDefined();
  });
});
