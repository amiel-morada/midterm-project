import React, { useState } from "react";
import TitleScreen from "./pages/TitleScreen";
import GameScreen from "./pages/GameScreen";
import { GameProvider } from "./contexts/GameContext";

export default function App() {
  const [screen, setScreen] = useState("title");

  return (
    <GameProvider>
      {screen === "title" && (
        <TitleScreen onStartGame={() => setScreen("game")} />
      )}
      {screen === "game" && (
        <GameScreen onBackToTitle={() => setScreen("title")} />
      )}
    </GameProvider>
  );
}
