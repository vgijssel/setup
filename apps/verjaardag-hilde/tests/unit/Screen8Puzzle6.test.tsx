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
        "Schakel apparaten aan of uit om het stroomverbruik aan te passen tot het in de groene zone valt."
      )
    ).toBeDefined();
  });

  it("shows standard description regardless of puzzle state", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "1" }; // Solved
    });

    render(<Screen8Puzzle6 />);
    expect(
      screen.getByText(
        "Schakel apparaten aan of uit om het stroomverbruik aan te passen tot het in de groene zone valt."
      )
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

  it("shows hint section regardless of puzzle state", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "50" };
      }
      return { state: "1" }; // Solved
    });

    render(<Screen8Puzzle6 />);
    expect(screen.getByTestId("puzzle-hint")).toBeDefined();
    expect(screen.getByText(/Huidige waarde:/)).toBeDefined();
    expect(screen.getByText("50%")).toBeDefined();
    expect(
      screen.getByText("Doel: Breng het niveau tussen 40% en 60%")
    ).toBeDefined();
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

  it("handles unavailable entity state gracefully", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "unavailable" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    // Should default to 0 for unavailable state
    const gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("0");
  });

  it("handles unknown entity state gracefully", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "unknown" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    // Should default to 0 for unknown state
    const gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("0");
  });

  it("clamps power value to 0-100 range", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "150" }; // Over 100
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    // Should clamp to max 100
    const gauge = screen.getByTestId("gauge-component");
    expect(gauge.getAttribute("data-value")).toBe("100");
  });

  it("clamps negative power value to 0", () => {
    mockUseEntity.mockImplementation((entityId: string) => {
      if (entityId.includes("power_number")) {
        return { state: "-10" };
      }
      return { state: "0" };
    });

    render(<Screen8Puzzle6 />);
    // Should clamp to min 0
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

  it("gauge updates when entity value changes", () => {
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
