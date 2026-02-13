import { useMemo } from "react";

/** The full 8-digit safe code */
const FULL_CODE = "83924980";

/** Total number of puzzles that reveal digits (screens 3-10 have puzzles 1-8) */
const TOTAL_PUZZLES = 8;

interface ProgressCodeProps {
  screenNumber: number;
  /** When true, show one additional digit for the just-completed puzzle */
  puzzleJustCompleted?: boolean;
}

/**
 * Displays the progressive safe code based on current screen.
 *
 * The full code is "83924980" (8 individual digits).
 * Each completed puzzle reveals exactly ONE digit of the code.
 *
 * Puzzle completion mapping (8 digits, 8 puzzles):
 * - Screen 3 (start): "________" (0 digits, puzzle not yet complete)
 * - Screen 4 (after puzzle 1): "8_______" (1 digit)
 * - Screen 5 (after puzzle 2): "83______" (2 digits)
 * - Screen 6 (after puzzle 3): "839_____" (3 digits)
 * - Screen 7 (after puzzle 4): "8392____" (4 digits)
 * - Screen 8 (after puzzle 5): "83924___" (5 digits)
 * - Screen 9 (after puzzle 6): "839249__" (6 digits)
 * - Screen 10 (after puzzle 7): "8392498_" (7 digits)
 * - Screen 11 (after puzzle 8): "83924980" (all 8 digits)
 */
export function ProgressCode({
  screenNumber,
  puzzleJustCompleted = false,
}: ProgressCodeProps) {
  // Calculate how many digits to reveal based on completed puzzles
  // Screen 3 = 0 puzzles complete = 0 digits
  // Screen 4 = 1 puzzle complete = 1 digit
  // Screen 11 = 8 puzzles complete = 8 digits
  const basePuzzlesCompleted = Math.max(0, screenNumber - 3);

  // Add one more digit if current puzzle was just completed
  const puzzlesCompleted = puzzleJustCompleted
    ? Math.min(basePuzzlesCompleted + 1, TOTAL_PUZZLES)
    : basePuzzlesCompleted;

  // Map puzzles to digits: 8 puzzles reveal 8 digits (1:1 mapping)
  const digitsToReveal = useMemo(() => {
    return Math.min(puzzlesCompleted, FULL_CODE.length);
  }, [puzzlesCompleted]);

  // Format the code with spaces every 2 digits for readability
  const displayCode = useMemo(() => {
    const revealed = FULL_CODE.slice(0, digitsToReveal);
    const hidden = "_".repeat(FULL_CODE.length - digitsToReveal);
    const fullDisplay = revealed + hidden;

    // Split into groups of 2 for display: "83 92 49 80"
    return fullDisplay.match(/.{1,2}/g)?.join(" ") || "__ __ __ __";
  }, [digitsToReveal]);

  // Apply puzzle-complete class for green fade animation when puzzle is just completed
  const className = `progress-code${puzzleJustCompleted ? " puzzle-complete" : ""}`;

  return (
    <div className={className} data-testid="progress-code">
      <span className="code-label">Kluis code: </span>
      <span className="code-display">
        {displayCode.split("").map((char, index) => {
          // Skip spaces for styling
          if (char === " ") return <span key={index}> </span>;

          const isRevealed = char !== "_";
          return (
            <span key={index} className={isRevealed ? "revealed" : "hidden"}>
              {char}
            </span>
          );
        })}
      </span>
      <span className="digits-count">
        {digitsToReveal > 0
          ? `${digitsToReveal}/${FULL_CODE.length} cijfers hersteld`
          : "Diagnostiseer systemen om Klaassandra haar geheugen te helpen herstellen"}
      </span>
    </div>
  );
}
