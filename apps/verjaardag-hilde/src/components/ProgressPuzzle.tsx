import { useNumericSelect } from "../hooks/useHaEntity";
import { ProgressCode } from "./ProgressCode";

interface ProgressPuzzleProps {
  /** The entity ID for the progress select (e.g., "input_select.verjaardag_hilde_puzzle_1_select") */
  entityId: string;
  /** Screen number for the progress code display */
  screenNumber: number;
  /** Puzzle number (1-8) */
  puzzleNumber: number;
  /** Title of the puzzle */
  title: string;
  /** Description/instructions for the puzzle */
  description: string;
  /** Items to display as progress steps */
  items: string[];
  /** When true, item labels are hidden until completed (default: false) */
  progressiveDisclosure?: boolean;
  /** Placeholder text for hidden items (default: "???") */
  hiddenPlaceholder?: string;
}

/**
 * ProgressPuzzle component for puzzles that track incremental progress.
 *
 * Used for:
 * - Puzzle 1 (Doors): Open 5 different doors
 * - Puzzle 2 (Apple TV): Answer 3 questions correctly
 * - Puzzle 5 (Lamps): Toggle 5 lamps in sequence
 * - Puzzle 8 (Audio): Enter the correct code
 *
 * The component subscribes to the progress entity and displays:
 * - Current progress (X of Y completed)
 * - Visual indicators for each step
 * - The progressive code reveal
 */
export function ProgressPuzzle({
  entityId,
  screenNumber,
  puzzleNumber,
  title,
  description,
  items,
  progressiveDisclosure = false,
  hiddenPlaceholder = "???",
}: ProgressPuzzleProps) {
  const { value, maxValue, progress, isComplete, isLoading } =
    useNumericSelect(entityId);

  if (isLoading) {
    return (
      <div className="puzzle-loading">
        <p>Puzzel laden...</p>
      </div>
    );
  }

  return (
    <div className="progress-puzzle">
      <div className="puzzle-header">
        <h2>
          Puzzel {puzzleNumber}: {title}
        </h2>
        <p className="puzzle-description">{description}</p>
      </div>

      <div className="puzzle-progress-bar">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="progress-text">
          {value} van {maxValue} voltooid
        </span>
      </div>

      <div className="puzzle-items">
        {items.map((item, index) => {
          const isCompleted = index < value;
          const displayLabel =
            progressiveDisclosure && !isCompleted ? hiddenPlaceholder : item;
          return (
            <div
              key={index}
              className={`puzzle-item ${isCompleted ? "completed" : "pending"}`}
            >
              <span className={`checkmark ${isCompleted ? "done" : "pending"}`}>
                {isCompleted ? "✓" : "○"}
              </span>
              <span
                className={`item-label ${progressiveDisclosure && !isCompleted ? "hidden-label" : ""}`}
              >
                {displayLabel}
              </span>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="puzzle-complete">
          <h3>Puzzel opgelost!</h3>
          <p>Nieuwe code cijfers ontgrendeld!</p>
        </div>
      )}

      <ProgressCode
        screenNumber={screenNumber}
        puzzleJustCompleted={isComplete}
      />
    </div>
  );
}
