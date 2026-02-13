import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { useHaService } from "../hooks/useHaService";
import { ProgressCode } from "../components/ProgressCode";
import { CODE_SEGMENTS } from "../constants/entities";

/**
 * Screen 11: Outro screen with final video and complete code.
 *
 * This is the final screen of the escape room, celebrating completion.
 * Shows:
 * - Congratulations message
 * - The complete safe code
 * - Outro video with autoplay (muted for browser compliance)
 * - Option to reset and play again
 *
 * 2026 best practices:
 * - muted + playsInline for reliable autoplay across browsers
 * - Framer Motion for fadeIn animations on celebration screen
 * - useCallback for performance optimization
 */

/** Animation variants for celebration screen */
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export function Screen11Outro() {
  const { resetGame } = useHaService();
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setIsVideoPlaying(false);
  }, []);

  const handleVideoError = useCallback((error: unknown) => {
    console.error("Outro video playback error:", error);
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (confirm("Weet je zeker dat je opnieuw wilt spelen?")) {
      resetGame();
    }
  }, [resetGame]);

  const handleWatchVideo = useCallback(() => {
    setShowVideo(true);
  }, []);

  const fullCode = CODE_SEGMENTS.join(" ");

  return (
    <div
      className="screen screen-11-outro"
      role="main"
      aria-label="Outro scherm"
      data-testid="screen-11-outro"
    >
      <div className="outro-content">
        <AnimatePresence mode="wait">
          {!showVideo ? (
            <motion.div
              key="celebration"
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="outro-celebration"
                variants={fadeInVariants}
              >
                <h2 data-testid="congratulations-title">Gefeliciteerd!</h2>
                <p className="outro-subtitle">Je hebt alle puzzels opgelost!</p>
              </motion.div>

              <motion.div
                className="outro-code-reveal"
                variants={fadeInVariants}
              >
                <h3>De volledige code is:</h3>
                <div className="final-code" data-testid="final-code">
                  {CODE_SEGMENTS.map((segment, index) => (
                    <span key={index} className="code-segment">
                      {segment}
                    </span>
                  ))}
                </div>
                <p className="code-instruction">
                  Gebruik deze code om de schatkist te openen!
                </p>
              </motion.div>

              <motion.div className="outro-message" variants={fadeInVariants}>
                <p>
                  Goed gedaan! Je hebt bewezen dat je een echte escape room held
                  bent. Nu is het tijd voor je verdiende cadeau!
                </p>
              </motion.div>

              <motion.div className="outro-actions" variants={fadeInVariants}>
                <button
                  className="watch-video-button"
                  onClick={handleWatchVideo}
                  aria-label="Bekijk de felicitatievideo"
                  data-testid="watch-video-button"
                >
                  Bekijk de felicitatievideo
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              className="outro-video-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              data-testid="outro-video-container"
            >
              <ReactPlayer
                url="/videos/verjaardag_hilde_outro.mp4"
                playing={isVideoPlaying}
                muted={true}
                controls={true}
                width="100%"
                height="100%"
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                data-testid="outro-video"
                config={{
                  file: {
                    attributes: {
                      playsInline: true,
                      preload: "auto",
                      "data-testid": "outro-video-element",
                      "data-playing": isVideoPlaying ? "true" : "false",
                    },
                  },
                }}
              />

              <AnimatePresence>
                {videoEnded && (
                  <motion.div
                    className="video-ended-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    data-testid="video-ended-actions"
                  >
                    <ProgressCode screenNumber={11} />
                    <p className="final-reminder">
                      De code voor de schatkist: <strong>{fullCode}</strong>
                    </p>
                    <button
                      className="play-again-button"
                      onClick={handlePlayAgain}
                      aria-label="Opnieuw spelen"
                      data-testid="play-again-button"
                    >
                      Opnieuw spelen
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
