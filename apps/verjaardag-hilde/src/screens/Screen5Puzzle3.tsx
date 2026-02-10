import { CollectionPuzzle } from "../components/CollectionPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 5: Puzzle 3 - The Switches
 *
 * Player must find and activate 5 different switches/buttons in the house.
 * Each switch is tracked by an input_boolean in Home Assistant.
 *
 * The switches could be:
 * - Physical smart switches
 * - Button sensors
 * - Motion-triggered buttons
 */
export function Screen5Puzzle3() {
  const switchItems = [
    {
      entityId: ENTITIES.PUZZLE_3_ITEM_1,
      label: "Schakelaar 1",
      description: "Gevonden bij de voordeur",
    },
    {
      entityId: ENTITIES.PUZZLE_3_ITEM_2,
      label: "Schakelaar 2",
      description: "Gevonden in de keuken",
    },
    {
      entityId: ENTITIES.PUZZLE_3_ITEM_3,
      label: "Schakelaar 3",
      description: "Gevonden in de woonkamer",
    },
    {
      entityId: ENTITIES.PUZZLE_3_ITEM_4,
      label: "Schakelaar 4",
      description: "Gevonden op de gang",
    },
    {
      entityId: ENTITIES.PUZZLE_3_ITEM_5,
      label: "Schakelaar 5",
      description: "Gevonden in de slaapkamer",
    },
  ];

  return (
    <div className="screen screen-5-puzzle-3">
      <CollectionPuzzle
        screenNumber={5}
        puzzleNumber={3}
        title="De Schakelaars"
        description="Vind en activeer 5 verborgen schakelaars in het huis."
        items={switchItems}
        hint="Kijk goed rond bij deuren en lichtschakelaars. Sommige schakelaars zijn niet wat ze lijken!"
      />
    </div>
  );
}
