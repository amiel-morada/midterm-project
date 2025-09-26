import React, { useState, useEffect, useContext } from "react";
import "./TitleScreen.css";
import TitleButtons from "../components/title-buttons.jsx";
import TitleModal from "../components/title-modal.jsx";
import { GameContext } from "../contexts/GameContext.jsx";

// Import background image
import titleBg from "../assets/background/title-bg.png";

export default function TitleScreen({ onStartGame }) {
  const { startNewGame, continueGame } = useContext(GameContext);

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
      setShowModal(true);
    } else {
      startNewGame();
      onStartGame();
    }
  };

  const handleConfirmYes = () => {
    setShowModal(false);
    startNewGame();
    onStartGame();
  };

  const handleConfirmNo = () => setShowModal(false);

  // Handle Continue click
  const handleContinue = () => {
    continueGame();
    onStartGame();
  };

  const aswang = "ASWANG".split("");
  const hunter = "HUNTER".split("");

  return (
    <div
      className="title-container"
      style={{
        backgroundImage: `url(${titleBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h1 className="title">
        {/* ASWANG */}
        <span className="aswang">
          {aswang.map((ch, i) => (
            <span
              key={`a-${i}`}
              className="letter aswang-letter animate-draw"
              style={{
                transform: `scale(${1 - i * 0.08})`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </span>
        <br />
        {/* HUNTER */}
        <span className="hunter">
          {hunter.map((ch, i) => (
            <span
              key={`h-${i}`}
              className="letter hunter-letter animate-draw"
              style={{
                transform: `scale(${0.6 + i * 0.08})`,
                animationDelay: `${(aswang.length + i) * 0.2}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      </h1>

      {/* Buttons */}
      <TitleButtons
        hasSave={hasSave}
        currentNode={currentNode}
        onNewGame={handleNewGame}
        onContinue={handleContinue}
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
