import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({
    children,
    mode,
  }: {
    children: React.ReactNode;
    mode?: string;
  }) => <>{children}</>,
}));

// Mock ReactPlayer
const mockOnEnded = vi.fn();

vi.mock("react-player", () => ({
  default: ({
    onEnded,
    onError,
    playing,
    muted,
    controls,
    url,
    config,
  }: {
    onEnded?: () => void;
    onError?: (error: unknown) => void;
    playing?: boolean;
    muted?: boolean;
    controls?: boolean;
    url?: string;
    config?: { file?: { attributes?: Record<string, unknown> } };
  }) => {
    mockOnEnded.mockImplementation(onEnded);
    return (
      <div
        data-testid="mock-react-player"
        data-url={url}
        data-playing={playing}
        data-muted={muted}
        data-controls={controls}
        data-preload={config?.file?.attributes?.preload}
        data-playsinline={config?.file?.attributes?.playsInline}
      >
        MockReactPlayer
      </div>
    );
  },
}));

// Mock useHaService hook
const mockResetGame = vi.fn();

vi.mock("../../src/hooks/useHaService", () => ({
  useHaService: () => ({
    resetGame: mockResetGame,
  }),
}));

import { Screen11Outro } from "../../src/screens/Screen11Outro";

describe("Screen11Outro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders the outro screen container", () => {
    render(<Screen11Outro />);
    expect(screen.getByTestId("screen-11-outro")).toBeDefined();
  });

  it("has correct accessibility attributes", () => {
    render(<Screen11Outro />);
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
    expect(main.getAttribute("aria-label")).toBe("Outro scherm");
  });

  it("initially shows congratulations screen, not video", () => {
    render(<Screen11Outro />);
    expect(screen.getByTestId("congratulations-title")).toBeDefined();
    expect(screen.getByText("Gefeliciteerd!")).toBeDefined();
    expect(screen.queryByTestId("mock-react-player")).toBeNull();
  });

  it("shows the complete code on congratulations screen", () => {
    render(<Screen11Outro />);
    const codeDisplay = screen.getByTestId("final-code");
    expect(codeDisplay).toBeDefined();
    // Code segments: 83, 92, 49, 80
    expect(screen.getByText("83")).toBeDefined();
    expect(screen.getByText("92")).toBeDefined();
    expect(screen.getByText("49")).toBeDefined();
    expect(screen.getByText("80")).toBeDefined();
  });

  it("shows watch video button with correct aria-label", () => {
    render(<Screen11Outro />);
    const button = screen.getByTestId("watch-video-button");
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-label")).toBe(
      "Bekijk de felicitatievideo"
    );
  });

  it("switches to video when watch video button is clicked", () => {
    render(<Screen11Outro />);
    const button = screen.getByTestId("watch-video-button");
    fireEvent.click(button);

    expect(screen.getByTestId("outro-video-container")).toBeDefined();
    expect(screen.getByTestId("mock-react-player")).toBeDefined();
    expect(screen.queryByTestId("congratulations-title")).toBeNull();
  });

  it("configures ReactPlayer with correct video URL", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-url")).toBe(
      "/videos/verjaardag_hilde_outro.mp4"
    );
  });

  it("configures ReactPlayer with autoplay (playing=true)", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playing")).toBe("true");
  });

  it("configures ReactPlayer with muted for browser autoplay compliance", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-muted")).toBe("true");
  });

  it("configures ReactPlayer with controls enabled", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-controls")).toBe("true");
  });

  it("configures ReactPlayer with preload=auto", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-preload")).toBe("auto");
  });

  it("configures ReactPlayer with playsInline=true", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playsinline")).toBe("true");
  });

  it("shows video ended actions after video ends", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    act(() => {
      mockOnEnded();
    });

    expect(screen.getByTestId("video-ended-actions")).toBeDefined();
  });

  it("shows final code reminder after video ends", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    act(() => {
      mockOnEnded();
    });

    expect(screen.getByText(/De code voor de schatkist:/)).toBeDefined();
    expect(screen.getByText("83 92 49 80")).toBeDefined();
  });

  it("shows play again button after video ends", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    act(() => {
      mockOnEnded();
    });

    const playAgainButton = screen.getByTestId("play-again-button");
    expect(playAgainButton).toBeDefined();
    expect(playAgainButton.getAttribute("aria-label")).toBe("Opnieuw spelen");
  });

  it("calls resetGame when play again is confirmed", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    act(() => {
      mockOnEnded();
    });

    const playAgainButton = screen.getByTestId("play-again-button");
    fireEvent.click(playAgainButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Weet je zeker dat je opnieuw wilt spelen?"
    );
    expect(mockResetGame).toHaveBeenCalled();
  });

  it("does not call resetGame when play again is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    act(() => {
      mockOnEnded();
    });

    const playAgainButton = screen.getByTestId("play-again-button");
    fireEvent.click(playAgainButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockResetGame).not.toHaveBeenCalled();
  });

  it("shows ProgressCode component after video ends", () => {
    render(<Screen11Outro />);
    fireEvent.click(screen.getByTestId("watch-video-button"));

    act(() => {
      mockOnEnded();
    });

    // ProgressCode shows "Kluis code:" label
    expect(screen.getByText("Kluis code:")).toBeDefined();
  });
});
