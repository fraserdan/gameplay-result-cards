import { useState } from "react";
import QuestionScreen from "./QuestionScreen.jsx";
import ResultScreen from "./ResultScreen.jsx";
import LevelCompleteScreen from "./LevelCompleteScreen.jsx";
import "./App.css";

const QUESTIONS = {
  default: "How accurately does Pixel 11 handle mid-sentence corrections during voice typing?",
  guru: "Compared to older Pixels, how does Pixel 11's Gemini Floaty save more time on digital chores?",
};
const STARTING_LIVES = 3;

export default function App() {
  const [stage, setStage] = useState("question");
  const [variant, setVariant] = useState("correct");
  const [levelStatus, setLevelStatus] = useState("passed");
  const [animKey, setAnimKey] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [justLostLife, setJustLostLife] = useState(false);
  const [theme, setTheme] = useState("default");

  const goToQuestion = (nextTheme = theme) => {
    setJustLostLife(false);
    setLives(STARTING_LIVES);
    setTheme(nextTheme);
    setStage("question");
    setAnimKey((k) => k + 1);
  };

  const continueToNextQuestion = () => {
    if (lives <= 0) {
      setLevelStatus("failed");
      setStage("level");
    } else {
      setStage("question");
    }
    setAnimKey((k) => k + 1);
  };

  const showResult = (direction) => {
    if (direction === "left") {
      setJustLostLife(lives > 0);
      setLives((l) => Math.max(0, l - 1));
    } else {
      setJustLostLife(false);
    }
    setVariant(direction === "right" ? "correct" : "incorrect");
    setStage("result");
    setAnimKey((k) => k + 1);
  };

  const showLevel = (status) => {
    setLevelStatus(status);
    setStage("level");
    setAnimKey((k) => k + 1);
  };

  const replay = () => setAnimKey((k) => k + 1);

  return (
    <div className="demo-wrap">
      {stage === "question" && (
        <QuestionScreen
          key={animKey}
          question={QUESTIONS[theme]}
          lives={lives}
          justLostLife={justLostLife}
          onSwipe={showResult}
          theme={theme}
        />
      )}
      {stage === "result" && (
        <ResultScreen key={animKey} variant={variant} onContinue={continueToNextQuestion} />
      )}
      {stage === "level" && (
        <LevelCompleteScreen
          key={animKey}
          status={levelStatus}
          onReplay={() => goToQuestion(theme)}
          onClose={() => goToQuestion(theme)}
        />
      )}

      <div className="demo-controls">
        <button
          className={stage === "question" && theme === "default" ? "active" : ""}
          onClick={() => goToQuestion("default")}
        >
          Question
        </button>
        <button
          className={stage === "question" && theme === "guru" ? "active" : ""}
          onClick={() => goToQuestion("guru")}
        >
          Guru Level
        </button>
        <button
          className={stage === "result" && variant === "correct" ? "active" : ""}
          onClick={() => showResult("right")}
        >
          Correct
        </button>
        <button
          className={stage === "result" && variant === "incorrect" ? "active" : ""}
          onClick={() => showResult("left")}
        >
          Incorrect
        </button>
        <button
          className={stage === "level" && levelStatus === "passed" ? "active" : ""}
          onClick={() => showLevel("passed")}
        >
          Level Passed
        </button>
        <button
          className={stage === "level" && levelStatus === "failed" ? "active" : ""}
          onClick={() => showLevel("failed")}
        >
          Level Failed
        </button>
        <button className="replay" onClick={replay}>
          ↻ Replay
        </button>
      </div>
    </div>
  );
}
