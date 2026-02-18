import { useInputSelect } from "../hooks/useHaEntity";
import { ENTITIES } from "../constants/entities";
import { Screen1Intro } from "../screens/Screen1Intro";
import { Screen2Video } from "../screens/Screen2Video";
import { Screen3Puzzle1 } from "../screens/Screen3Puzzle1";
import { Screen4Puzzle2 } from "../screens/Screen4Puzzle2";
import { Screen5Puzzle3 } from "../screens/Screen5Puzzle3";
import { Screen6Puzzle4 } from "../screens/Screen6Puzzle4";
import { Screen7Puzzle5 } from "../screens/Screen7Puzzle5";
import { Screen8Puzzle6 } from "../screens/Screen8Puzzle6";
import { Screen9Puzzle7 } from "../screens/Screen9Puzzle7";
import { Screen10Puzzle8 } from "../screens/Screen10Puzzle8";
import { Screen11Outro } from "../screens/Screen11Outro";

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
          {currentScreen === 1 && <Screen1Intro />}
          {currentScreen === 2 && <Screen2Video />}
          {currentScreen === 3 && <Screen3Puzzle1 />}
          {currentScreen === 4 && <Screen4Puzzle2 />}
          {currentScreen === 5 && <Screen5Puzzle3 />}
          {currentScreen === 6 && <Screen6Puzzle4 />}
          {currentScreen === 7 && <Screen7Puzzle5 />}
          {currentScreen === 8 && <Screen8Puzzle6 />}
          {currentScreen === 9 && <Screen9Puzzle7 />}
          {currentScreen === 10 && <Screen10Puzzle8 />}
          {currentScreen === 11 && <Screen11Outro />}
        </div>
      </div>
    </div>
  );
}
