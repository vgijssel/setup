import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

// Mock @hakit/core
const mockUseEntity = vi.fn();
const mockCallService = vi.fn();

vi.mock("@hakit/core", () => ({
  useEntity: (entityId: string, options?: unknown) =>
    mockUseEntity(entityId, options),
  useHass: () => ({
    callService: mockCallService,
  }),
}));

import {
  useInputSelect,
  useInputBoolean,
  useNumericSelect,
} from "../../src/hooks/useHaEntity";
import { useHaService } from "../../src/hooks/useHaService";

describe("useInputSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns default value when entity is null (loading)", () => {
    mockUseEntity.mockReturnValue(null);

    const { result } = renderHook(() => useInputSelect("input_select.test"));

    expect(result.current.value).toBe("1");
    expect(result.current.isLoading).toBe(true);
    expect(result.current.options).toEqual([]);
  });

  it("returns entity state and options when loaded", () => {
    mockUseEntity.mockReturnValue({
      state: "3",
      attributes: { options: ["1", "2", "3", "4", "5"] },
    });

    const { result } = renderHook(() => useInputSelect("input_select.test"));

    expect(result.current.value).toBe("3");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.options).toEqual(["1", "2", "3", "4", "5"]);
  });
});

describe("useInputBoolean", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when entity is off", () => {
    mockUseEntity.mockReturnValue({ state: "off" });

    const { result } = renderHook(() => useInputBoolean("input_boolean.test"));

    expect(result.current.value).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("returns true when entity is on", () => {
    mockUseEntity.mockReturnValue({ state: "on" });

    const { result } = renderHook(() => useInputBoolean("input_boolean.test"));

    expect(result.current.value).toBe(true);
  });
});

describe("useNumericSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates progress correctly", () => {
    mockUseEntity.mockReturnValue({
      state: "3",
      attributes: { options: ["0", "1", "2", "3", "4", "5"] },
    });

    const { result } = renderHook(() => useNumericSelect("input_select.test"));

    expect(result.current.value).toBe(3);
    expect(result.current.maxValue).toBe(5);
    expect(result.current.progress).toBe(0.6);
    expect(result.current.isComplete).toBe(false);
  });

  it("marks as complete when value equals max", () => {
    mockUseEntity.mockReturnValue({
      state: "5",
      attributes: { options: ["0", "1", "2", "3", "4", "5"] },
    });

    const { result } = renderHook(() => useNumericSelect("input_select.test"));

    expect(result.current.isComplete).toBe(true);
  });
});

describe("useHaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCallService.mockResolvedValue(undefined);
  });

  it("setInputSelect calls service with correct parameters", async () => {
    const { result } = renderHook(() => useHaService());

    await result.current.setInputSelect("input_select.test", "5");

    expect(mockCallService).toHaveBeenCalledWith({
      domain: "input_select",
      service: "selectOption",
      target: {
        entity_id: "input_select.test",
      },
      serviceData: {
        option: "5",
      },
    });
  });

  it("navigateToScreen calls setInputSelect with global select entity", async () => {
    const { result } = renderHook(() => useHaService());

    await result.current.navigateToScreen(3);

    expect(mockCallService).toHaveBeenCalledWith({
      domain: "input_select",
      service: "selectOption",
      target: {
        entity_id: "input_select.verjaardag_hilde_global_select",
      },
      serviceData: {
        option: "3",
      },
    });
  });

  it("navigateToScreen validates screen number bounds", async () => {
    const { result } = renderHook(() => useHaService());

    await result.current.navigateToScreen(0);
    await result.current.navigateToScreen(12);

    expect(mockCallService).not.toHaveBeenCalled();
  });

  it("resetGame triggers reset boolean", async () => {
    const { result } = renderHook(() => useHaService());

    await result.current.resetGame();

    expect(mockCallService).toHaveBeenCalledWith({
      domain: "input_boolean",
      service: "turnOn",
      target: {
        entity_id: "input_boolean.verjaardag_hilde_reset_trigger",
      },
    });
  });
});
