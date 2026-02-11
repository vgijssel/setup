import { useInputSelect } from "../hooks/useHaEntity";
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
 *
 * Navigation is strictly read-only - all screen transitions are controlled
 * by Home Assistant entity state changes (automations, scripts, or manual).
 */
export function GameScreen() {
  const { value: screenValue, isLoading } = useInputSelect(
    ENTITIES.GLOBAL_SELECT
  );

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

  return (
    <div className="app">
      <div className="screen-container">
        {/* Screen content - read-only display based on HA state */}
        <div className="screen-content">
          {currentScreen === 1 && (
            <div className="screen-1">
              <h2>{screenInfo.title}</h2>
              <p>{screenInfo.description}</p>
            </div>
          )}

          {currentScreen === 2 && (
            <div className="screen-2">
              <h2>{screenInfo.title}</h2>
              <p>{screenInfo.description}</p>
              <p className="placeholder">
                Video player wordt hier getoond (Task 4)
              </p>
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
