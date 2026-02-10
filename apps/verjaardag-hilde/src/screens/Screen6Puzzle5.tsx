import { ProgressPuzzle } from "../components/ProgressPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 6: Puzzle 5 - The Lamps
 *
 * Player must toggle 5 smart lamps in the correct sequence.
 * Each lamp toggle is tracked by HA automations.
 */
export function Screen6Puzzle5() {
  const lampItems = [
    "Woonkamer lamp",
    "Keuken lamp",
    "Gang lamp",
    "Slaapkamer lamp",
    "Kantoor lamp",
  ];

  return (
    <div className="screen screen-6-puzzle-5">
      <ProgressPuzzle
        entityId={ENTITIES.PUZZLE_5_SELECT}
        screenNumber={6}
        puzzleNumber={5}
        title="De Lampen"
        description="Schakel 5 slimme lampen in de juiste volgorde in."
        items={lampItems}
        hint="Begin bij de woonkamer en werk je weg naar boven."
      />
    </div>
  );
}
