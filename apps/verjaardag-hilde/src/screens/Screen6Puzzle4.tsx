import { CollectionPuzzle } from "../components/CollectionPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 6: Puzzle 4 - The Colors
 *
 * Player must activate the correct color combination.
 * Each color is tracked by an input_boolean in Home Assistant.
 */
export function Screen6Puzzle4() {
  const colorItems = [
    {
      entityId: ENTITIES.PUZZLE_4.RED,
      label: "Rood",
      description: "Rood geactiveerd",
    },
    {
      entityId: ENTITIES.PUZZLE_4.BLUE,
      label: "Blauw",
      description: "Blauw geactiveerd",
    },
    {
      entityId: ENTITIES.PUZZLE_4.GREEN,
      label: "Donkergroen",
      description: "Donkergroen geactiveerd",
    },
  ];

  return (
    <div className="screen screen-6-puzzle-4">
      <CollectionPuzzle
        screenNumber={6}
        puzzleNumber={4}
        title="Spraak Controle"
        description="Gebruik spraakopdrachten om de juiste kleuren te activeren."
        items={colorItems}
        showLabelsWhenPending={true}
      />
    </div>
  );
}
