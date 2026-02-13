import { ProgressPuzzle } from "../components/ProgressPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 7: Puzzle 5 - The Lamps
 *
 * Player must toggle 5 smart lamps in the correct sequence.
 * Each lamp toggle is tracked by HA automations.
 */
export function Screen7Puzzle5() {
  const lampItems = [
    "Woonkamer lamp",
    "Keuken lamp",
    "Gang lamp",
    "Slaapkamer lamp",
    "Kantoor lamp",
  ];

  return (
    <div className="screen screen-7-puzzle-5">
      <ProgressPuzzle
        entityId={ENTITIES.PUZZLE_5_SELECT}
        screenNumber={7}
        puzzleNumber={5}
        title="Lampen Controle"
        description="Zet de lampen in de juiste volgorde aan"
        items={lampItems}
        progressiveDisclosure={true}
        hiddenPlaceholder="Lamp ?"
      />
    </div>
  );
}
