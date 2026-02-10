import { ProgressPuzzle } from "../components/ProgressPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 3: Puzzle 1 - The Doors
 *
 * Player must open 5 different doors in the house.
 * Each door open is tracked by HA automations that increment the puzzle select.
 *
 * Real sensors used:
 * - binary_sensor.voordeur_contact (Front door)
 * - binary_sensor.achterdeur_contact (Back door)
 * - binary_sensor.garage_contact (Garage door)
 * - binary_sensor.slaapkamer_contact (Bedroom door)
 * - binary_sensor.badkamer_contact (Bathroom door)
 */
export function Screen3Puzzle1() {
  const doorItems = [
    "Voordeur",
    "Achterdeur",
    "Garagedeur",
    "Slaapkamerdeur",
    "Badkamerdeur",
  ];

  return (
    <div className="screen screen-3-puzzle-1">
      <ProgressPuzzle
        entityId={ENTITIES.PUZZLE_1_SELECT}
        screenNumber={3}
        puzzleNumber={1}
        title="De Deuren"
        description="Open 5 verschillende deuren in het huis om de eerste code te ontgrendelen."
        items={doorItems}
        hint="Loop door het huis en open elke deur. De sensoren detecteren automatisch wanneer een deur opengaat."
      />
    </div>
  );
}
