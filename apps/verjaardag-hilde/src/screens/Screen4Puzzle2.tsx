import { ProgressPuzzle } from "../components/ProgressPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 4: Puzzle 2 - Apple TV Room-Based App Start
 *
 * Player must start specific apps on Apple TVs in different rooms.
 * Each correct app start is tracked by HA automations.
 */
export function Screen4Puzzle2() {
  const questionItems = [
    "Slaapkamer - Start de app met Ludo",
    "Woonkamer - Start de app met veel bloed en snijden",
    "Slaapkamer - Start de app om lekker te lachen",
  ];

  return (
    <div className="screen screen-4-puzzle-2">
      <ProgressPuzzle
        entityId={ENTITIES.PUZZLE_2_SELECT}
        screenNumber={4}
        puzzleNumber={2}
        title="Apple TV Controle"
        description="Start de juiste apps op de Apple TV in de aangegeven kamers."
        items={questionItems}
      />
    </div>
  );
}
