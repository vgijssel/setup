import { useState } from "react";
import { useNumericSelect } from "../hooks/useHaEntity";
import { useHaService } from "../hooks/useHaService";
import { ENTITIES, CODE_SEGMENTS } from "../constants/entities";
import { ProgressCode } from "../components/ProgressCode";

/**
 * Screen 9: Puzzle 8 - The Audio Code
 *
 * Player hears an audio message and must enter the code mentioned.
 * This is the final puzzle before the outro.
 */
export function Screen9Puzzle8() {
  const { isComplete, isLoading } = useNumericSelect(ENTITIES.PUZZLE_8_SELECT);
  const { setInputSelect } = useHaService();
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  // The audio mentions this code
  const correctCode = CODE_SEGMENTS.join("");

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // In production, this would play an actual audio file
    // For now, we just simulate it
    setTimeout(() => setIsPlaying(false), 5000);
  };

  const handleSubmit = () => {
    const cleanedInput = inputCode.replace(/\s/g, "");
    if (cleanedInput === correctCode) {
      setError("");
      // Mark puzzle as complete
      setInputSelect(ENTITIES.PUZZLE_8_SELECT, "1");
    } else {
      setError("Dat is niet de juiste code. Luister nog eens goed!");
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
    <div className="screen screen-9-puzzle-8">
      <div className="audio-puzzle">
        <div className="puzzle-header">
          <h2>Puzzel 8: De Audio Code</h2>
          <p className="puzzle-description">
            Luister naar het audiofragment en voer de genoemde code in.
          </p>
        </div>

        {!isComplete ? (
          <div className="audio-puzzle-content">
            <div className="audio-player">
              <button
                className={`play-audio-button ${isPlaying ? "playing" : ""}`}
                onClick={handlePlayAudio}
                disabled={isPlaying}
              >
                {isPlaying ? "Bezig met afspelen..." : "Speel audio af"}
              </button>
              {isPlaying && (
                <div className="audio-wave">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            <div className="code-input-section">
              <label htmlFor="codeInput">Voer de code in:</label>
              <input
                id="codeInput"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Bijv. 83924980"
                maxLength={12}
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

            <div className="puzzle-hint">
              <p>
                <strong>Hint:</strong> De code bestaat uit 8 cijfers die je
                tijdens het audiofragment hoort.
              </p>
            </div>
          </div>
        ) : (
          <div className="puzzle-complete">
            <h3>Puzzel opgelost!</h3>
            <p>Je hebt de laatste code gevonden!</p>
          </div>
        )}

        <ProgressCode screenNumber={9} />
      </div>
    </div>
  );
}
