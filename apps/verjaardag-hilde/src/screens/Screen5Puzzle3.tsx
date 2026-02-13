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
      entityId: ENTITIES.PUZZLE_3.KEUKEN,
      label: "Keuken schakelaar",
      description: "Gevonden in de keuken",
    },
    {
      entityId: ENTITIES.PUZZLE_3.SLAAPKAMER,
      label: "Slaapkamer schakelaar",
      description: "Gevonden in de slaapkamer",
    },
    {
      entityId: ENTITIES.PUZZLE_3.TUIN,
      label: "Tuin schakelaar",
      description: "Gevonden in de tuin",
    },
    {
      entityId: ENTITIES.PUZZLE_3.VOORRAADKAST,
      label: "Voorraadkast schakelaar",
      description: "Gevonden in de voorraadkast",
    },
    {
      entityId: ENTITIES.PUZZLE_3.WASKAMER,
      label: "Waskamer schakelaar",
      description: "Gevonden in de waskamer",
    },
  ];

  return (
    <div className="screen screen-5-puzzle-3">
      <CollectionPuzzle
        screenNumber={5}
        puzzleNumber={3}
        title="Schakelaars Controle"
        description="Match de juiste schakelaar met de juiste lamp."
        items={switchItems}
      />
    </div>
  );
}
