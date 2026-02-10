import { ProgressPuzzle } from "../components/ProgressPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 4: Puzzle 2 - Apple TV Questions
 *
 * Player must answer 3 trivia questions about Apple TV apps and usage.
 * Each correct answer is tracked by HA automations.
 */
export function Screen4Puzzle2() {
  const questionItems = [
    "Vraag 1: Welke streaming app gebruiken we het meest?",
    "Vraag 2: Wat is de favoriete film categorie?",
    "Vraag 3: Hoeveel apps staan er op de Apple TV?",
  ];

  return (
    <div className="screen screen-4-puzzle-2">
      <ProgressPuzzle
        entityId={ENTITIES.PUZZLE_2_SELECT}
        screenNumber={4}
        puzzleNumber={2}
        title="De Apple TV Quiz"
        description="Beantwoord 3 vragen over onze Apple TV om de code te krijgen."
        items={questionItems}
        hint="De antwoorden kun je vinden door de Apple TV te bekijken."
      />
    </div>
  );
}
