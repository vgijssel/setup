import { CollectionPuzzle } from "../components/CollectionPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 9: Puzzle 7 - The Rooms
 *
 * Player must activate 5 room toggles.
 * Each room is tracked by an input_boolean.
 */
export function Screen9Puzzle7() {
  const roomItems = [
    {
      entityId: ENTITIES.PUZZLE_7.BABYKAMER,
      label: "Babykamer",
      description: "De kinderkamer",
    },
    {
      entityId: ENTITIES.PUZZLE_7.BADKAMER,
      label: "Badkamer",
      description: "De badruimte",
    },
    {
      entityId: ENTITIES.PUZZLE_7.KANTOOR,
      label: "Kantoor",
      description: "De werkruimte",
    },
    {
      entityId: ENTITIES.PUZZLE_7.SLAAPKAMER,
      label: "Slaapkamer",
      description: "De slaapkamer",
    },
    {
      entityId: ENTITIES.PUZZLE_7.WOONKAMER,
      label: "Woonkamer",
      description: "De woonkamer",
    },
  ];

  return (
    <div className="screen screen-9-puzzle-7">
      <CollectionPuzzle
        screenNumber={9}
        puzzleNumber={7}
        title="Temperatuur Controle"
        description="Zet de juiste temperatuur in verschillende kamers: 7 - 10 - 15 - 19 - 20"
        items={roomItems}
      />
    </div>
  );
}
