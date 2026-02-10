import { CollectionPuzzle } from "../components/CollectionPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 8: Puzzle 7 - Temperature
 *
 * Player must set 5 thermostats to specific temperatures.
 * Each correct temperature is tracked by an input_boolean.
 */
export function Screen8Puzzle7() {
  const tempItems = [
    {
      entityId: ENTITIES.PUZZLE_7.TEMP_7,
      label: "Thermostaat 1: 7 graden",
      description: "Koelkast temperatuur",
    },
    {
      entityId: ENTITIES.PUZZLE_7.TEMP_10,
      label: "Thermostaat 2: 10 graden",
      description: "Wijnkoeler temperatuur",
    },
    {
      entityId: ENTITIES.PUZZLE_7.TEMP_15,
      label: "Thermostaat 3: 15 graden",
      description: "Kelder temperatuur",
    },
    {
      entityId: ENTITIES.PUZZLE_7.TEMP_19,
      label: "Thermostaat 4: 19 graden",
      description: "Slaapkamer temperatuur",
    },
    {
      entityId: ENTITIES.PUZZLE_7.TEMP_20,
      label: "Thermostaat 5: 20 graden",
      description: "Woonkamer temperatuur",
    },
  ];

  return (
    <div className="screen screen-8-puzzle-7">
      <CollectionPuzzle
        screenNumber={8}
        puzzleNumber={7}
        title="De Temperaturen"
        description="Stel 5 thermostaten in op de juiste temperatuur."
        items={tempItems}
        hint="Elke ruimte heeft een ideale temperatuur. Denk logisch na over welke temperatuur waar hoort."
      />
    </div>
  );
}
