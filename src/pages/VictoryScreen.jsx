import React from "react";
import victoryBg from "../assets/background/victory_sunrise.png";
import { useGame } from "../contexts/GameContext";
import PlayAgainButton from "../components/play-again.jsx";
import "../components/play-again.css";

export default function VictoryScreen({ onPlayAgain, onBackToTitle }) {
  const { resetGame } = useGame();

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <div
      className="game-screen"
      style={{ backgroundImage: `url(${victoryBg})`, backgroundSize: "cover" }}
    >
      <div className="end-screen">
        <h1 className="end-title">Victory!</h1>
        <PlayAgainButton onClick={handlePlayAgain} onBackToTitle={onBackToTitle} />
      </div>
    </div>
  );
}
