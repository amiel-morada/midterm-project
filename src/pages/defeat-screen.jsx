import React from "react";
import defeatBg from "../assets/background/defeat_dark.png";
import "./game-screen.css"; // reuse styles

export default function DefeatScreen({ onBackToTitle }) {
  return (
    <div
      className="game-screen"
      style={{ backgroundImage: `url(${defeatBg})`, backgroundSize: "cover" }}
    >
      <div style={{ textAlign: "center", color: "white", marginTop: "150px" }}>
        <h1>Defeat...</h1>
        <p>Your HP dropped to zero. Better luck next time!</p>
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
