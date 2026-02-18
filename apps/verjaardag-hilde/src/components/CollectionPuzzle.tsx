import { useCollectionProgress } from "../hooks/useHaEntity";
import { ProgressCode } from "./ProgressCode";

interface CollectionItem {
  /** Entity ID for the item (input_boolean) */
  entityId: string;
  /** Display label for the item */
  label: string;
  /** Optional description/hint */
  description?: string;
}

interface CollectionPuzzleProps {
  /** Screen number for the progress code display */
  screenNumber: number;
  /** Puzzle number (1-8) */
  puzzleNumber: number;
  /** Title of the puzzle */
  title: string;
  /** Description/instructions for the puzzle */
  description: string;
  /** Items to collect (each is an input_boolean entity) */
  items: CollectionItem[];
  /** Whether to show labels even when items are not collected (default: false) */
  showLabelsWhenPending?: boolean;
}

/**
 * CollectionPuzzle component for puzzles where multiple items must be collected/activated.
 *
 * Used for:
 * - Puzzle 3 (Buttons): Activate 5 switches in correct combination
 * - Puzzle 4 (Lights): Turn on 3 specific colored lights
 * - Puzzle 6 (Power): Reach power usage threshold
 * - Puzzle 7 (Temperature): Set 5 thermostats to correct temperatures
 *
 * Each item is tracked by an input_boolean in Home Assistant.
 * When all items are "on", the puzzle is complete.
 */
export function CollectionPuzzle({
  screenNumber,
  puzzleNumber: _puzzleNumber,
  title,
  description,
  items,
  showLabelsWhenPending = false,
}: CollectionPuzzleProps) {
  // Note: _puzzleNumber is part of the interface for documentation but not used in rendering
  const entityIds = items.map((item) => item.entityId);
  const {
    items: itemResults,
    completedCount,
    totalCount,
    progress,
    isComplete,
    isLoading,
    hasNotFoundEntities,
  } = useCollectionProgress(entityIds);

  if (isLoading) {
    return (
      <div className="puzzle-loading" data-testid="puzzle-loading">
        <p>Puzzel laden...</p>
      </div>
    );
  }

  // Show warning if entities were not found (but still render the puzzle)
  const showEntityWarning = hasNotFoundEntities;

  return (
    <div className="collection-puzzle" data-testid="collection-puzzle">
      <div className="puzzle-header">
        <h2>{title}</h2>
        <p className="puzzle-description">{description}</p>
      </div>

      {showEntityWarning && (
        <div className="puzzle-warning" data-testid="puzzle-warning">
          <p>
            ⚠️ Sommige Home Assistant entiteiten zijn niet gevonden. De puzzel
            wordt getoond met standaardwaarden.
          </p>
        </div>
      )}

      <div className="puzzle-progress-bar">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="progress-text">
          {completedCount} van {totalCount} gevonden
        </span>
      </div>

      <div className="collection-items">
        {items.map((item, index) => {
          const isCollected = itemResults[index]?.completed ?? false;
          return (
            <div
              key={item.entityId}
              className={`collection-item ${isCollected ? "collected" : "pending"}`}
            >
              <span
                className={`collection-icon ${isCollected ? "found" : "hidden"}`}
              >
                {isCollected ? "✓" : "?"}
              </span>
              <div className="collection-item-content">
                <span className="item-label">
                  {isCollected || showLabelsWhenPending ? item.label : "???"}
                </span>
                {item.description && isCollected && (
                  <span className="item-description">{item.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ProgressCode
        screenNumber={screenNumber}
        puzzleJustCompleted={isComplete}
      />
    </div>
  );
}
