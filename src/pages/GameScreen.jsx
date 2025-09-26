import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../contexts/GameContext.jsx";
import storyData from "../assets/story.json";
import "./GameScreen.css";
import GameButtons from "../components/game-buttons.jsx";
import GameTextContainer from "../components/game-text-container.jsx";
import VictoryScreen from "./VictoryScreen";
import DefeatScreen from "./DefeatScreen";

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
import edgeTown from "../assets/background/edge_town.png";

// Map story nodes to imported images
const bgMap = {
  start: sanGubat,
  askAlbularyo: edgeTown,
  askCaptain: townHall,
  oldChurch_entry: oldChurch,
  bellTower: bellTower,
  useGarlicOnWakwak: bellTower,
  fightWakwakNoGarlic: bellTower,
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
  const {
    currentNode,
    setCurrentNode,
    inventory,
    setInventory,
    hp,
    setHp,
    isGameEnded,
    setIsGameEnded,
  } = useGame();

  const [showButtons, setShowButtons] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [pendingDamage, setPendingDamage] = useState(null);

  const [background, setBackground] = useState(bgMap.start);
  const [fadeBg, setFadeBg] = useState(false);

  // 🔴 Flash state
  const [flash, setFlash] = useState(false);
  const prevHpRef = useRef(hp);

  // Update background on node change
  useEffect(() => {
    if (!currentNode) return;
    const nextBg = bgMap[currentNode] || bgMap.start;
    setFadeBg(true);
    const timer = setTimeout(() => {
      setBackground(nextBg);
      setFadeBg(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentNode]);

  // ✅ Apply onArrive effects also when continuing a saved game
  useEffect(() => {
    if (!currentNode) return;

    const node = storyData[currentNode];
    if (node?.onArrive) {
      if (node.onArrive.addItem) setPendingItem(node.onArrive.addItem);
      if (node.onArrive.takeDamage) setPendingDamage(node.onArrive.takeDamage);
    }
  }, [currentNode]);

  const handleChoice = (choice) => {
    setShowButtons(false);
    setTimeout(() => {
      const nextNode = storyData[choice.to];
      if (nextNode.onArrive) {
        if (nextNode.onArrive.addItem) setPendingItem(nextNode.onArrive.addItem);
        if (nextNode.onArrive.takeDamage) setPendingDamage(nextNode.onArrive.takeDamage);
      }
      setCurrentNode(choice.to);
    }, 600);
  };

  // Reset pending states when going back to title
  const handleBackToTitle = () => {
    setPendingItem(null);
    setPendingDamage(null);
    onBackToTitle();
  };

  // 🔴 Trigger flash only when HP decreases
  useEffect(() => {
    if (hp < prevHpRef.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(timer);
    }
    prevHpRef.current = hp; // update stored HP after comparison
  }, [hp]);

  if (!currentNode) return <div className="loading">Loading game...</div>;

  const node = storyData[currentNode];

  if (isGameEnded) {
    if (currentNode === "goodEnding") return <VictoryScreen onBackToTitle={onBackToTitle} />;
    return <DefeatScreen onBackToTitle={onBackToTitle} />;
  }

  // Function to calculate gradient color
  const getHpColor = (hp) => {
    const green = Math.round((hp / 100) * 255);
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <>
      <div
        className={`background ${fadeBg ? "fade" : ""}`}
        style={{ backgroundImage: `url(${background})` }}
      />

      <div className="game-screen" style={{ backgroundColor: "rgba(0,0,0,0.3)", position: "relative" }}>
        <button className="back-button" onClick={handleBackToTitle}>
          Back to Title
        </button>

        <div className="top-row">
          <div className="stats-row">
            <span className="hp-label">HP:</span>
            <span className="hp-value" style={{ "--hp-color": getHpColor(hp) }}>
              {hp}/100
            </span>
            <span className="inventory-label">Inventory:</span>
            <span className="inventory-value">{inventory.join(", ") || "None"}</span>
          </div>
        </div>

        <GameTextContainer
          text={node.text}
          speaker={node.speaker}
          onFinished={() => {
            // ✅ Apply pending item safely
            if (pendingItem) {
              setInventory((prev) => {
                const updated = [...new Set([...prev, pendingItem])];
                console.log("Adding item:", pendingItem, "Inventory now:", updated);
                return updated;
              });
              setPendingItem(null);
            }

            // ✅ Delay damage so text finishes first
            if (pendingDamage) {
              setTimeout(() => {
                setHp((prev) => {
                  const newHp = prev - pendingDamage;
                  if (newHp <= 0) {
                    setCurrentNode("gameOver_hp");
                    setIsGameEnded(true);
                  }
                  return newHp > 0 ? newHp : 0;
                });
                setPendingDamage(null);
              }, 400); // wait 0.4s after text is done
            }

            if (node.isEnding) setIsGameEnded(true);
            else setShowButtons(true);
          }}
          speed={30}
        />

        <GameButtons
          choices={node.choices || []}
          inventory={inventory}
          handleChoice={handleChoice}
          show={showButtons}
        />

        {/* 🔴 Red Flash Overlay */}
        {flash && <div key={Date.now()} className="red-flash" />}
      </div>
    </>
  );
}
