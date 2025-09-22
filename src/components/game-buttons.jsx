import React from "react";
import "../pages/game-screen.css";

export default function GameButtons({ choices, inventory, handleChoice, show }) {
  return (
    <div className={`buttons-column ${show ? "show" : ""}`}>
      {choices.map((choice, index) => {
        // Skip choices based on requirements or hidden flags
        if (choice.requires && !inventory.includes(choice.requires)) return null;
        if (choice.hideIf && inventory.includes(choice.hideIf)) return null;

        return (
          <button
            key={index}
            className="game-button"
            onClick={() => handleChoice(choice)}
          >
            {choice.text}
          </button>
        );
      })}
    </div>
  );
}
