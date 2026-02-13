import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion before other imports
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    button: ({
      children,
      whileHover,
      whileTap,
      whileFocus,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      whileHover?: unknown;
      whileTap?: unknown;
      whileFocus?: unknown;
    }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock @hakit/core before importing App
vi.mock("@hakit/core", () => ({
  HassConnect: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useEntity: vi.fn(() => ({
    state: "1",
    attributes: {
      options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    },
  })),
  useHass: vi.fn(() => ({
    callService: vi.fn(),
  })),
}));

import App from "../../src/App";

/**
 * App component tests - Updated after Tasks 15-21 and Task 25 (Screen1Intro integration)
 *
 * Changes:
 * - Task 15: Removed 'Verjaardag Hilde' h1 header from GameScreen
 * - Task 16: Screen 1 is now a minimal landing page (tested in Screen1Intro tests)
 * - Task 19: Removed 'Scherm X van 10' text
 * - Task 20: Removed manual navigation controls
 * - Task 25: Screen1Intro component now integrated into GameScreen
 *
 * The App component now renders GameScreen which is a read-only display.
 * Screen 1 shows Screen1Intro with 'Verjaardag Hilde' title and Start button.
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
    // The app should render without errors - Screen1Intro shows h1 title
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
  });

  it("renders Screen1Intro with title when global select is 1", () => {
    render(<App />);
    // Screen 1 now renders Screen1Intro with "Verjaardag Hilde" title
    expect(screen.getByTestId("landing-title")).toBeDefined();
    expect(screen.getByText("Verjaardag Hilde")).toBeDefined();
  });

  it("renders Start button from Screen1Intro on screen 1", () => {
    render(<App />);
    // Screen1Intro has a Start button
    expect(screen.getByTestId("start-button")).toBeDefined();
    expect(screen.getByText("Start!")).toBeDefined();
  });

  it("does not show progress indicator (removed in Task 19)", () => {
    render(<App />);
    // Should NOT have 'Scherm X van 11' text anymore
    expect(screen.queryByText(/Scherm \d+ van 11/)).toBeNull();
  });

  it("does NOT render placeholder content for screen 1", () => {
    render(<App />);
    // Old placeholder text should not be present
    expect(screen.queryByText("Welkom!")).toBeNull();
    expect(screen.queryByText(/Druk op Start/)).toBeNull();
  });

  it("Screen1Intro has correct accessibility attributes", () => {
    render(<App />);
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
    expect(main.getAttribute("aria-labelledby")).toBe("landing-title");
  });
});
