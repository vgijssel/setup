import { useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { ProgressCode } from "../components/ProgressCode";

/**
 * Screen 11: Outro screen with completion video and message.
 *
 * This is the final screen of the escape room.
 * Shows:
 * - Outro video that plays automatically (muted, with controls)
 * - Completion message thanking the player
 * - ProgressCode component showing the complete vault code
 */
export function Screen11Outro() {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error("Outro video playback error:", error);
  }, []);

  return (
    <div
      className="screen screen-11-outro"
      role="main"
      aria-label="Outro scherm"
      data-testid="screen-11-outro"
    >
      <div className="outro-message" data-testid="outro-message">
        <h1>
          Bedankt, ik ben weer helemaal hersteld! Kijk nu in de kluis voor je
          verassing!
        </h1>
      </div>

      <div
        className="outro-video-container"
        data-testid="outro-video-container"
      >
        <ReactPlayer
          url="/videos/verjaardag_hilde_outro.mp4"
          playing={isPlaying}
          muted={true}
          controls={true}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          onError={handleError}
          config={{
            file: {
              attributes: {
                playsInline: true,
                preload: "auto",
              },
            },
          }}
        />
      </div>

      <ProgressCode screenNumber={11} puzzleJustCompleted={true} />
    </div>
  );
}
