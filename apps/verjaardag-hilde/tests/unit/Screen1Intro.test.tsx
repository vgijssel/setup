import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock framer-motion to avoid animation issues in tests
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

// Mock useHaService hook
const mockNavigateToScreen = vi.fn();
vi.mock("../../src/hooks/useHaService", () => ({
  useHaService: () => ({
    navigateToScreen: mockNavigateToScreen,
  }),
}));

import { Screen1Intro } from "../../src/screens/Screen1Intro";

describe("Screen1Intro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the landing page title", () => {
    render(<Screen1Intro />);
    expect(screen.getByTestId("landing-title")).toBeDefined();
    expect(screen.getByText("Verjaardag Hilde")).toBeDefined();
  });

  it("renders the Start button with correct aria-label", () => {
    render(<Screen1Intro />);
    const button = screen.getByTestId("start-button");
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-label")).toBe("Start de escaperoom");
    expect(screen.getByText("Start!")).toBeDefined();
  });

  it("calls navigateToScreen(2) when Start button is clicked", () => {
    render(<Screen1Intro />);
    const button = screen.getByTestId("start-button");
    fireEvent.click(button);
    expect(mockNavigateToScreen).toHaveBeenCalledTimes(1);
    expect(mockNavigateToScreen).toHaveBeenCalledWith(2);
  });

  it("handles keyboard navigation - Enter key triggers handleStart", () => {
    render(<Screen1Intro />);
    const button = screen.getByTestId("start-button");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(mockNavigateToScreen).toHaveBeenCalledTimes(1);
    expect(mockNavigateToScreen).toHaveBeenCalledWith(2);
  });

  it("handles keyboard navigation - Space key triggers handleStart", () => {
    render(<Screen1Intro />);
    const button = screen.getByTestId("start-button");
    fireEvent.keyDown(button, { key: " " });
    expect(mockNavigateToScreen).toHaveBeenCalledTimes(1);
    expect(mockNavigateToScreen).toHaveBeenCalledWith(2);
  });

  it("does not trigger on other keys", () => {
    render(<Screen1Intro />);
    const button = screen.getByTestId("start-button");
    fireEvent.keyDown(button, { key: "Tab" });
    expect(mockNavigateToScreen).not.toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<Screen1Intro />);
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
    expect(main.getAttribute("aria-labelledby")).toBe("landing-title");
  });

  it("renders with landing-screen class", () => {
    render(<Screen1Intro />);
    const container = document.querySelector(".landing-screen");
    expect(container).toBeDefined();
  });
});
