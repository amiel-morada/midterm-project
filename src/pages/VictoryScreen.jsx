import React from "react";
import victoryBg from "../assets/background/victory_sunrise.png";
import { useGame } from "../contexts/GameContext";
import "./GameScreen.css"; // reuse styles

export default function VictoryScreen({ onBackToTitle }) {
  const { resetGame } = useGame();

  const handleBackToTitle = () => {
    resetGame();       // Clear progress
    onBackToTitle();   // Go back to title screen
  };

  return (
    <div
      className="game-screen"
      style={{ backgroundImage: `url(${victoryBg})`, backgroundSize: "cover" }}
    >
      <div style={{ textAlign: "center", color: "white", marginTop: "150px" }}>
        <h1>Victory!</h1>
        <p>You successfully completed the quest!</p>
        <button
          className="back-button"
          onClick={handleBackToTitle}
          style={{ marginTop: "20px" }}
        >
          Back to Title
        </button>
      </div>
    </div>
  );
}
