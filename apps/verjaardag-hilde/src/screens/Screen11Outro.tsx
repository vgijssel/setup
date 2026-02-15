import { ProgressCode } from "../components/ProgressCode";

/**
 * Screen 11: Outro screen with completion message.
 *
 * This is the final screen of the escape room.
 * Shows:
 * - Completion message thanking the player
 * - ProgressCode component showing the complete vault code
 */
export function Screen11Outro() {
  return (
    <div
      className="screen screen-11-outro"
      role="main"
      aria-label="Outro scherm"
      data-testid="screen-11-outro"
    >
      <div className="outro-message" data-testid="outro-message">
        <h1>
          Bedankt, ik ben weer helemaal hersteld! Kijk nu in de kluis voor je
          verassing!
        </h1>
      </div>

      <ProgressCode screenNumber={11} puzzleJustCompleted={true} />
    </div>
  );
}
