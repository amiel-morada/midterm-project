import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Exported directly so TitleScreen can import
export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [currentNode, setCurrentNode] = useState("start");
  const [inventory, setInventory] = useState([]);
  const [hp, setHp] = useState(100);
  const [isGameEnded, setIsGameEnded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      try {
        const { node, inv, health, ended } = JSON.parse(saved);
        setCurrentNode(node || "start");
        setInventory(inv || []);
        setHp(health ?? 100);
        setIsGameEnded(ended || false);
      } catch {
        startFresh();
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "aswangSave",
      JSON.stringify({
        node: currentNode,
        inv: inventory,
        health: hp,
        ended: isGameEnded,
      })
    );
  }, [currentNode, inventory, hp, isGameEnded]);

  const startFresh = () => {
    setCurrentNode("start");
    setInventory([]);
    setHp(100);
    setIsGameEnded(false);
  };

  const resetGame = () => {
    localStorage.removeItem("aswangSave");
    startFresh();
  };

  const startNewGame = () => {
    resetGame();
  };

  const continueGame = () => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      try {
        const { node, inv, health, ended } = JSON.parse(saved);
        setCurrentNode(node || "start");
        setInventory(inv || []);
        setHp(health ?? 100);
        setIsGameEnded(ended || false);
      } catch {
        startFresh();
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentNode,
        setCurrentNode,
        inventory,
        setInventory,
        hp,
        setHp,
        isGameEnded,
        setIsGameEnded,
        resetGame,
        startNewGame,
        continueGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
