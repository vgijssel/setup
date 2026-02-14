import { useMemo } from "react";
import { motion } from "framer-motion";
import { ProgressPuzzle } from "../components/ProgressPuzzle";
import { ENTITIES } from "../constants/entities";

/**
 * Screen 3: Puzzle 1 - The Doors
 *
 * Player must open 5 different doors in the house.
 * Each door open is tracked by HA automations that increment the puzzle select.
 *
 * The screen subscribes to verjaardag_hilde_puzzle_1_select entity and
 * updates visual progress when the value changes from 0 to 1 to 5.
 *
 * Real sensors used (in order):
 * - binary_sensor.slaapkamer_contact (Bedroom door)
 * - binary_sensor.babykamer_contact (Baby room door)
 * - binary_sensor.badkamer_contact (Bathroom door)
 * - binary_sensor.voordeur_contact (Front door)
 * - binary_sensor.achterdeur_contact (Back door)
 *
 * PRD Design: Fullscreen responsive layout with puzzle-focused header,
 * centered ProgressPuzzle with door-themed animations.
 */

/** Animation variants for entrance */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Screen3Puzzle1() {
  const doorItems = useMemo(
    () => [
      "Slaapkamerdeur",
      "Babykamerdeur",
      "Badkamerdeur",
      "Voordeur",
      "Achterdeur",
    ],
    []
  );

  return (
    <motion.div
      className="screen screen-3-puzzle-1"
      role="main"
      aria-label="Deuren Controle"
      data-testid="screen-3-puzzle-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ProgressPuzzle
        entityId={ENTITIES.PUZZLE_1_SELECT}
        screenNumber={3}
        puzzleNumber={1}
        title="Deuren Controle"
        description="Open en/of sluit 5 verschillende deuren in het huis in de juiste volgorde."
        items={doorItems}
        progressiveDisclosure={true}
        hiddenPlaceholder="Deur ?"
      />
    </motion.div>
  );
}
