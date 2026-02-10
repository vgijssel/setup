import { useHaService } from "../hooks/useHaService";

/**
 * Screen 1: Introduction screen with welcome message and start button.
 *
 * This is the entry point of the escape room. When the user clicks "Start!",
 * we call the HA service to advance to screen 2 (video intro).
 */
export function Screen1Intro() {
  const { navigateToScreen } = useHaService();

  const handleStart = () => {
    navigateToScreen(2);
  };

  return (
    <div className="screen screen-1-intro">
      <div className="intro-content">
        <div className="intro-header">
          <h2>Welkom bij de Escape Room!</h2>
          <p className="intro-subtitle">
            Een speciaal spel voor Hilde's verjaardag
          </p>
        </div>

        <div className="intro-description">
          <p>
            In dit spel moet je 8 puzzels oplossen die allemaal te maken hebben
            met ons slimme huis. Elke opgeloste puzzel onthult een deel van de
            geheime code.
          </p>
          <p>
            Gebruik de sensoren, schakelaars en apparaten in huis om de puzzels
            op te lossen. Veel succes!
          </p>
        </div>

        <div className="intro-rules">
          <h3>Spelregels:</h3>
          <ul>
            <li>Los alle 8 puzzels op om de volledige code te krijgen</li>
            <li>Elke puzzel onthult 2 cijfers van de code</li>
            <li>De code opent de schatkist met je cadeau!</li>
          </ul>
        </div>

        <button className="start-button" onClick={handleStart}>
          Start!
        </button>
      </div>
    </div>
  );
}
