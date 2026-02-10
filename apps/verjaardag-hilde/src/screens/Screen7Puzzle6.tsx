import { CollectionPuzzle } from "../components/CollectionPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 7: Puzzle 6 - Power Usage
 *
 * Player must reach a specific power usage threshold by turning on devices.
 * The threshold is tracked by a single input_boolean.
 */
export function Screen7Puzzle6() {
  const powerItems = [
    {
      entityId: ENTITIES.PUZZLE_6.POWER_THRESHOLD,
      label: "Stroomverbruik drempel bereikt",
      description: "Zet genoeg apparaten aan om de drempel te bereiken",
    },
  ];

  return (
    <div className="screen screen-7-puzzle-6">
      <CollectionPuzzle
        screenNumber={7}
        puzzleNumber={6}
        title="Het Stroomverbruik"
        description="Zet genoeg apparaten aan om de stroomverbruik drempel te bereiken."
        items={powerItems}
        hint="Kijk naar de energiemeter en zet apparaten aan tot je boven de 500W komt."
      />
    </div>
  );
}
