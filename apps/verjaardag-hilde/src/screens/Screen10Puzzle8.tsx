import { useState } from "react";
import { useNumericSelect } from "../hooks/useHaEntity";
import { useHaService } from "../hooks/useHaService";
import { ENTITIES, CODE_SEGMENTS } from "../constants/entities";
import { ProgressCode } from "../components/ProgressCode";

/**
 * Screen 10: Puzzle 8 - The Code
 *
 * Player must enter the 8-digit code they have collected.
 * This is the final puzzle before the outro.
 */
export function Screen10Puzzle8() {
  const { isComplete, isLoading } = useNumericSelect(ENTITIES.PUZZLE_8_SELECT);
  const { setInputSelect } = useHaService();
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  // The correct code
  const correctCode = CODE_SEGMENTS.join("");

  const handleSubmit = () => {
    const cleanedInput = inputCode.replace(/\s/g, "");
    if (cleanedInput === correctCode) {
      setError("");
      // Mark puzzle as complete
      setInputSelect(ENTITIES.PUZZLE_8_SELECT, "1");
    } else {
      setError("Dat is niet de juiste code. Probeer opnieuw!");
      setInputCode("");
    }
  };

  if (isLoading) {
    return (
      <div className="puzzle-loading">
        <p>Puzzel laden...</p>
      </div>
    );
  }

  return (
    <div className="screen screen-10-puzzle-8">
      <div className="audio-puzzle">
        <div className="puzzle-header">
          <h2>Puzzel 8: De Code</h2>
          <p className="puzzle-description">
            Voer de 8-cijferige code in die je eerder hebt gevonden.
          </p>
        </div>

        {!isComplete ? (
          <div className="audio-puzzle-content">
            <div className="code-input-section">
              <label htmlFor="codeInput">Voer de code in:</label>
              <input
                id="codeInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputCode}
                onChange={(e) =>
                  setInputCode(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="Bijv. 83924980"
                maxLength={8}
                className="code-input"
              />
              {error && <p className="input-error">{error}</p>}
              <button
                className="submit-code-button"
                onClick={handleSubmit}
                disabled={inputCode.length < 8}
              >
                Controleer code
              </button>
            </div>
          </div>
        ) : (
          <div className="puzzle-complete">
            <h3>Puzzel opgelost!</h3>
            <p>Je hebt de laatste code gevonden!</p>
          </div>
        )}

        <ProgressCode screenNumber={10} puzzleJustCompleted={isComplete} />
      </div>
    </div>
  );
}
