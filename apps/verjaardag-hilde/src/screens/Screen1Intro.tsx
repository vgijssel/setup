import { useHaService } from "../hooks/useHaService";
import "../styles/landing.css";

/**
 * Screen 1: Minimal landing page with centered title and Start button.
 *
 * This is the entry point of the escape room. When the user clicks "Start!",
 * we call the HA service to advance to screen 2 (video intro).
 *
 * Design: Clean, centered layout with 'Verjaardag Hilde' as the main title
 * and a prominent Start button below it. All other content removed for
 * a minimal, elegant presentation.
 */
export function Screen1Intro() {
  const { navigateToScreen } = useHaService();

  const handleStart = () => {
    navigateToScreen(2);
  };

  return (
    <div className="screen landing-screen">
      <div className="landing-content">
        <h1 className="landing-title">Verjaardag Hilde</h1>
        <button
          className="start-button"
          onClick={handleStart}
          aria-label="Start het spel"
        >
          Start!
        </button>
      </div>
    </div>
  );
}
