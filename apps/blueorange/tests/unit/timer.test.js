import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Timer } from "../../src/scripts/timer.js";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return correct time remaining for 1 hour future", () => {
    const now = new Date("2025-10-08T12:00:00Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-10-08T13:00:00Z");
    const timer = new Timer(targetDate);

    const time = timer.getTimeRemaining();
    expect(time.days).toBe(0);
    expect(time.hours).toBe(1);
    expect(time.minutes).toBe(0);
    expect(time.seconds).toBe(0);
  });

  it("should return zeros for past target date", () => {
    const now = new Date("2025-10-08T12:00:00Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2020-01-01T00:00:00Z");
    const timer = new Timer(targetDate);

    const time = timer.getTimeRemaining();
    expect(time.days).toBe(0);
    expect(time.hours).toBe(0);
    expect(time.minutes).toBe(0);
    expect(time.seconds).toBe(0);
    expect(time.total).toBe(0);
  });

  it("should call callback every 1000ms when started", () => {
    const now = new Date("2025-10-08T12:00:00Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-10-08T13:00:00Z");
    const timer = new Timer(targetDate);
    const callback = vi.fn();

    timer.start(callback);

    // Initial call
    expect(callback).toHaveBeenCalledTimes(1);

    // After 1 second
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    // After 2 more seconds
    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(4);

    timer.stop();
  });

  it("should stop calling callback after stop is called", () => {
    const now = new Date("2025-10-08T12:00:00Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-10-08T13:00:00Z");
    const timer = new Timer(targetDate);
    const callback = vi.fn();

    timer.start(callback);
    vi.advanceTimersByTime(2000);

    timer.stop();
    const callCountAfterStop = callback.mock.calls.length;

    vi.advanceTimersByTime(3000);
    expect(callback.mock.calls.length).toBe(callCountAfterStop);
  });

  it("should zero-pad single digit seconds", () => {
    const now = new Date("2025-10-08T12:00:00Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-10-08T12:00:09Z");
    const timer = new Timer(targetDate);

    const time = timer.getTimeRemaining();
    expect(time.seconds).toBe(9);
  });

  it("should handle days exceeding 99", () => {
    const now = new Date("2025-01-01T00:00:00Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-11-20T00:00:00Z");
    const timer = new Timer(targetDate);

    const time = timer.getTimeRemaining();
    expect(time.days).toBeGreaterThan(99);
  });

  it("should correctly handle minute boundary crossing", () => {
    const now = new Date("2025-10-08T12:00:59Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-10-08T13:00:00Z");
    const timer = new Timer(targetDate);

    let time = timer.getTimeRemaining();
    expect(time.minutes).toBe(59);
    expect(time.seconds).toBe(1);

    // Advance 2 seconds
    vi.setSystemTime(new Date("2025-10-08T12:01:01Z"));
    time = timer.getTimeRemaining();
    expect(time.minutes).toBe(58);
    expect(time.seconds).toBe(59);
  });

  it("should correctly handle hour boundary crossing", () => {
    const now = new Date("2025-10-08T11:59:59Z");
    vi.setSystemTime(now);

    const targetDate = new Date("2025-10-08T13:00:00Z");
    const timer = new Timer(targetDate);

    let time = timer.getTimeRemaining();
    expect(time.hours).toBe(1);
    expect(time.minutes).toBe(0);
    expect(time.seconds).toBe(1);

    // Advance 2 seconds
    vi.setSystemTime(new Date("2025-10-08T12:00:01Z"));
    time = timer.getTimeRemaining();
    expect(time.hours).toBe(0);
    expect(time.minutes).toBe(59);
    expect(time.seconds).toBe(59);
  });
});
