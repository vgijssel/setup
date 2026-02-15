import { useState, useCallback, useRef, useEffect } from "react";
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
 *
 * 2026 best practices:
 * - muted + playsInline for reliable autoplay across browsers
 * - progressInterval={50} for precise timestamp detection
 * - useCallback for performance optimization
 */

/** Trigger configuration type */
type TriggerCall = {
  service: string;
  target: string | string[];
};

/** Timestamp triggers in seconds with their HA service calls */
const TIMESTAMP_TRIGGERS: Record<number, TriggerCall | TriggerCall[]> = {
  20: [
    {
      service: "light.turn_off",
      target: [
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
    },
    {
      service: "switch.turn_off",
      target: [
        "switch.driveway_shelly",
        "switch.laundry_room_shelly",
        "switch.supply_closet_shelly",
        "switch.garden_shelly",
      ],
    },
  ],
  28: [
    {
      service: "light.turn_on",
      target: [
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
    },
    {
      service: "switch.turn_on",
      target: [
        "switch.driveway_shelly",
        "switch.laundry_room_shelly",
        "switch.supply_closet_shelly",
        "switch.garden_shelly",
      ],
    },
  ],
};

export function Screen2Video() {
  const { navigateToScreen, callService } = useHaService();
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Track which triggers have already fired to prevent duplicate calls
  const triggeredTimestamps = useRef<Set<number>>(new Set());

  // Reset triggers on mount (useful for replays)
  useEffect(() => {
    triggeredTimestamps.current.clear();
  }, []);

  const handlePlayClick = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setHasEnded(true);
    setIsPlaying(false);
    // Auto-advance after video ends
    navigateToScreen(3);
  }, [navigateToScreen]);

  const handleProgress = useCallback(
    (state: { playedSeconds: number; played: number }) => {
      setProgress(Math.round(state.played * 100));

      // Check for timestamp triggers with 0.5s tolerance window
      Object.entries(TIMESTAMP_TRIGGERS).forEach(
        ([timeStr, triggerOrArray]) => {
          const targetTime = parseInt(timeStr, 10);
          const timeDiff = Math.abs(state.playedSeconds - targetTime);

          // Only trigger if within tolerance and not already triggered
          if (timeDiff < 0.5 && !triggeredTimestamps.current.has(targetTime)) {
            triggeredTimestamps.current.add(targetTime);

            // Support both single triggers and arrays of triggers
            const triggers = Array.isArray(triggerOrArray)
              ? triggerOrArray
              : [triggerOrArray];
            triggers.forEach((trigger) => {
              callService(trigger.service, { entity_id: trigger.target });
            });
          }
        }
      );
    },
    [callService]
  );

  const handleError = useCallback((error: unknown) => {
    console.error("Video playback error:", error);
  }, []);

  return (
    <div
      className="screen screen-2-video"
      role="main"
      aria-label="Introductie video"
    >
      <div className="video-container" data-testid="video-container">
        <ReactPlayer
          url="/videos/verjaardag_hilde_intro.mp4"
          playing={isPlaying}
          muted={false}
          controls={false}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          onProgress={handleProgress}
          onError={handleError}
          progressInterval={50}
          data-testid="intro-video"
          config={{
            file: {
              attributes: {
                playsInline: true,
                preload: "auto",
                "data-testid": "intro-video-element",
                "data-playing": isPlaying ? "true" : "false",
              },
            },
          }}
        />

        {/* Play button overlay - shown before video starts */}
        {!hasStarted && (
          <div className="video-play-overlay" onClick={handlePlayClick}>
            <button className="video-play-button" aria-label="Start video">
              ▶
            </button>
          </div>
        )}

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
