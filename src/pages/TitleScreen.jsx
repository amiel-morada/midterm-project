// src/screens/TitleScreen.jsx
import React, { useState, useEffect, useContext } from "react";
import "./TitleScreen.css";
import TitleButtons from "../components/title-buttons.jsx";
import TitleModal from "../components/title-modal.jsx";
import { GameContext } from "../contexts/GameContext.jsx";
import titleBg from "../assets/background/title-bg.png";

export default function TitleScreen({ onStartGame }) {
  const { startNewGame, continueGame } = useContext(GameContext);

  const [hasSave, setHasSave] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Check save data
  useEffect(() => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      const { node } = JSON.parse(saved);
      setCurrentNode(node);

      // Only count as "valid save" if node exists AND has started progress
      if (node && node !== "start") {
        setHasSave(true);
      }
    }
  }, []);

  // ✅ Start new game (open modal if needed)
  const handleNewGame = () => {
    setShowModal(true); // Always open modal for name entry
  };

  // ✅ Confirm new game (with name)
  const handleConfirmYes = (playerName) => {
    setShowModal(false);

    // Save with node=start and playerName
    localStorage.setItem(
      "aswangSave",
      JSON.stringify({ node: "start", playerName })
    );

    startNewGame(playerName);
    onStartGame();
  };

  // ✅ Continue existing save
  const handleContinue = () => {
    continueGame();
    onStartGame();
  };

  const aswang = "ASWANG".split("");
  const hunter = "HUNTER".split("");

  return (
    <div
      className="title-container"
      style={{ backgroundImage: `url(${titleBg})` }}
    >
      <h1 className="title">
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

      {/* Modal for new game confirmation + name entry */}
      <TitleModal
        isVisible={showModal}
        hasProgress={hasSave && currentNode !== "start"}
        onConfirm={handleConfirmYes}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}