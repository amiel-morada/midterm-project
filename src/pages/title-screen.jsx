import React, { useState, useEffect } from "react";
import "./title-screen.css";
import TitleButtons from "../components/title-buttons.jsx"; // Button component
import TitleModal from "../components/title-modal.jsx";     // Modal component (separate file)

export default function TitleScreen({ onNewGame, onContinue }) {
  const [hasSave, setHasSave] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Check if there is a saved game
  useEffect(() => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      const { node } = JSON.parse(saved);
      setHasSave(true);
      setCurrentNode(node);
    }
  }, []);

  // Handle New Game click
  const handleNewGame = () => {
    if (hasSave && currentNode !== "start") {
      // Show modal if player has progressed
      setShowModal(true);
    } else {
      // Start new game immediately if no progress
      onNewGame();
    }
  };

  // Confirm modal
  const handleConfirmYes = () => {
    setShowModal(false);
    localStorage.removeItem("aswangSave"); // clear progress
    onNewGame();
  };

  const handleConfirmNo = () => {
    setShowModal(false);
  };

  // Letter arrays for ASWANG / HUNTER logo
  const aswang = "ASWANG".split("");
  const hunter = "HUNTER".split("");

  return (
    <div className="title-container">
      <h1 className="title">
        {/* ASWANG */}
        <span className="aswang">
          {aswang.map((ch, i) => {
            const scale = 1 - i * 0.08;
            return (
              <span
                key={`a-${i}`}
                className="letter aswang-letter animate-draw"
                style={{
                  transform: `scale(${scale})`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
        <br />
        {/* HUNTER */}
        <span className="hunter">
          {hunter.map((ch, i) => {
            const scale = 0.6 + i * 0.08;
            return (
              <span
                key={`h-${i}`}
                className="letter hunter-letter animate-draw"
                style={{
                  transform: `scale(${scale})`,
                  animationDelay: `${(aswang.length + i) * 0.2}s`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      </h1>

      {/* Buttons */}
      <TitleButtons
        hasSave={hasSave}
        currentNode={currentNode}
        onNewGame={handleNewGame} // updated to trigger modal
        onContinue={onContinue}
      />

      {/* Modal */}
      <TitleModal
        isVisible={showModal}
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
      />
    </div>
  );
}
