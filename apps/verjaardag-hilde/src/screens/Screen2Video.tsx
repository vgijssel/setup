import { useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { useHaService } from "../hooks/useHaService";

/**
 * Screen 2: Introduction video screen.
 *
 * Plays the intro video. When the video ends (or user skips), advances to screen 3.
 * The video should explain the escape room concept and set the mood.
 *
 * Note: The video file should be placed in public/videos/verjaardag_hilde_intro.mp4
 * Video is gitignored due to size constraints.
 */
export function Screen2Video() {
  const { navigateToScreen } = useHaService();
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoEnd = useCallback(() => {
    setHasEnded(true);
    setIsPlaying(false);
    // Auto-advance after video ends
    navigateToScreen(3);
  }, [navigateToScreen]);

  const handleProgress = useCallback((state: { played: number }) => {
    setProgress(Math.round(state.played * 100));
  }, []);

  const handleSkip = () => {
    navigateToScreen(3);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="screen screen-2-video">
      <div className="video-container">
        <ReactPlayer
          url="/videos/verjaardag_hilde_intro.mp4"
          playing={isPlaying}
          controls={false}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          onProgress={handleProgress}
          progressInterval={1000}
          config={{
            file: {
              attributes: {
                playsInline: true,
              },
            },
          }}
        />

        <div className="video-overlay">
          <div className="video-controls">
            <button
              className="video-control-button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pauzeer" : "Speel af"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <div className="video-progress">
              <div
                className="video-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              className="skip-button"
              onClick={handleSkip}
              aria-label="Sla video over"
            >
              Sla over →
            </button>
          </div>
        </div>

        {hasEnded && (
          <div className="video-ended-overlay">
            <h2>Klaar om te beginnen?</h2>
            <button className="continue-button" onClick={handleSkip}>
              Start de puzzels!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
