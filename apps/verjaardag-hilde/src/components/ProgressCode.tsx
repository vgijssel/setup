import { useMemo } from "react";

/** The full 8-digit safe code */
const FULL_CODE = "83924980";

/** Total number of puzzles that reveal digits (screens 3-9 have puzzles) */
const TOTAL_PUZZLES = 7;

interface ProgressCodeProps {
  screenNumber: number;
}

/**
 * Displays the progressive safe code based on current screen.
 *
 * The full code is "83924980" (8 individual digits).
 * Each completed puzzle reveals exactly ONE digit of the code.
 *
 * Puzzle completion mapping (8 digits, 7 puzzles):
 * - Screen 3 (start): "________" (0 digits, puzzle not yet complete)
 * - Screen 4 (after puzzle 1): "8_______" (1 digit)
 * - Screen 5 (after puzzle 2): "83______" (2 digits)
 * - Screen 6 (after puzzle 3): "839_____" (3 digits)
 * - Screen 7 (after puzzle 4): "8392____" (4 digits)
 * - Screen 8 (after puzzle 5): "83924___" (5 digits)
 * - Screen 9 (after puzzle 6): "839249__" (6 digits)
 * - Screen 10 (after puzzle 7): "83924980" (all 8 digits)
 *
 * Note: 8 digits / 7 puzzles means puzzle 7 reveals 2 digits at once.
 */
export function ProgressCode({ screenNumber }: ProgressCodeProps) {
  // Calculate how many digits to reveal based on completed puzzles
  // Screen 3 = 0 puzzles complete = 0 digits
  // Screen 4 = 1 puzzle complete = 1 digit
  // Screen 10 = 7 puzzles complete = 8 digits
  const puzzlesCompleted = Math.max(0, screenNumber - 3);

  // Map puzzles to digits: 7 puzzles reveal 8 digits (last puzzle reveals 2)
  const digitsToReveal = useMemo(() => {
    if (puzzlesCompleted >= TOTAL_PUZZLES) return FULL_CODE.length;
    // Each puzzle reveals 1 digit, except puzzle 7 reveals 2
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

  return (
    <div className="progress-code">
      <span className="code-label">Code: </span>
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
          ? `${digitsToReveal}/${FULL_CODE.length} cijfers onthuld`
          : "Los puzzels op om de code te onthullen"}
      </span>
    </div>
  );
}
