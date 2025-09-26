// src/components/play-again.jsx
import React from "react";
import { useGame } from "../contexts/GameContext";
import "./play-again.css";

export default function PlayAgain({ onBackToTitle }) {
  const { resetGame } = useGame();

  const handleClick = () => {
    resetGame();        // clear progress
    if (onBackToTitle) {
      onBackToTitle();  // go back to TitleScreen
    }
  };

  return (
    <button className="play-again-button" onClick={handleClick}>
      Play Again
    </button>
  );
}
