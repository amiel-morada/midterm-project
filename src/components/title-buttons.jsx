import React from "react";
import "../pages/TitleScreen.css";

export default function TitleButtons({ hasSave, currentNode, onNewGame, onContinue }) {
  const handleNewGame = () => {
    // Call the onNewGame prop directly; modal logic will be handled in TitleScreen
    onNewGame();
  };

  return (
    <div className="button-container">
      <button className="menu-button" onClick={handleNewGame}>
        New Game
      </button>

      <button
        className="menu-button"
        onClick={onContinue}
        disabled={!hasSave || currentNode === "start"} // disable if no progress
      >
        Continue
      </button>
    </div>
  );
}
