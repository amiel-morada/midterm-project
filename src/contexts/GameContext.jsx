import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Exported directly so TitleScreen can import
export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [currentNode, setCurrentNode] = useState("start");
  const [inventory, setInventory] = useState(["Bolo"]); // ✅ default item
  const [hp, setHp] = useState(100);
  const [isGameEnded, setIsGameEnded] = useState(false);

  // Load save on mount
  useEffect(() => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      try {
        const { node, inv, health, ended } = JSON.parse(saved);
        setCurrentNode(node || "start");
        setInventory(inv?.length ? inv : ["Bolo"]); // ✅ ensure Bolo exists
        setHp(health ?? 100);
        setIsGameEnded(ended || false);
      } catch {
        startFresh();
      }
    }
  }, []);

  // Save progress to localStorage
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

  // ✅ Always start with clean state
  const startFresh = () => {
    setCurrentNode("start");
    setInventory(["Bolo"]);
    setHp(100);
    setIsGameEnded(false);
  };

  // ✅ Hard reset (used when Back to Title → New Game)
  const resetGame = () => {
    localStorage.removeItem("aswangSave");
    startFresh();
  };

  // ✅ Explicit new game
  const startNewGame = () => {
    resetGame();
  };

  // ✅ Load save state (Continue option)
const continueGame = () => {
  const saved = localStorage.getItem("aswangSave");
  if (saved) {
    try {
      const { node, inv, health, ended } = JSON.parse(saved);

      // ✅ Force refresh of node by resetting first
      setCurrentNode(null);
      setTimeout(() => {
        setCurrentNode(node || "start");
      }, 0);

      setInventory([...(inv || [])]);
      setHp(health ?? 100);
      setIsGameEnded(!!ended);
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
