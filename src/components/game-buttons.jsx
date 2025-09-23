import React from "react";
import "../pages/game-screen.css";

export default function GameButtons({ choices, inventory, handleChoice, show }) {
  const handleAnimatedChoice = (e, choice) => {
    const button = e.currentTarget;

    // add chosen animation class
    button.classList.add("chosen");

    // after animation ends, continue to next node
    setTimeout(() => {
      handleChoice(choice);
      button.classList.remove("chosen"); // cleanup class
    }, 600); // duration matches CSS animation
  };

  return (
    <div className={`buttons-column ${show ? "show" : ""}`}>
      {choices.map((choice, index) => {
        if (choice.requires && !inventory.includes(choice.requires)) return null;
        if (choice.hideIf && inventory.includes(choice.hideIf)) return null;

        return (
          <button
            key={index}
            className="game-button"
            onClick={(e) => handleAnimatedChoice(e, choice)}
          >
            {choice.text}
          </button>
        );
      })}
    </div>
  );
}
