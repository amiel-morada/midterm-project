import React, { createContext, useContext, useState, useEffect } from "react";

export const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
const [currentNode, setCurrentNode] = useState(null); // null until loaded
const [inventory, setInventory] = useState([]);
const [hp, setHp] = useState(100);
const [isGameEnded, setIsGameEnded] = useState(false);
const [loaded, setLoaded] = useState(false); // prevent flashing before load

// ✅ Initialize from localStorage or start fresh
useEffect(() => {
const saved = localStorage.getItem("aswangSave");
if (saved) {
try {
const { node, inv, health, ended } = JSON.parse(saved);
setCurrentNode(node || "start");
setInventory(inv?.length ? inv : ["Bolo"]);
setHp(health ?? 100);
setIsGameEnded(!!ended);
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
})
);
}, [currentNode, inventory, hp, isGameEnded, loaded]);

// ✅ Helpers
const startFresh = () => {
setCurrentNode("start");
setInventory(["Bolo"]);
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
setInventory(inv?.length ? inv : ["Bolo"]);
setHp(health ?? 100);
setIsGameEnded(!!ended);
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
resetGame,
startNewGame,
continueGame,
}}
>
{loaded && children}
</GameContext.Provider>
);
};
