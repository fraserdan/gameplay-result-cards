import { useEffect, useState } from "react";
import useSwipeCard from "./useSwipeCard.js";
import backgroundPhoto from "./assets/showroom-bg.jpg";
import character from "./assets/character.png";
import characterShadow from "./assets/character-shadow.svg";
import guruBackgroundPhoto from "./assets/guru/guru-bg.jpg";
import pauseIcon from "./assets/pause.svg";
import iconDataTransfer from "./assets/icon-data-transfer.svg";
import SwipeIcon from "./SwipeIcon.jsx";
import "./ResultScreen.css";
import "./QuestionScreen.css";

const SWIPE_THRESHOLD = 110;
const EXIT_DISTANCE = 700;
const EXIT_ROTATION = 24;
const EXIT_DURATION = 340;
const HEART_LOSE_MOUNT_DELAY = 550;

const GURU_TIMER_MS = 30000;
const GURU_TICK_MS = 100;
const GURU_SHIMMER_MIN = 0.5;
const GURU_SHIMMER_MAX = 3.5;

// Depth planes: each layer shifts by an additional fraction of the drag
// distance (on top of the card's own motion), clamped so the oversized
// background image never runs out of coverage. Negative factors lag
// behind the card (far layer); positive factors lead ahead (near layer).
function parallax(dragX, factor, maxAbs) {
  const offset = dragX * factor;
  return Math.max(-maxAbs, Math.min(maxAbs, offset));
}

const HEART_PATH =
  "M16.3 0.5C14.9 0.5 13.6 1.17 12.8 2.2L10.4 4.88V4.87L7.95 2.19C7.13 1.16 5.88 0.5 4.47 0.5C2 0.5 0 2.54 0 5.05C0 7.25 1.84 8.9 3.18 10.49C4.5 12.07 5.83 13.65 7.16 15.22L10.14 18.77C10.22 18.87 10.3 18.96 10.39 19.06V19.06C10.47 18.97 10.55 18.87 10.63 18.78C11.62 17.6 12.62 16.42 13.61 15.23C14.94 13.65 16.27 12.08 17.6 10.5C18.93 8.91 20.77 7.26 20.77 5.06C20.77 2.54 18.77 0.5 16.3 0.5Z";

function Heart({ filled, losing }) {
  return (
    <span className="heart">
      <svg className="heart-outline" width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={HEART_PATH} fill="none" stroke="white" />
      </svg>
      {(filled || losing) && (
        <svg
          className={`heart-filled${losing ? " heart-losing" : ""}`}
          width="21"
          height="19"
          viewBox="0 0 21 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={HEART_PATH} fill="white" stroke="white" />
        </svg>
      )}
    </span>
  );
}

export default function QuestionScreen({ question, lives, justLostLife, onSwipe, theme = "default" }) {
  const isGuru = theme === "guru";
  const [losingHeartIndex, setLosingHeartIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1);

  const swipe = useSwipeCard({
    threshold: SWIPE_THRESHOLD,
    exitDistance: EXIT_DISTANCE,
    exitRotation: EXIT_ROTATION,
    exitDuration: EXIT_DURATION,
    onSwipeLeft: () => onSwipe("left"),
    onSwipeRight: () => onSwipe("right"),
  });

  useEffect(() => {
    if (!justLostLife) return;
    const t = window.setTimeout(() => setLosingHeartIndex(lives), HEART_LOSE_MOUNT_DELAY);
    return () => window.clearTimeout(t);
    // Only ever meant to fire once, right after this screen mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isGuru) return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const fraction = Math.max(0, 1 - (Date.now() - start) / GURU_TIMER_MS);
      setTimeLeft(fraction);
      if (fraction <= 0) window.clearInterval(id);
    }, GURU_TICK_MS);
    return () => window.clearInterval(id);
    // Only ever meant to run once, for the lifetime of this screen mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layerTransition = swipe.dragging ? "none" : `transform ${EXIT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  const bgOffset = parallax(swipe.dragX, -0.65, 55);
  const cardOffset = parallax(swipe.dragX, 0.15, 70);
  const shimmerDuration = GURU_SHIMMER_MIN + (GURU_SHIMMER_MAX - GURU_SHIMMER_MIN) * timeLeft;

  return (
    <div className={`phone-frame question${isGuru ? " guru" : ""}`}>
      <div
        className={`swipe-frame${swipe.exiting ? " exiting" : ""}`}
        {...swipe.handlers}
        style={swipe.style}
      >
        <img
          className="question-bg"
          src={isGuru ? guruBackgroundPhoto : backgroundPhoto}
          alt=""
          style={{ transform: `translateX(${bgOffset}px)`, transition: layerTransition }}
        />
        <div
          className="question-top-gradient"
          style={{ transform: `translateX(${bgOffset}px)`, transition: layerTransition }}
        />

        <div className="question-content">
          <div
            className={`card-wrap${isGuru ? " guru" : ""}`}
            style={{ transform: `translateX(${cardOffset}px)`, transition: layerTransition }}
          >
            <div className={`question-card${isGuru ? " guru" : ""}`}>
              <p className="question-text">{question}</p>
            </div>

            <div className="monster-wrap" aria-hidden="true">
              <img className="monster-shadow" src={characterShadow} alt="" />
              <img className="monster-character" src={character} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-header">
        <div className="status-bar-spacer" aria-hidden="true" />

        <div className="hud">
          <div className="hud-stats-row">
            <p className="hud-stat">LVL: {isGuru ? "Guru" : "Legend"}</p>
            <div className="hud-lives">
              {[0, 1, 2].map((i) => (
                <Heart
                  key={i}
                  filled={i < lives || (justLostLife && i === lives)}
                  losing={losingHeartIndex === i}
                />
              ))}
            </div>
            <p className="hud-stat hud-stat-right">Score: 250</p>
          </div>
          <div className="hud-progress-row">
            {isGuru ? (
              <div className="hud-progress-track guru-track">
                <div
                  className="hud-progress-fill guru-fill"
                  style={{
                    clipPath: `inset(0 ${(1 - timeLeft) * 100}% 0 0 round 2px)`,
                    "--shimmer-duration": `${shimmerDuration}s`,
                  }}
                />
              </div>
            ) : (
              <div className="hud-progress-track">
                <div className="hud-progress-fill" style={{ width: "46%" }} />
              </div>
            )}
            <img className="hud-pause" src={pauseIcon} alt="" />
          </div>
        </div>
      </div>

      <div className="fixed-footer">
        <div className="swipe-gestures">
          <div className="swipe-gesture swipe-gesture-left">
            <img className="swipe-gesture-icon" src={iconDataTransfer} alt="" />
            <p className="swipe-gesture-label">Wireless Data Transfer</p>
          </div>
          <div className="swipe-gesture swipe-gesture-right">
            <SwipeIcon className="swipe-gesture-icon swipe-gesture-icon-flip" fill="#202124" />
            <p className="swipe-gesture-label">
              Circle
              <br />
              to Search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
