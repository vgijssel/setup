import { useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { ProgressCode } from "../components/ProgressCode";

/**
 * Screen 11: Outro screen with video-only layout.
 *
 * This is the final screen of the escape room.
 * Shows:
 * - Full-screen outro video (autoplay, muted for browser compliance)
 * - ProgressCode component showing the complete vault code
 *
 * Layout matches Screen2Video for consistency:
 * - Video player centered with max-width
 * - ProgressCode below the video
 *
 * 2026 best practices:
 * - muted + playsInline for reliable autoplay across browsers
 * - useCallback for performance optimization
 */
export function Screen11Outro() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const handleVideoEnd = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  const handleVideoError = useCallback((error: unknown) => {
    console.error("Outro video playback error:", error);
  }, []);

  return (
    <div
      className="screen screen-11-outro"
      role="main"
      aria-label="Outro scherm"
      data-testid="screen-11-outro"
    >
      <div className="video-container" data-testid="outro-video-container">
        <ReactPlayer
          url="/videos/verjaardag_hilde_outro.mp4"
          playing={isVideoPlaying}
          muted={true}
          controls={true}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          data-testid="outro-video"
          config={{
            file: {
              attributes: {
                playsInline: true,
                preload: "auto",
                "data-testid": "outro-video-element",
                "data-playing": isVideoPlaying ? "true" : "false",
              },
            },
          }}
        />
      </div>

      <ProgressCode screenNumber={11} puzzleJustCompleted={true} />
    </div>
  );
}
