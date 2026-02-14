import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock @hakit/core
const mockUseEntity = vi.fn();
vi.mock("@hakit/core", () => ({
  useEntity: (entityId: string, options?: unknown) =>
    mockUseEntity(entityId, options),
}));

// Mock react-gauge-component
vi.mock("react-gauge-component", () => ({
  default: ({ value, id }: { value: number; id: string }) => (
    <div data-testid="gauge-component" data-value={value} data-id={id}>
      Gauge: {value}%
    </div>
  ),
}));

import { Screen8Puzzle6 } from "../../src/screens/Screen8Puzzle6";

describe("Screen8Puzzle6", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when entities are undefined", () => {
    mockUseEntity.mockReturnValue(undefined);

    render(<Screen8Puzzle6 />);
    expect(screen.getByTestId("puzzle-loading")).toBeDefined();
    expect(screen.getByText("Puzzel laden...")).toBeDefined();
  });

  it("renders puzzle header", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    expect(screen.getByText("Stroomverbruik Controle")).toBeDefined();
  });

  it("shows unsolved description when puzzle is not complete", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "30" };
      }
      return { state: "0" }; // Unsolved
    });

    render(<Screen8Puzzle6 />);
    expect(
      screen.getByText(
        "Pas het stroomverbruik aan tot het in de groene zone valt."
      )
    ).toBeDefined();
  });

  it("shows solved description when puzzle is complete", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "1" }; // Solved
    });

    render(<Screen8Puzzle6 />);
    expect(
      screen.getByText("Perfect! Het stroomverbruik is optimaal.")
    ).toBeDefined();
  });

  it("renders gauge with correct power value", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "45" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    const gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("45");
  });

  it("shows hint section when unsolved", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "30" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    expect(screen.getByTestId("puzzle-hint")).toBeDefined();
    expect(screen.getByText(/Huidige waarde:/)).toBeDefined();
    expect(screen.getByText("30%")).toBeDefined();
    expect(
      screen.getByText("Doel: Breng het niveau tussen 40% en 60%")
    ).toBeDefined();
  });

  it("shows solved section when puzzle is complete", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "1" };
    });

    render(<Screen8Puzzle6 />);
    expect(screen.getByTestId("puzzle-solved")).toBeDefined();
    expect(screen.getByText("Puzzel opgelost!")).toBeDefined();
  });

  it("handles missing power entity state gracefully", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: null };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    // Should default to 0
    const gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("0");
  });

  it("handles invalid power value gracefully", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "invalid" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    // Should default to 0 for invalid values
    const gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("0");
  });

  it("renders ProgressCode component", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    expect(screen.getByText("Kluis code:")).toBeDefined();
  });

  it("gauge updates when entity value changes (uses key prop)", () => {
    // First render with value 30
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "30" };
      }
      return { state: "0" };
    });

    const { rerender } = render(<Screen8Puzzle6 />);
    let gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("30");

    // Update to value 50
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "0" };
    });

    rerender(<Screen8Puzzle6 />);
    gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("50");
  });
});

describe("Screen8Puzzle6 - Gauge color configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "0" };
    });
  });

  it("renders gauge container", () => {
    render(<Screen8Puzzle6 />);
    expect(screen.getByTestId("gauge-container")).toBeDefined();
  });
});
