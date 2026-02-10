import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressCode } from "../../src/components/ProgressCode";

describe("ProgressCode", () => {
  it("shows no digits on screen 3", () => {
    render(<ProgressCode screenNumber={3} />);

    // All segments should be hidden
    const hiddenSegments = screen.getAllByText("__");
    expect(hiddenSegments.length).toBe(4);
  });

  it("shows first segment on screen 4", () => {
    render(<ProgressCode screenNumber={4} />);

    expect(screen.getByText("83")).toBeDefined();
    const hiddenSegments = screen.getAllByText("__");
    expect(hiddenSegments.length).toBe(3);
  });

  it("shows two segments on screen 5", () => {
    render(<ProgressCode screenNumber={5} />);

    expect(screen.getByText("83")).toBeDefined();
    expect(screen.getByText("92")).toBeDefined();
    const hiddenSegments = screen.getAllByText("__");
    expect(hiddenSegments.length).toBe(2);
  });

  it("shows three segments on screen 6", () => {
    render(<ProgressCode screenNumber={6} />);

    expect(screen.getByText("83")).toBeDefined();
    expect(screen.getByText("92")).toBeDefined();
    expect(screen.getByText("49")).toBeDefined();
    const hiddenSegments = screen.getAllByText("__");
    expect(hiddenSegments.length).toBe(1);
  });

  it("shows all segments on screen 7 and above", () => {
    render(<ProgressCode screenNumber={7} />);

    expect(screen.getByText("83")).toBeDefined();
    expect(screen.getByText("92")).toBeDefined();
    expect(screen.getByText("49")).toBeDefined();
    expect(screen.getByText("80")).toBeDefined();
    expect(screen.queryAllByText("__").length).toBe(0);
  });

  it("shows all segments on screen 10", () => {
    render(<ProgressCode screenNumber={10} />);

    expect(screen.getByText("83")).toBeDefined();
    expect(screen.getByText("92")).toBeDefined();
    expect(screen.getByText("49")).toBeDefined();
    expect(screen.getByText("80")).toBeDefined();
  });
});
