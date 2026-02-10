import { useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { useHaService } from "../hooks/useHaService";
import { ProgressCode } from "../components/ProgressCode";
import { CODE_SEGMENTS } from "../constants/entities";

/**
 * Screen 10: Outro screen with final video and complete code.
 *
 * This is the final screen of the escape room, celebrating completion.
 * Shows:
 * - Congratulations message
 * - The complete safe code
 * - Outro video
 * - Option to reset and play again
 */
export function Screen10Outro() {
  const { resetGame } = useHaService();
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
  }, []);

  const handlePlayAgain = () => {
    if (confirm("Weet je zeker dat je opnieuw wilt spelen?")) {
      resetGame();
    }
  };

  const fullCode = CODE_SEGMENTS.join(" ");

  return (
    <div className="screen screen-10-outro">
      <div className="outro-content">
        {!showVideo ? (
          <>
            <div className="outro-celebration">
              <h2>Gefeliciteerd!</h2>
              <p className="outro-subtitle">Je hebt alle puzzels opgelost!</p>
            </div>

            <div className="outro-code-reveal">
              <h3>De volledige code is:</h3>
              <div className="final-code">
                {CODE_SEGMENTS.map((segment, index) => (
                  <span key={index} className="code-segment">
                    {segment}
                  </span>
                ))}
              </div>
              <p className="code-instruction">
                Gebruik deze code om de schatkist te openen!
              </p>
            </div>

            <div className="outro-message">
              <p>
                Goed gedaan! Je hebt bewezen dat je een echte escape room held
                bent. Nu is het tijd voor je verdiende cadeau!
              </p>
            </div>

            <div className="outro-actions">
              <button
                className="watch-video-button"
                onClick={() => setShowVideo(true)}
              >
                Bekijk de felicitatievideo
              </button>
            </div>
          </>
        ) : (
          <div className="outro-video-container">
            <ReactPlayer
              url="/videos/verjaardag_hilde_outro.mp4"
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              onEnded={handleVideoEnd}
              config={{
                file: {
                  attributes: {
                    playsInline: true,
                  },
                },
              }}
            />

            {videoEnded && (
              <div className="video-ended-actions">
                <ProgressCode screenNumber={10} />
                <p className="final-reminder">
                  De code voor de schatkist: <strong>{fullCode}</strong>
                </p>
                <button className="play-again-button" onClick={handlePlayAgain}>
                  Opnieuw spelen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
