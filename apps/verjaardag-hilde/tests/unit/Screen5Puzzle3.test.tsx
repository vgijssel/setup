import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock @hakit/core
const mockCallService = vi.fn();
const mockUseEntity = vi.fn();
vi.mock("@hakit/core", () => ({
  useHass: () => ({
    callService: mockCallService,
  }),
  useEntity: (entityId: string, options?: unknown) =>
    mockUseEntity(entityId, options),
  EntityName: {},
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
    // Default: all entities return "off" state
    mockUseEntity.mockReturnValue({ state: "off" });
  });

  it("renders the screen container", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByText("Schakelaars Controle")).toBeDefined();
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

  it("renders switches in alphabetical order", () => {
    render(<Screen5Puzzle3 />);
    const switchesContainer = screen.getByText("Schakelaars").closest("div");
    const switchElements = switchesContainer?.querySelectorAll(
      "[data-testid^='switch-']"
    );
    const switchIds = Array.from(switchElements || []).map((el) =>
      el.getAttribute("data-testid")?.replace("switch-", "")
    );
    expect(switchIds).toEqual([
      "keuken",
      "slaapkamer",
      "tuin",
      "voorraadkast",
      "waskamer",
    ]);
  });

  it("renders all 5 bulbs", () => {
    render(<Screen5Puzzle3 />);
    expect(screen.getByTestId("bulb-waskamer")).toBeDefined();
    expect(screen.getByTestId("bulb-voorraadkast")).toBeDefined();
    expect(screen.getByTestId("bulb-slaapkamer")).toBeDefined();
    expect(screen.getByTestId("bulb-keuken")).toBeDefined();
    expect(screen.getByTestId("bulb-tuin")).toBeDefined();
  });

  it("renders bulbs in alphabetical order", () => {
    render(<Screen5Puzzle3 />);
    const bulbElements = screen.getAllByTestId(/^bulb-/);
    const bulbIds = bulbElements.map((el) =>
      el.getAttribute("data-testid")?.replace("bulb-", "")
    );
    expect(bulbIds).toEqual([
      "keuken",
      "slaapkamer",
      "tuin",
      "voorraadkast",
      "waskamer",
    ]);
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
    mockUseEntity.mockReturnValue({ state: "off" });
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

describe("Screen5Puzzle3 - Entity State Sync (Task 80)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("syncs Slaapkamer switch to Waskamer bulb when entity is on", () => {
    // Mock Slaapkamer entity as "on" (which should place the switch on Waskamer bulb)
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("slaapkamer")) {
        return { state: "on" };
      }
      return { state: "off" };
    });

    render(<Screen5Puzzle3 />);

    // The Waskamer bulb should have the Slaapkamer switch placed
    const waskamerBulb = screen.getByTestId("bulb-waskamer");
    expect(waskamerBulb.classList.contains("occupied")).toBe(true);
    expect(waskamerBulb.classList.contains("correct")).toBe(true);
  });

  it("syncs multiple switches when multiple entities are on", () => {
    // Mock multiple entities as "on"
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("slaapkamer") || entityId.includes("keuken")) {
        return { state: "on" };
      }
      return { state: "off" };
    });

    render(<Screen5Puzzle3 />);

    // Slaapkamer -> Waskamer, Keuken -> Slaapkamer
    const waskamerBulb = screen.getByTestId("bulb-waskamer");
    const slaapkamerBulb = screen.getByTestId("bulb-slaapkamer");

    expect(waskamerBulb.classList.contains("occupied")).toBe(true);
    expect(slaapkamerBulb.classList.contains("occupied")).toBe(true);
  });

  it("shows 5 correct when all entities are on", () => {
    // Mock all entities as "on"
    mockUseEntity.mockReturnValue({ state: "on" });

    render(<Screen5Puzzle3 />);

    // Should show "5 van 5 correct"
    expect(screen.getByText("5 van 5 correct")).toBeDefined();
  });

  it("shows 0 correct when all entities are off", () => {
    mockUseEntity.mockReturnValue({ state: "off" });

    render(<Screen5Puzzle3 />);

    expect(screen.getByText("0 van 5 correct")).toBeDefined();
  });

  it("handles null entity gracefully", () => {
    mockUseEntity.mockReturnValue(null);

    render(<Screen5Puzzle3 />);

    // Should still render without errors
    expect(screen.getByText("0 van 5 correct")).toBeDefined();
  });
});
