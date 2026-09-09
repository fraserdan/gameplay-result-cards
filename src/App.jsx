import { useState } from "react";
import ResultScreen from "./ResultScreen.jsx";
import "./App.css";

export default function App() {
  const [variant, setVariant] = useState("correct");
  const [animKey, setAnimKey] = useState(0);

  const showVariant = (next) => {
    setVariant(next);
    setAnimKey((k) => k + 1);
  };

  const replay = () => setAnimKey((k) => k + 1);

  return (
    <div className="demo-wrap">
      <ResultScreen variant={variant} animKey={animKey} />

      <div className="demo-controls">
        <button
          className={variant === "correct" ? "active" : ""}
          onClick={() => showVariant("correct")}
        >
          Correct
        </button>
        <button
          className={variant === "incorrect" ? "active" : ""}
          onClick={() => showVariant("incorrect")}
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
