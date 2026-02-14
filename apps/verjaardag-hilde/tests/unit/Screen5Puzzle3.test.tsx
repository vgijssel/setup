import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock @hakit/core
const mockCallService = vi.fn();
vi.mock("@hakit/core", () => ({
  useHass: () => ({
    callService: mockCallService,
  }),
}));

// Mock @dnd-kit/core
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drag-overlay">{children}</div>
  ),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
  useSensor: vi.fn(),
  useSensors: () => [],
  MouseSensor: {},
  TouchSensor: {},
  closestCorners: vi.fn(),
}));

import { Screen5Puzzle3 } from "../../src/screens/Screen5Puzzle3";

describe("Screen5Puzzle3", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the screen container", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByText("Schakelaars Puzzel")).toBeDefined();
  });

  it("renders puzzle description", () => {
    render(<Screen5Puzzle3 />);
    expect(
      screen.getByText(/Sleep elke schakelaar naar de juiste lamp/)
    ).toBeDefined();
  });

  it("renders all 5 switches", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByTestId("switch-slaapkamer")).toBeDefined();
    expect(screen.getByTestId("switch-waskamer")).toBeDefined();
    expect(screen.getByTestId("switch-keuken")).toBeDefined();
    expect(screen.getByTestId("switch-tuin")).toBeDefined();
    expect(screen.getByTestId("switch-voorraadkast")).toBeDefined();
  });

  it("renders all 5 bulbs", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByTestId("bulb-waskamer")).toBeDefined();
    expect(screen.getByTestId("bulb-voorraadkast")).toBeDefined();
    expect(screen.getByTestId("bulb-slaapkamer")).toBeDefined();
    expect(screen.getByTestId("bulb-keuken")).toBeDefined();
    expect(screen.getByTestId("bulb-tuin")).toBeDefined();
  });

  it("shows initial progress as 0 of 5", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByText("0 van 5 correct")).toBeDefined();
  });

  it("shows switches container heading", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByText("Schakelaars")).toBeDefined();
  });

  it("does not show bulbs container heading (removed per task 70)", () => {
    render(<Screen5Puzzle3 />);
    // The "Lampen" heading was removed, so it should not be present
    expect(screen.queryByText("Lampen")).toBeNull();
  });

  it("renders DndContext for drag and drop", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByTestId("dnd-context")).toBeDefined();
  });

  it("renders ProgressCode component", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByText("Kluis code:")).toBeDefined();
  });

  it("shows drop hints on empty bulbs", () => {
    render(<Screen5Puzzle3 />);
    const dropHints = screen.getAllByText("Sleep schakelaar hier");
    expect(dropHints.length).toBe(5);
  });

  it("does not show return zone when no switches are placed", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.queryByTestId("switch-return-zone")).toBeNull();
  });
});

describe("Screen5Puzzle3 - BulbDroppable states", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bulb has default styling without placed switch", () => {
    render(<Screen5Puzzle3 />);
    const bulb = screen.getByTestId("bulb-waskamer");
    expect(bulb.classList.contains("bulb-droppable")).toBe(true);
    expect(bulb.classList.contains("correct")).toBe(false);
    expect(bulb.classList.contains("incorrect")).toBe(false);
    expect(bulb.classList.contains("occupied")).toBe(false);
  });
});
