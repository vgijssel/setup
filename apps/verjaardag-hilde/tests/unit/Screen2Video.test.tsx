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

  it("configures ReactPlayer with autoplay (playing=true)", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playing")).toBe("true");
  });

  it("configures ReactPlayer with muted for browser autoplay compliance", () => {
    render(<Screen2Video />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-muted")).toBe("true");
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

  it("triggers HA service at 120s timestamp (2 min)", () => {
    render(<Screen2Video />);

    // Simulate progress at exactly 120 seconds
    act(() => {
      mockOnProgress({ playedSeconds: 120, played: 0.2 });
    });

    expect(mockCallService).toHaveBeenCalledWith("input_boolean.turn_on", {
      entity_id: "input_boolean.verjaardag_hilde_video_trigger_1",
    });
  });

  it("triggers HA service at 240s timestamp (4 min)", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnProgress({ playedSeconds: 240, played: 0.4 });
    });

    expect(mockCallService).toHaveBeenCalledWith("input_boolean.turn_on", {
      entity_id: "input_boolean.verjaardag_hilde_video_trigger_2",
    });
  });

  it("triggers HA service at 360s timestamp (6 min)", () => {
    render(<Screen2Video />);

    act(() => {
      mockOnProgress({ playedSeconds: 360, played: 0.6 });
    });

    expect(mockCallService).toHaveBeenCalledWith("input_boolean.turn_on", {
      entity_id: "input_boolean.verjaardag_hilde_video_trigger_3",
    });
  });

  it("uses 0.5s tolerance for timestamp triggers", () => {
    render(<Screen2Video />);

    // Test trigger at 119.6s (within 0.5s tolerance of 120)
    act(() => {
      mockOnProgress({ playedSeconds: 119.6, played: 0.199 });
    });

    expect(mockCallService).toHaveBeenCalledWith("input_boolean.turn_on", {
      entity_id: "input_boolean.verjaardag_hilde_video_trigger_1",
    });
  });

  it("does not trigger service outside tolerance window", () => {
    render(<Screen2Video />);

    // Test at 119.4s (outside 0.5s tolerance)
    act(() => {
      mockOnProgress({ playedSeconds: 119.4, played: 0.199 });
    });

    expect(mockCallService).not.toHaveBeenCalled();
  });

  it("does not trigger same timestamp twice", () => {
    render(<Screen2Video />);

    // First trigger
    act(() => {
      mockOnProgress({ playedSeconds: 120, played: 0.2 });
    });

    // Second pass through same timestamp
    act(() => {
      mockOnProgress({ playedSeconds: 120.3, played: 0.2 });
    });

    // Should only be called once
    expect(mockCallService).toHaveBeenCalledTimes(1);
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
