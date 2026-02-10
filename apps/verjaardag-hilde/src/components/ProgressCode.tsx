import { CODE_SEGMENTS } from "../constants/entities";

interface ProgressCodeProps {
  screenNumber: number;
}

/**
 * Displays the progressive safe code based on current screen.
 *
 * The full code is "83 92 49 80" (8 digits in 4 pairs).
 * - Screen 3 shows: "__ __ __ __" (0 digits)
 * - Screen 4 shows: "83 __ __ __" (2 digits)
 * - Screen 5 shows: "83 92 __ __" (4 digits)
 * - Screen 6 shows: "83 92 49 __" (6 digits)
 * - Screen 7-10 shows: "83 92 49 80" (all 8 digits)
 *
 * Each completed puzzle reveals one 2-digit segment.
 */
export function ProgressCode({ screenNumber }: ProgressCodeProps) {
  // Calculate how many segments to reveal
  // Screen 3 = 0 segments, Screen 4 = 1 segment, etc.
  // After screen 7, all 4 segments are revealed
  const segmentsToReveal = Math.min(
    Math.max(0, screenNumber - 3),
    CODE_SEGMENTS.length
  );

  return (
    <div className="progress-code">
      <span className="code-label">Code: </span>
      {CODE_SEGMENTS.map((segment, index) => (
        <span key={index}>
          {index < segmentsToReveal ? (
            <span className="revealed">{segment}</span>
          ) : (
            <span className="hidden">__</span>
          )}
          {index < CODE_SEGMENTS.length - 1 && " "}
        </span>
      ))}
    </div>
  );
}
