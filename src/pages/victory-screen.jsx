import React from "react";
import victoryBg from "../assets/background/victory_sunrise.png";
import "./game-screen.css"; // reuse styles

export default function VictoryScreen({ onBackToTitle }) {
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
          onClick={onBackToTitle}
          style={{ marginTop: "20px" }}
        >
          Back to Title
        </button>
      </div>
    </div>
  );
}
