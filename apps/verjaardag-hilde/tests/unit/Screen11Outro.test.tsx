import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

// Mock framer-motion (not used but may be imported transitively)
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({
    children,
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

import { Screen11Outro } from "../../src/screens/Screen11Outro";

describe("Screen11Outro - Video-Only Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("immediately shows video player (no celebration screen)", () => {
    render(<Screen11Outro />);
    expect(screen.getByTestId("outro-video-container")).toBeDefined();
    expect(screen.getByTestId("mock-react-player")).toBeDefined();
  });

  it("does not show congratulations or celebration content", () => {
    render(<Screen11Outro />);
    expect(screen.queryByText("Gefeliciteerd!")).toBeNull();
    expect(screen.queryByTestId("congratulations-title")).toBeNull();
    expect(screen.queryByTestId("watch-video-button")).toBeNull();
  });

  it("shows ProgressCode component with full code", () => {
    render(<Screen11Outro />);
    // ProgressCode shows "Kluis code:" label
    expect(screen.getByText("Kluis code:")).toBeDefined();
  });

  it("ProgressCode has puzzle-complete class for green fade effect", () => {
    render(<Screen11Outro />);
    const progressCode = screen.getByTestId("progress-code");
    expect(progressCode.classList.contains("puzzle-complete")).toBe(true);
  });

  it("configures ReactPlayer with correct video URL", () => {
    render(<Screen11Outro />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-url")).toBe(
      "/videos/verjaardag_hilde_outro.mp4"
    );
  });

  it("configures ReactPlayer with autoplay (playing=true)", () => {
    render(<Screen11Outro />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playing")).toBe("true");
  });

  it("configures ReactPlayer with muted for browser autoplay compliance", () => {
    render(<Screen11Outro />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-muted")).toBe("true");
  });

  it("configures ReactPlayer with controls enabled", () => {
    render(<Screen11Outro />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-controls")).toBe("true");
  });

  it("configures ReactPlayer with preload=auto", () => {
    render(<Screen11Outro />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-preload")).toBe("auto");
  });

  it("configures ReactPlayer with playsInline=true", () => {
    render(<Screen11Outro />);
    const player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playsinline")).toBe("true");
  });

  it("stops video playing state when video ends", () => {
    render(<Screen11Outro />);

    // Initially playing
    let player = screen.getByTestId("mock-react-player");
    expect(player.getAttribute("data-playing")).toBe("true");

    // Simulate video ending
    act(() => {
      mockOnEnded();
    });

    // After video ends, playing should be false
    // Note: We need to check the data attribute that was captured at render time
    // The mock captures the playing state when the component renders
    player = screen.getByTestId("mock-react-player");
    // The component should have updated its state
    expect(player.getAttribute("data-playing")).toBe("false");
  });
});
