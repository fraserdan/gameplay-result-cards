import useSwipeCard from "./useSwipeCard.js";
import SwipeIcon from "./SwipeIcon.jsx";
import "./ResultScreen.css";

const CONTENT = {
  correct: {
    headline: "Correct!",
    title: "Wireless Data Transfer",
    description:
      "Our upgraded wireless transfer safely moves your photos, passwords, eSIM, messages and more.",
  },
  incorrect: {
    headline: "Incorrect!",
    title: "Magic Capture",
    description:
      "With one tap, Google Pixel captures the best moments, edits them and curates them into easily shareable collections.",
  },
};

export default function ResultScreen({ variant, onContinue }) {
  const copy = CONTENT[variant];
  const swipe = useSwipeCard({ onSwipeLeft: onContinue, onSwipeRight: onContinue });

  return (
    <div className={`phone-frame ${variant}`}>
      <div className="screen">
        <div
          className={`swipe-layer${swipe.exiting ? " exiting" : ""}`}
          {...swipe.handlers}
          style={swipe.style}
        >
          <div className="status-bar-spacer" aria-hidden="true" />

          <div className="content">
            <h1 className="headline">{copy.headline}</h1>

            <div className="reveal-group">
              <div className="feature-card">
                <div className="feature-image" />
                <div className="feature-text">
                  <p className="feature-title">{copy.title}</p>
                  <p className="feature-description">{copy.description}</p>
                </div>
              </div>

              <div className="swipe-prompt">
                <SwipeIcon className="swipe-icon" />
                <p className="swipe-label">Swipe to continue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
