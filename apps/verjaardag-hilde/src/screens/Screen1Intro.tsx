import { useCallback } from "react";
import { motion } from "framer-motion";
import { useHaService } from "../hooks/useHaService";
import "../styles/landing.css";

/**
 * Screen 1: Enhanced landing page with animations and accessibility.
 *
 * This is the entry point of the escape room. When the user clicks "Start!",
 * we call the HA service to advance to screen 2 (video intro).
 *
 * Design: Clean, centered layout with 'Verjaardag Hilde' as the main title
 * and a prominent Start button below it. Enhanced with:
 * - Fade-in animations using framer-motion
 * - Hover scale effects on the button
 * - Full accessibility support (aria-label, focus states, keyboard nav)
 */

/** Animation variants for staggered entrance */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Screen1Intro() {
  const { navigateToScreen } = useHaService();

  const handleStart = useCallback(() => {
    navigateToScreen(2);
  }, [navigateToScreen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleStart();
      }
    },
    [handleStart]
  );

  return (
    <div
      className="screen landing-screen"
      role="main"
      aria-labelledby="landing-title"
    >
      <motion.div
        className="landing-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          id="landing-title"
          className="landing-title"
          variants={titleVariants}
          data-testid="landing-title"
        >
          Verjaardag Hilde
        </motion.h1>
        <motion.button
          className="start-button"
          onClick={handleStart}
          onKeyDown={handleKeyDown}
          aria-label="Start de escaperoom"
          data-testid="start-button"
          variants={buttonVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          whileFocus={{ boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.5)" }}
        >
          Start!
        </motion.button>
      </motion.div>
    </div>
  );
}
