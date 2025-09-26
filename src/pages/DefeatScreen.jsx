import React from "react";
import defeatBg from "../assets/background/defeat_dark.png";
import { useGame } from "../contexts/GameContext";
import PlayAgainButton from "../components/play-again.jsx";
import "../components/play-again.css";

export default function DefeatScreen({ onPlayAgain, onBackToTitle }) {
  const { resetGame } = useGame();

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <div
      className="game-screen"
      style={{ backgroundImage: `url(${defeatBg})`, backgroundSize: "cover" }}
    >
      <div className="end-screen">
        <h1 className="end-title">Defeat</h1>
        <PlayAgainButton onClick={handlePlayAgain} onBackToTitle={onBackToTitle} />
      </div>
    </div>
  );
}
