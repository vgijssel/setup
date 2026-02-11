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

/**
 * App component tests - Updated after Tasks 15-20
 *
 * Changes:
 * - Task 15: Removed 'Verjaardag Hilde' h1 header from GameScreen
 * - Task 16: Screen 1 is now a minimal landing page (tested in Screen1Intro tests)
 * - Task 19: Removed 'Scherm X van 10' text
 * - Task 20: Removed manual navigation controls
 *
 * The App component now renders GameScreen which is a read-only display.
 * The title 'Verjaardag Hilde' only appears on Screen 1 (landing page).
 */
describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variables
    vi.stubEnv("VITE_HA_URL", "http://test:8123");
    vi.stubEnv("VITE_HA_TOKEN", "test_token");
  });

  it("renders the app container", () => {
    render(<App />);
    // The app should render without errors
    expect(screen.getByRole("heading", { level: 2 })).toBeDefined();
  });

  it("starts on screen 1 when global select is 1", () => {
    render(<App />);
    // Screen 1 shows "Welkom!" as the title (from SCREEN_INFO)
    expect(screen.getByText("Welkom!")).toBeDefined();
  });

  it("does not show progress indicator (removed in Task 19)", () => {
    render(<App />);
    // Should NOT have 'Scherm X van 10' text anymore
    expect(screen.queryByText(/Scherm \d+ van 10/)).toBeNull();
  });

  it("shows welcome message on screen 1", () => {
    render(<App />);
    // Screen 1 shows description from SCREEN_INFO
    expect(screen.getByText(/Druk op Start/)).toBeDefined();
  });
});
