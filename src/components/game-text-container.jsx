import React, { useState, useEffect, useRef } from "react";

export default function GameTextContainer({ text, onFinished, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [finished, setFinished] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  const animateText = () => {
    if (indexRef.current >= text.length) {
      setFinished(true);
      onFinished?.(); // notify parent to show buttons
      return;
    }

    const char = text[indexRef.current];
    setDisplayedText((prev) => prev + char);

    // pause longer for periods
    const delay = char === "." ? 400 : speed;

    indexRef.current += 1;
    timeoutRef.current = setTimeout(animateText, delay);
  };

  // Start animation whenever text changes
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    indexRef.current = 0;
    setDisplayedText("");
    setFinished(false);
    animateText();

    return () => clearTimeout(timeoutRef.current);
  }, [text]);

  // Spacebar to finish animation immediately
  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === "Space") {
        e.preventDefault();    // prevent scrolling
        e.stopPropagation();   // prevent triggering buttons
        clearTimeout(timeoutRef.current); // stop ongoing animation
        setDisplayedText(text);          // reveal full text
        setFinished(true);
        onFinished?.();                  // show buttons
      }
    };

    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, [text, onFinished]);

  return <div className="text-container">{displayedText}</div>;
}
