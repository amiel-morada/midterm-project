import React, { useState, useEffect } from "react";
import storyData from "../assets/story.json";
import "./game-screen.css";
import GameButtons from "../components/game-buttons.jsx";
import GameTextContainer from "../components/game-text-container.jsx";

export default function GameScreen({ onBackToTitle }) {
  const [currentNode, setCurrentNode] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hp, setHp] = useState(100);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Load save when component mounts
  useEffect(() => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      const { node, inv, health } = JSON.parse(saved);
      setCurrentNode(node);
      setInventory(inv);
      setHp(health);
    } else {
      setCurrentNode("start");
      setInventory([]);
      setHp(100);
    }
    setShowButtons(false); // ensure buttons hidden initially
  }, []);

  // Save progress whenever state changes
  useEffect(() => {
    if (currentNode && !isGameEnded) {
      localStorage.setItem(
        "aswangSave",
        JSON.stringify({ node: currentNode, inv: inventory, health: hp })
      );
    }
  }, [currentNode, inventory, hp, isGameEnded]);

  const handleChoice = (choice) => {
    const nextNode = storyData[choice.to];

    if (nextNode.onArrive) {
      if (nextNode.onArrive.addItem) {
        setInventory((prev) => [...new Set([...prev, nextNode.onArrive.addItem])]);
      }
      if (nextNode.onArrive.takeDamage) {
        setHp((prev) => {
          const newHp = prev - nextNode.onArrive.takeDamage;
          if (newHp <= 0) {
            setCurrentNode("gameOver_hp");
            setIsGameEnded(true);
          }
          return newHp > 0 ? newHp : 0;
        });
      }
    }

    if (nextNode.isEnding) {
      setIsGameEnded(true);
      localStorage.removeItem("aswangSave"); // reset progress automatically
    }

    setCurrentNode(choice.to);
    setShowButtons(false); // hide buttons until text finishes
  };

  if (!currentNode) return null;

  const node = storyData[currentNode];

  return (
    <div className="game-screen">
      {/* Top-right Back button */}
      <button className="back-button" onClick={onBackToTitle}>
        Back to Title
      </button>

      {/* Top row: stats */}
      <div className="top-row">
        <div className="stats-column">
          <div>HP: {hp}</div>
          <div>Inventory: {inventory.join(", ") || "None"}</div>
        </div>
      </div>

      {/* Text container */}
      <GameTextContainer
        text={node.text}
        onFinished={() => setShowButtons(true)}
      />

      {/* Buttons appear only after text finishes and animate */}
      <GameButtons
        choices={node.choices || []}
        inventory={inventory}
        handleChoice={handleChoice}
        show={showButtons} // this prop controls the CSS fade-in animation
      />
    </div>
  );
}
