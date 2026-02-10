import { useInputSelect } from "../hooks/useHaEntity";
import { useHaService } from "../hooks/useHaService";
import { ENTITIES } from "../constants/entities";
import { SCREEN_INFO } from "../types/entities";
import { ProgressCode } from "./ProgressCode";

/**
 * Main game screen component that reads the current screen from Home Assistant
 * and renders the appropriate content.
 *
 * This is the heart of the stateless architecture - the component subscribes
 * to the global select entity and re-renders whenever it changes, whether
 * from user interaction, HA automations, or manual state changes.
 */
export function GameScreen() {
  const { value: screenValue, isLoading } = useInputSelect(
    ENTITIES.GLOBAL_SELECT
  );
  const { navigateToScreen, resetGame } = useHaService();

  const currentScreen = parseInt(screenValue, 10) || 1;
  const screenInfo = SCREEN_INFO[currentScreen];

  if (isLoading) {
    return (
      <div className="app">
        <div className="screen-container">
          <div className="loading">
            <h2>Laden...</h2>
            <p>Verbinden met Home Assistant...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    navigateToScreen(2);
  };

  const handlePrevious = () => {
    if (currentScreen > 1) {
      navigateToScreen(currentScreen - 1);
    }
  };

  const handleNext = () => {
    if (currentScreen < 10) {
      navigateToScreen(currentScreen + 1);
    }
  };

  const handleReset = () => {
    if (confirm("Weet je zeker dat je het spel wilt resetten?")) {
      resetGame();
    }
  };

  return (
    <div className="app">
      <div className="screen-container">
        <h1>Verjaardag Hilde</h1>
        <p>Scherm {currentScreen} van 10</p>

        {/* Debug navigation - remove in production */}
        {import.meta.env.DEV && (
          <div className="debug-nav">
            <button onClick={handlePrevious} disabled={currentScreen === 1}>
              Vorige
            </button>
            <span>Scherm {currentScreen}</span>
            <button onClick={handleNext} disabled={currentScreen === 10}>
              Volgende
            </button>
            <button onClick={handleReset} className="reset-button">
              Reset
            </button>
          </div>
        )}

        {/* Screen content */}
        <div className="screen-content">
          {currentScreen === 1 && (
            <div className="screen-1">
              <h2>{screenInfo.title}</h2>
              <p>{screenInfo.description}</p>
              <button className="start-button" onClick={handleStart}>
                Start!
              </button>
            </div>
          )}

          {currentScreen === 2 && (
            <div className="screen-2">
              <h2>{screenInfo.title}</h2>
              <p>{screenInfo.description}</p>
              <p className="placeholder">
                Video player wordt hier getoond (Task 4)
              </p>
              <button
                className="continue-button"
                onClick={() => navigateToScreen(3)}
              >
                Ga verder
              </button>
            </div>
          )}

          {currentScreen >= 3 && currentScreen <= 9 && (
            <div className={`screen-${currentScreen} puzzle-screen`}>
              <h2>{screenInfo.title}</h2>
              <p>{screenInfo.description}</p>
              <ProgressCode screenNumber={currentScreen} />
              <p className="placeholder">
                Puzzel {screenInfo.puzzleNumber} ({screenInfo.puzzleType}) wordt
                hier getoond
              </p>
            </div>
          )}

          {currentScreen === 10 && (
            <div className="screen-10">
              <h2>{screenInfo.title}</h2>
              <p>{screenInfo.description}</p>
              <ProgressCode screenNumber={currentScreen} />
              <p className="placeholder">
                Outro video wordt hier getoond (Task 9)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
