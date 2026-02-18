import { HassProvider } from "./providers/HassProvider";
import { GameScreen } from "./components/GameScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ConnectionStatus } from "./components/ConnectionStatus";

/**
 * Main application component for Verjaardag Hilde escape room.
 *
 * The app is stateless - all game state is managed by Home Assistant entities.
 * HassProvider handles the WebSocket connection to Home Assistant.
 * GameScreen reads the global select entity and renders the appropriate screen.
 *
 * Screen mapping:
 * - Screen 1: Intro (title + Start button)
 * - Screen 2: Intro video with timed HA automations
 * - Screen 3: Puzzle 1 - Doors (progress puzzle, 5 doors)
 * - Screen 4: Puzzle 2 - Apple TV (progress puzzle, 3 questions)
 * - Screen 5: Puzzle 3 - Buttons (collection puzzle, 5 switches)
 * - Screen 6: Puzzle 5 - Lamps (progress puzzle, 5 toggles)
 * - Screen 7: Puzzle 6 - Power Usage (collection puzzle)
 * - Screen 8: Puzzle 7 - Temperature (collection puzzle, 5 temps)
 * - Screen 9: Puzzle 8 - Audio (progress puzzle, code input)
 * - Screen 10: Outro video with full code revealed
 */
function App() {
  return (
    <ErrorBoundary>
      <HassProvider>
        <GameScreen />
        <ConnectionStatus />
      </HassProvider>
    </ErrorBoundary>
  );
}

export default App;
