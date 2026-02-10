import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock @hakit/core before importing App
vi.mock("@hakit/core", () => ({
  HassConnect: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useEntity: vi.fn(() => ({
    state: "1",
    attributes: {
      options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
  })),
  useHass: vi.fn(() => ({
    callService: vi.fn(),
  })),
}));

import App from "../../src/App";

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variables
    vi.stubEnv("VITE_HA_URL", "http://test:8123");
    vi.stubEnv("VITE_HA_TOKEN", "test_token");
  });

  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("Verjaardag Hilde")).toBeDefined();
  });

  it("starts on screen 1 when global select is 1", () => {
    render(<App />);
    expect(screen.getByText("Scherm 1 van 10")).toBeDefined();
  });

  it("shows the start button on screen 1", () => {
    render(<App />);
    expect(screen.getByText("Start!")).toBeDefined();
  });

  it("shows welcome message on screen 1", () => {
    render(<App />);
    expect(screen.getByText("Welkom!")).toBeDefined();
  });
});
