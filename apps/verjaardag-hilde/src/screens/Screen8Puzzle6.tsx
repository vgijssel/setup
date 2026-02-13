import { CollectionPuzzle } from "../components/CollectionPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 8: Puzzle 6 - Power Usage
 *
 * Player must turn on specific appliances.
 * Each appliance is tracked by an input_boolean.
 */
export function Screen8Puzzle6() {
  const powerItems = [
    {
      entityId: ENTITIES.PUZZLE_6.AUTO,
      label: "Auto",
      description: "De auto moet aan staan",
    },
    {
      entityId: ENTITIES.PUZZLE_6.DROGER,
      label: "Droger",
      description: "De droger moet aan staan",
    },
    {
      entityId: ENTITIES.PUZZLE_6.WASMACHINE,
      label: "Wasmachine",
      description: "De wasmachine moet aan staan",
    },
  ];

  return (
    <div className="screen screen-8-puzzle-6">
      <CollectionPuzzle
        screenNumber={8}
        puzzleNumber={6}
        title="Het Stroomverbruik"
        description="Zet de juiste apparaten aan om de code te ontgrendelen."
        items={powerItems}
      />
    </div>
  );
}
