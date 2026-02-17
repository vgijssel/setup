import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

// Mock ReactPlayer
const mockOnProgress = vi.fn();
const mockOnEnded = vi.fn();

vi.mock("react-player", () => ({
  default: ({
    onProgress,
    onEnded,
    onError,
    playing,
    muted,
    url,
    config,
  }: {
    onProgress?: (state: { playedSeconds: number; played: number }) => void;
    onEnded?: () => void;
    onError?: (error: unknown) => void;
    playing?: boolean;
    muted?: boolean;
    url?: string;
    config?: { file?: { attributes?: Record<string, unknown> } };
  }) => {
    // Store callbacks for test access
    mockOnProgress.mockImplementation(onProgress);
    mockOnEnded.mockImplementation(onEnded);
    return (
      <div
        data-testid="mock-react-player"
        data-url={url}
        data-playing={playing}
        data-muted={muted}
        data-preload={config?.file?.attributes?.preload}
        data-playsinline={config?.file?.attributes?.playsInline}
      >
        MockReactPlayer
      </div>
    );
  },
}));

// Mock useHaService hook
const mockNavigateToScreen = vi.fn();
const mockCallService = vi.fn();

vi.mock("../../src/hooks/useHaService", () => ({
  useHaService: () => ({
    navigateToScreen: mockNavigateToScreen,
    callService: mockCallService,
  }),
}));

import { Screen2Video } from "../../src/screens/Screen2Video";

describe("Screen2Video", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the video container", () => {
    render(<Screen2Video />);
    expect(screen.getByTestId("video-container")).toBeDefined();
    expect(screen.getByTestId("mock-react-player")).toBeDefined();
  });

  it("configures ReactPlayer with correct video URL", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-url")).toBe(
      "/videos/verjaardag_hilde_intro.mp4"
    );
  });

  it("configures ReactPlayer with playing=false initially (requires play button click)", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playing")).toBe("false");
  });

  it("configures ReactPlayer with muted=false", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-muted")).toBe("false");
  });

  it("configures ReactPlayer with preload=auto", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-preload")).toBe("auto");
  });

  it("configures ReactPlayer with playsInline=true", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playsinline")).toBe("true");
  });

  it("triggers light.turn_off at 20s timestamp", () => {
    render(<Screen2Video />);

    // Simulate progress at exactly 20 seconds
    act(() => {
      mockOnProgress({ playedSeconds: 20, played: 0.02 });
    });

    expect(mockCallService).toHaveBeenCalledWith("light.turn_off", {
      entity_id: [
        "light.living_room_lights",
        "light.kitchen_lights",
        "light.hallway_lights",
        "light.landing_lights",
        "light.bathroom_lights",
        "light.toilet_lights",
        "light.bedroom_light",
        "light.office_light",
        "light.baby_room_light",
      ],
      transition: 0,
    });
  });

  it("triggers switch.turn_off at 20s timestamp", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnProgress({ playedSeconds: 20, played: 0.02 });
    });

    expect(mockCallService).toHaveBeenCalledWith("switch.turn_off", {
      entity_id: [
        "switch.driveway_shelly",
        "switch.laundry_room_shelly",
        "switch.supply_closet_shelly",
        "switch.garden_shelly",
      ],
    });
  });

  it("triggers light.turn_on at 28s timestamp", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnProgress({ playedSeconds: 28, played: 0.028 });
    });

    expect(mockCallService).toHaveBeenCalledWith("light.turn_on", {
      entity_id: [
        "light.living_room_lights",
        "light.kitchen_lights",
        "light.hallway_lights",
        "light.landing_lights",
        "light.bathroom_lights",
        "light.toilet_lights",
        "light.bedroom_light",
        "light.office_light",
        "light.baby_room_light",
      ],
    });
  });

  it("triggers switch.turn_on at 28s timestamp", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnProgress({ playedSeconds: 28, played: 0.028 });
    });

    expect(mockCallService).toHaveBeenCalledWith("switch.turn_on", {
      entity_id: [
        "switch.driveway_shelly",
        "switch.laundry_room_shelly",
        "switch.supply_closet_shelly",
        "switch.garden_shelly",
      ],
    });
  });

  it("uses 0.5s tolerance for timestamp triggers", () => {
    render(<Screen2Video />);

    // Test trigger at 19.6s (within 0.5s tolerance of 20)
    act(() => {
      mockOnProgress({ playedSeconds: 19.6, played: 0.0196 });
    });

    // Should trigger both light and switch services (2 calls total at 20s)
    expect(mockCallService).toHaveBeenCalledTimes(2);
    expect(mockCallService).toHaveBeenCalledWith("light.turn_off", expect.any(Object));
    expect(mockCallService).toHaveBeenCalledWith("switch.turn_off", expect.any(Object));
  });

  it("does not trigger service outside tolerance window", () => {
    render(<Screen2Video />);

    // Test at 19.4s (outside 0.5s tolerance of 20s)
    act(() => {
      mockOnProgress({ playedSeconds: 19.4, played: 0.0194 });
    });

    expect(mockCallService).not.toHaveBeenCalled();
  });

  it("does not trigger same timestamp twice", () => {
    render(<Screen2Video />);

    // First trigger at 20s
    act(() => {
      mockOnProgress({ playedSeconds: 20, played: 0.02 });
    });

    // Second pass through same timestamp
    act(() => {
      mockOnProgress({ playedSeconds: 20.3, played: 0.0203 });
    });

    // Should only be called twice (once for light, once for switch at 20s)
    // Not 4 times (which would indicate duplicate triggers)
    expect(mockCallService).toHaveBeenCalledTimes(2);
  });

  it("navigates to screen 3 when video ends", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnEnded();
    });

    expect(mockNavigateToScreen).toHaveBeenCalledWith(3);
  });

  it("shows video ended overlay after video ends", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnEnded();
    });

    expect(screen.getByText("Video afgelopen")).toBeDefined();
    expect(screen.getByText("Ga door naar de puzzels...")).toBeDefined();
  });

  it("has correct accessibility attributes", () => {
    render(<Screen2Video />);
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
    expect(main.getAttribute("aria-label")).toBe("Introductie video");
  });
});
