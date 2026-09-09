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

const LETTER_STAGGER_MS = 45;
const LETTER_START_DELAY_MS = 150;

function MaskedHeadline({ text }) {
  const letters = Array.from(text);
  return (
    <h1 className="headline" aria-label={text}>
      {letters.map((char, i) => (
        <span className="letter-mask" key={i} aria-hidden="true">
          <span
            className="letter-inner"
            style={{ animationDelay: `${LETTER_START_DELAY_MS + i * LETTER_STAGGER_MS}ms` }}
          >
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default function ResultScreen({ variant, animKey }) {
  const copy = CONTENT[variant];

  return (
    <div className={`phone-frame ${variant}`} key={animKey}>
      <div className="screen">
        <div className="status-bar-spacer" aria-hidden="true" />

        <div className="content">
          <MaskedHeadline text={copy.headline} />

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
  );
}
