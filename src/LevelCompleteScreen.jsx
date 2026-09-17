import { useEffect, useState } from "react";
import levelBg from "./assets/level/level-bg.jpg";
import menuIcon from "./assets/level/menu.svg";
import closeIcon from "./assets/level/close.svg";
import infoIcon from "./assets/level/icon-info.svg";
import lightbulbIcon from "./assets/level/icon-lightbulb.svg";
import ReplayIcon from "./ReplayIcon.jsx";
import PlayIcon from "./PlayIcon.jsx";
import "./ResultScreen.css";
import "./LevelCompleteScreen.css";

const COUNT_UP_DURATION = 1400;
const COUNT_UP_DELAY = 350;

const CONTENT = {
  passed: {
    pillLabel: "Level Complete",
    scoreGradient: "linear-gradient(192deg, #00b24b 49.2%, #3dc9ed 119.24%)",
    score: 295,
    accuracyBadge: "100% match",
    accuracyFraction: "15/15",
    baseScore: 180,
    comboBonus: 25,
    speedBonus: 25,
    showLeaderboard: true,
    primaryLabel: "Rising Star [Next level]",
    primaryIcon: "play",
    secondaryLabel: "Replay to improve your score",
    secondaryIcon: "replay",
  },
  failed: {
    pillLabel: "Level Failed",
    scoreGradient: "linear-gradient(to bottom, #fc413d 60.6%, #ff6595 113.25%)",
    score: 80,
    accuracyBadge: null,
    accuracyFraction: "8/15",
    baseScore: 50,
    comboBonus: 15,
    speedBonus: 15,
    showLeaderboard: false,
    primaryLabel: "Replay",
    primaryIcon: "replay",
    secondaryLabel: "Learn about the Pixel 11",
    secondaryIcon: "lightbulb",
  },
};

const LEADERBOARD = [
  { rank: "08", name: "Marcus W.", score: 265, you: false },
  { rank: "09", name: "You", score: 253, you: true },
  { rank: "10", name: "Alex T.", score: 248, you: false },
];

function useCountUp(target, duration, delay) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const startTimeout = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(startTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}

export default function LevelCompleteScreen({ status, onReplay, onClose }) {
  const copy = CONTENT[status];
  const displayedScore = useCountUp(copy.score, COUNT_UP_DURATION, COUNT_UP_DELAY);

  return (
    <div className={`phone-frame level-complete ${status}`}>
      <img className="level-bg" src={levelBg} alt="" />
      <div className="level-bg-tint" />

      <div className="level-content">
        <div className="status-bar-spacer" aria-hidden="true" />

        <div className="level-body">
          <div className="level-top-bar">
            <img className="level-icon-button" src={menuIcon} alt="" />
            <div className="level-pill">{copy.pillLabel}</div>
            <button className="level-close" onClick={onClose} aria-label="Close">
              <img src={closeIcon} alt="" />
            </button>
          </div>

          <div className="level-score-card">
            <p className="level-score-eyebrow">Your Score</p>
            <p className="level-score-value" style={{ backgroundImage: copy.scoreGradient }}>
              {displayedScore}
            </p>

            <div className="level-breakdown">
              <div className="level-breakdown-row">
                <p className="level-breakdown-label">Accuracy</p>
                <div className="level-accuracy">
                  {copy.accuracyBadge && (
                    <span className="level-accuracy-badge" style={{ backgroundImage: copy.scoreGradient }}>
                      {copy.accuracyBadge}
                    </span>
                  )}
                  <p className="level-breakdown-value bold">{copy.accuracyFraction}</p>
                </div>
              </div>
              <div className="level-divider" />
              <div className="level-breakdown-row">
                <p className="level-breakdown-label">Base score</p>
                <p className="level-breakdown-value">{copy.baseScore}</p>
              </div>
              <div className="level-breakdown-row">
                <p className="level-breakdown-label with-info">
                  Combo bonus
                  <img className="level-info-icon" src={infoIcon} alt="" />
                </p>
                <p className="level-breakdown-value positive">+{copy.comboBonus}</p>
              </div>
              <div className="level-breakdown-row">
                <p className="level-breakdown-label with-info">
                  Speed bonus
                  <img className="level-info-icon" src={infoIcon} alt="" />
                </p>
                <p className="level-breakdown-value positive">+{copy.speedBonus}</p>
              </div>
            </div>
          </div>

          {copy.showLeaderboard && (
            <div className="level-leaderboard">
              <p className="level-leaderboard-header">Regional Leaderboard</p>
              {LEADERBOARD.map((row) => (
                <div key={row.rank} className={`level-leaderboard-row${row.you ? " you" : ""}`}>
                  <div className="level-leaderboard-identity">
                    <span className="level-leaderboard-rank">{row.rank}</span>
                    <span className="level-leaderboard-name">{row.name}</span>
                  </div>
                  <span className="level-leaderboard-score">{row.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="level-actions">
          <button className="level-button primary" onClick={onReplay}>
            {copy.primaryIcon === "play" ? <PlayIcon fill="#fff" /> : <ReplayIcon fill="#fff" />}
            <span>{copy.primaryLabel}</span>
          </button>
          <button className="level-button secondary" onClick={onReplay}>
            {copy.secondaryIcon === "lightbulb" ? (
              <img className="level-button-icon" src={lightbulbIcon} alt="" />
            ) : (
              <ReplayIcon fill="#185abc" />
            )}
            <span>{copy.secondaryLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
