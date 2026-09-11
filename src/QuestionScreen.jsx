import { useState } from "react";
import backgroundPhoto from "./assets/showroom-bg.jpg";
import character from "./assets/character.png";
import characterShadow from "./assets/character-shadow.svg";
import waveFilled from "./assets/wave-1.svg";
import waveTrack from "./assets/wave-2.svg";
import pauseIcon from "./assets/pause.svg";
import iconDataTransfer from "./assets/icon-data-transfer.svg";
import SwipeIcon from "./SwipeIcon.jsx";
import "./ResultScreen.css";
import "./QuestionScreen.css";

const SWIPE_THRESHOLD = 110;
const EXIT_DISTANCE = 700;
const EXIT_ROTATION = 24;
const EXIT_DURATION = 340;

// Depth planes: each layer shifts by an additional fraction of the drag
// distance (on top of the card's own motion), clamped so the oversized
// background image never runs out of coverage. Negative factors lag
// behind the card (far layer); positive factors lead ahead (near layer).
function parallax(dragX, factor, maxAbs) {
  const offset = dragX * factor;
  return Math.max(-maxAbs, Math.min(maxAbs, offset));
}

function Heart({ filled }) {
  return (
    <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.3 0.5C14.9 0.5 13.6 1.17 12.8 2.2L10.4 4.88V4.87L7.95 2.19C7.13 1.16 5.88 0.5 4.47 0.5C2 0.5 0 2.54 0 5.05C0 7.25 1.84 8.9 3.18 10.49C4.5 12.07 5.83 13.65 7.16 15.22L10.14 18.77C10.22 18.87 10.3 18.96 10.39 19.06V19.06C10.47 18.97 10.55 18.87 10.63 18.78C11.62 17.6 12.62 16.42 13.61 15.23C14.94 13.65 16.27 12.08 17.6 10.5C18.93 8.91 20.77 7.26 20.77 5.06C20.77 2.54 18.77 0.5 16.3 0.5Z"
        fill={filled ? "white" : "none"}
        stroke="white"
      />
    </svg>
  );
}

export default function QuestionScreen({ question, onSwipe, animKey }) {
  const [drag, setDrag] = useState({ x: 0, dragging: false });
  const [exiting, setExiting] = useState(null);
  const [startX, setStartX] = useState(0);

  const handlePointerDown = (e) => {
    if (exiting) return;
    setStartX(e.clientX - drag.x);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag((d) => ({ ...d, dragging: true }));
  };

  const handlePointerMove = (e) => {
    if (!drag.dragging || exiting) return;
    setDrag({ x: e.clientX - startX, dragging: true });
  };

  const finishSwipe = (direction) => {
    setExiting(direction);
    setDrag({ x: direction === "right" ? EXIT_DISTANCE : -EXIT_DISTANCE, dragging: false });
    window.setTimeout(() => onSwipe(direction), EXIT_DURATION);
  };

  const handlePointerUp = () => {
    if (!drag.dragging) return;
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) {
      finishSwipe(drag.x > 0 ? "right" : "left");
    } else {
      setDrag({ x: 0, dragging: false });
    }
  };

  const rotation = Math.max(-1, Math.min(1, drag.x / 320)) * (exiting ? EXIT_ROTATION : 16);
  const scale = exiting ? 0.94 : 1 - Math.min(Math.abs(drag.x) / 1400, 0.08);

  const layerTransition = drag.dragging ? "none" : `transform ${EXIT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  const bgOffset = parallax(drag.x, -0.65, 55);
  const chromeOffset = parallax(drag.x, -0.3, 60);
  const cardOffset = parallax(drag.x, 0.15, 70);

  return (
    <div className="phone-frame question" key={animKey}>
      <div
        className={`swipe-frame${exiting ? " exiting" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${drag.x}px) rotate(${rotation}deg) scale(${scale})`,
          transition: drag.dragging ? "none" : `transform ${EXIT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <img
          className="question-bg"
          src={backgroundPhoto}
          alt=""
          style={{ transform: `translateX(${bgOffset}px)`, transition: layerTransition }}
        />
        <div
          className="question-top-gradient"
          style={{ transform: `translateX(${bgOffset}px)`, transition: layerTransition }}
        />

        <div className="question-content">
          <div className="question-top-group">
            <div className="status-bar-spacer" aria-hidden="true" />

            <div className="hud" style={{ transform: `translateX(${chromeOffset}px)`, transition: layerTransition }}>
              <div className="hud-stats-row">
                <p className="hud-stat">LVL: Legend</p>
                <div className="hud-lives">
                  <Heart filled={true} />
                  <Heart filled={false} />
                  <Heart filled={false} />
                </div>
                <p className="hud-stat hud-stat-right">Score: 250</p>
              </div>
              <div className="hud-progress-row">
                <div className="hud-progress-track">
                  <img className="hud-progress-segment" src={waveFilled} alt="" />
                  <img className="hud-progress-segment" src={waveTrack} alt="" />
                </div>
                <img className="hud-pause" src={pauseIcon} alt="" />
              </div>
              <div className="hud-divider" />
            </div>

            <div className="card-wrap" style={{ transform: `translateX(${cardOffset}px)`, transition: layerTransition }}>
              <div className="question-card">
                <p className="question-text">{question}</p>
              </div>

              <div className="monster-wrap" aria-hidden="true">
                <img className="monster-shadow" src={characterShadow} alt="" />
                <img className="monster-character" src={character} alt="" />
              </div>
            </div>
          </div>

          <div
            className="swipe-gestures"
            style={{ transform: `translateX(${chromeOffset}px)`, transition: layerTransition }}
          >
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
    </div>
  );
}
