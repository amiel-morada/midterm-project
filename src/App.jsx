import React, { useState } from "react";
import TitleScreen from "./pages/title-screen";
import GameScreen from "./pages/game-screen";

export default function App() {
  const [screen, setScreen] = useState("title");

  const handleNewGame = () => {
    // Clear save and go to GameScreen fresh
    localStorage.removeItem("aswangSave");
    setScreen("game");
  };

  const handleContinue = () => {
    // Continue from last save
    setScreen("game");
  };

  return (
    <>
      {screen === "title" && (
        <TitleScreen onNewGame={handleNewGame} onContinue={handleContinue} />
      )}
      {screen === "game" && <GameScreen onBackToTitle={() => setScreen("title")} />}
    </>
  );
}
