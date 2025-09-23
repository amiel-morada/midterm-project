import React, { useState, useEffect } from "react";
import storyData from "../assets/story.json";
import "./game-screen.css";
import GameButtons from "../components/game-buttons.jsx";
import GameTextContainer from "../components/game-text-container.jsx";

// Import all background images
import sanGubat from "../assets/background/san_gubat.png";
import altar from "../assets/background/altar.png";
import townHall from "../assets/background/town_hall.png";
import oldChurch from "../assets/background/old_church.png";
import bellTower from "../assets/background/bell_tower.png";
import riceField from "../assets/background/rice_field.png";
import thicket from "../assets/background/thicket.png";
import baleteTree from "../assets/background/balete_tree.png";
import victorySunrise from "../assets/background/victory_sunrise.png";
import defeatDark from "../assets/background/defeat_dark.png";

// Map story nodes to imported images
const bgMap = {
  start: sanGubat,
  askAlbularyo: altar,
  askCaptain: townHall,
  oldChurch_entry: oldChurch,
  bellTower: bellTower,
  altar: altar,
  riceFields_entry: riceField,
  investigateTiyanak: thicket,
  tiyanakDamage: thicket,
  baleteTree_approach: baleteTree,
  finalFight_direct: baleteTree,
  finalFight_search: baleteTree,
  goodEnding: victorySunrise,
  badEnding_noSalt: defeatDark,
  gameOver_hp: defeatDark,
};

export default function GameScreen({ onBackToTitle }) {
  const [currentNode, setCurrentNode] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hp, setHp] = useState(100);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const [pendingItem, setPendingItem] = useState(null);
  const [pendingDamage, setPendingDamage] = useState(null);

  // Dynamic background
  const [background, setBackground] = useState(null);
  const [fadeBg, setFadeBg] = useState(false);

  // Load saved progress
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
    setShowButtons(false);
  }, []);

  // Update background when currentNode changes
  useEffect(() => {
    if (!currentNode) return;
    const nextBg = bgMap[currentNode] || sanGubat;

    setFadeBg(true);
    const timer = setTimeout(() => {
      setBackground(nextBg);
      setFadeBg(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentNode]);

  // Save progress
  useEffect(() => {
    if (currentNode && !isGameEnded) {
      localStorage.setItem(
        "aswangSave",
        JSON.stringify({ node: currentNode, inv: inventory, health: hp })
      );
    }
  }, [currentNode, inventory, hp, isGameEnded]);

  const handleChoice = (choice) => {
    setShowButtons(false);

    setTimeout(() => {
      const nextNode = storyData[choice.to];

      if (nextNode.onArrive) {
        if (nextNode.onArrive.addItem) setPendingItem(nextNode.onArrive.addItem);
        if (nextNode.onArrive.takeDamage) setPendingDamage(nextNode.onArrive.takeDamage);
      }

      if (nextNode.isEnding) {
        setIsGameEnded(true);
        localStorage.removeItem("aswangSave");
      }

      setCurrentNode(choice.to);
    }, 600);
  };

  if (!currentNode) return null;
  const node = storyData[currentNode];

  return (
    <div className="game-screen">
      {/* Background */}
      <div
        className={`background ${fadeBg ? "fade" : ""}`}
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* Back button */}
      <button className="back-button" onClick={onBackToTitle}>
        Back to Title
      </button>

      {/* Top row: HP & inventory */}
      <div className="top-row">
        <div className="stats-row">
          <span className="hp-label">HP:</span>
          <span
            className={`hp-value ${hp >= 60 ? "hp-green" : hp >= 40 ? "hp-orange" : "hp-red"}`}
          >
            {hp}
          </span>
          <span className="inventory-label">Inventory:</span>
          <span className="inventory-value">{inventory.join(", ") || "None"}</span>
        </div>
      </div>

      {/* Text container */}
      <GameTextContainer
        text={node.text}
        speaker={node.speaker}
        onFinished={() => {
          if (pendingItem) {
            setInventory((prev) => [...new Set([...prev, pendingItem])]);
            setPendingItem(null);
          }
          if (pendingDamage) {
            setHp((prev) => {
              const newHp = prev - pendingDamage;
              if (newHp <= 0) {
                setCurrentNode("gameOver_hp");
                setIsGameEnded(true);
              }
              return newHp > 0 ? newHp : 0;
            });
            setPendingDamage(null);
          }
          setShowButtons(true);
        }}
        speed={30}
      />

      {/* Choice buttons */}
      <GameButtons
        choices={node.choices || []}
        inventory={inventory}
        handleChoice={handleChoice}
        show={showButtons}
      />
    </div>
  );
}
