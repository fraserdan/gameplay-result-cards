import { useState } from "react";
import QuestionScreen from "./QuestionScreen.jsx";
import ResultScreen from "./ResultScreen.jsx";
import "./App.css";

const QUESTION = "How accurately does Pixel 11 handle mid-sentence corrections during voice typing?";

export default function App() {
  const [stage, setStage] = useState("question");
  const [variant, setVariant] = useState("correct");
  const [animKey, setAnimKey] = useState(0);

  const goToQuestion = () => {
    setStage("question");
    setAnimKey((k) => k + 1);
  };

  const showResult = (next) => {
    setVariant(next);
    setStage("result");
    setAnimKey((k) => k + 1);
  };

  const handleSwipe = (direction) => {
    showResult(direction === "right" ? "correct" : "incorrect");
  };

  const replay = () => setAnimKey((k) => k + 1);

  return (
    <div className="demo-wrap">
      {stage === "question" ? (
        <QuestionScreen question={QUESTION} onSwipe={handleSwipe} animKey={animKey} />
      ) : (
        <ResultScreen variant={variant} animKey={animKey} />
      )}

      <div className="demo-controls">
        <button className={stage === "question" ? "active" : ""} onClick={goToQuestion}>
          Question
        </button>
        <button
          className={stage === "result" && variant === "correct" ? "active" : ""}
          onClick={() => showResult("correct")}
        >
          Correct
        </button>
        <button
          className={stage === "result" && variant === "incorrect" ? "active" : ""}
          onClick={() => showResult("incorrect")}
        >
          Incorrect
        </button>
        <button className="replay" onClick={replay}>
          ↻ Replay
        </button>
      </div>
    </div>
  );
}
