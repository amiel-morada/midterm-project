import React, { useState, useEffect } from "react";
import "../pages/TitleScreen.css";

export default function TitleModal({ 
  isVisible, 
  onConfirm, 
  onCancel, 
  hasProgress 
}) {
  const [playerName, setPlayerName] = useState("");

  // If there's existing progress and no playerName saved, default to "Hunter"
  useEffect(() => {
    if (hasProgress && !playerName) {
      setPlayerName("Hunter");
    }
  }, [hasProgress, playerName]);

  if (!isVisible) return null; // hide modal if not visible

  const handleConfirm = () => {
    if (!playerName.trim()) {
      alert("Please enter a name before starting a new game.");
      return;
    }
    onConfirm(playerName);
  };

  return (
    <div className="overlay">
      <div className="confirm-popup">
        {hasProgress ? (
          <>
            <p>
              Are you sure you want to start a new game? Current progress will
              be lost if you proceed.
            </p>
            <label className="name-label">
              Enter New Player Name:
              <input
                type="text"
                className="name-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>
          </>
        ) : (
          <>
            <p>Enter your player name to begin:</p>
            <label className="name-label">
              <input
                type="text"
                className="name-input"
                placeholder="Enter Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>
          </>
        )}

        <div className="confirm-buttons">
          <button
            type="button"
            className="menu-button confirm-button"
            onClick={handleConfirm}
          >
            {hasProgress ? "Yes" : "Start"}
          </button>
          <button
            type="button"
            className="menu-button confirm-button"
            onClick={onCancel}
          >
            {hasProgress ? "No" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}