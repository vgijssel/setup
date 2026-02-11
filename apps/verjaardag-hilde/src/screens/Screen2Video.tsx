import { useState, useCallback, useRef } from "react";
import ReactPlayer from "react-player";
import { useHaService } from "../hooks/useHaService";

/**
 * Screen 2: Introduction video screen with timestamp-triggered HA service calls.
 *
 * Plays the intro video automatically and triggers Home Assistant services
 * at specific timestamps (2:00, 4:00, 6:00 minutes). When the video ends,
 * it auto-advances to screen 3.
 *
 * Navigation controls have been removed - this screen is read-only.
 * Video playback is automatic and HA-driven.
 *
 * Note: The video file should be placed in public/videos/verjaardag_hilde_intro.mp4
 * Video is gitignored due to size constraints.
 */

/** Timestamp triggers in seconds with their HA service calls */
const TIMESTAMP_TRIGGERS = {
  120: {
    service: "input_boolean.turn_on",
    target: "input_boolean.verjaardag_hilde_video_trigger_1",
  },
  240: {
    service: "input_boolean.turn_on",
    target: "input_boolean.verjaardag_hilde_video_trigger_2",
  },
  360: {
    service: "input_boolean.turn_on",
    target: "input_boolean.verjaardag_hilde_video_trigger_3",
  },
} as const;

export function Screen2Video() {
  const { navigateToScreen, callService } = useHaService();
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track which triggers have already fired to prevent duplicate calls
  const triggeredTimestamps = useRef<Set<number>>(new Set());

  const handleVideoEnd = useCallback(() => {
    setHasEnded(true);
    // Auto-advance after video ends
    navigateToScreen(3);
  }, [navigateToScreen]);

  const handleProgress = useCallback(
    (state: { playedSeconds: number; played: number }) => {
      setProgress(Math.round(state.played * 100));

      // Check for timestamp triggers with 0.5s tolerance window
      Object.entries(TIMESTAMP_TRIGGERS).forEach(([timeStr, trigger]) => {
        const targetTime = parseInt(timeStr, 10);
        const timeDiff = Math.abs(state.playedSeconds - targetTime);

        // Only trigger if within tolerance and not already triggered
        if (timeDiff < 0.5 && !triggeredTimestamps.current.has(targetTime)) {
          triggeredTimestamps.current.add(targetTime);
          callService(trigger.service, { entity_id: trigger.target });
        }
      });
    },
    [callService]
  );

  return (
    <div className="screen screen-2-video">
      <div className="video-container">
        <ReactPlayer
          url="/videos/verjaardag_hilde_intro.mp4"
          playing={true}
          controls={false}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          onProgress={handleProgress}
          progressInterval={50}
          config={{
            file: {
              attributes: {
                playsInline: true,
              },
            },
          }}
        />

        {/* Minimal progress bar overlay - no controls */}
        <div className="video-overlay">
          <div className="video-controls">
            <div className="video-progress">
              <div
                className="video-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {hasEnded && (
          <div className="video-ended-overlay">
            <h2>Video afgelopen</h2>
            <p>Ga door naar de puzzels...</p>
          </div>
        )}
      </div>
    </div>
  );
}
