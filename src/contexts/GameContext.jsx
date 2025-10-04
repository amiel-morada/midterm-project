import React, { createContext, useContext, useState, useEffect } from "react";

export const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [currentNode, setCurrentNode] = useState(null); // null until loaded
  const [inventory, setInventory] = useState([]);
  const [hp, setHp] = useState(100);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [playerName, setPlayerName] = useState(""); // ✅ Track player's name
  const [loaded, setLoaded] = useState(false); // prevent flashing before load

  // ✅ Initialize from localStorage or start fresh
  useEffect(() => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      try {
        const { node, inv, health, ended, playerName: savedName } = JSON.parse(saved);
        setCurrentNode(node || "start");
        setInventory(inv?.length ? inv : ["Bolo"]);
        setHp(health ?? 100);
        setIsGameEnded(!!ended);
        setPlayerName(savedName || "Hunter"); // fallback name
      } catch {
        startFresh();
      }
    } else {
      startFresh();
    }
    setLoaded(true);
  }, []);

  // ✅ Persist state to localStorage on changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      "aswangSave",
      JSON.stringify({
        node: currentNode,
        inv: inventory,
        health: hp,
        ended: isGameEnded,
        playerName, // ✅ Save name too
      })
    );
  }, [currentNode, inventory, hp, isGameEnded, playerName, loaded]);

  // ✅ Helpers
  const startFresh = () => {
    setCurrentNode("start");
    setInventory(["Bolo"]);
    setHp(100);
    setIsGameEnded(false);
    setPlayerName("Hunter"); // default
  };

  const resetGame = () => {
    localStorage.removeItem("aswangSave");
    startFresh();
  };

  const startNewGame = (name) => {
    resetGame();
    setPlayerName(name || "Hunter"); // ✅ Store entered name
  };

  const continueGame = () => {
    const saved = localStorage.getItem("aswangSave");
    if (saved) {
      try {
        const { node, inv, health, ended, playerName: savedName } = JSON.parse(saved);
        setCurrentNode(node || "start");
        setInventory(inv?.length ? inv : ["Bolo"]);
        setHp(health ?? 100);
        setIsGameEnded(!!ended);
        setPlayerName(savedName || "Hunter");
      } catch {
        startFresh();
      }
    } else {
      startFresh();
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
        playerName, // ✅ Expose name to game-container
        setPlayerName,
        resetGame,
        startNewGame,
        continueGame,
      }}
    >
      {loaded && children}
    </GameContext.Provider>
  );
};
