// src/components/game-text-container.jsx
import React, { useState, useEffect, useRef } from "react";

/**
 * Props:
 * - text: string[] | {speaker: string, text: string}[] (array of lines or objects with speaker)
 * - onFinished: () => void
 * - speed: number (ms per character, default 30)
 */
export default function GameTextContainer({ text, onFinished, speed = 30 }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  const timeoutRef = useRef(null);
  const charIndexRef = useRef(0);
  const allFinishedRef = useRef(false);

  // Normalize lines
  const lines = Array.isArray(text) ? text : [text ?? ""];
  const currentLine = lines[lineIndex] ?? "";
  
  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const step = () => {
    if (!currentLine) return;

    // Determine line text and speaker
    const lineText = typeof currentLine === "string" ? currentLine : currentLine.text;
    const speaker = typeof currentLine === "string" ? null : currentLine.speaker;

    if (charIndexRef.current >= lineText.length) {
      if (lineIndex >= lines.length - 1 && !allFinishedRef.current) {
        allFinishedRef.current = true;
        onFinished?.();
      }
      return;
    }

    // Update speaker banner
    setCurrentSpeaker(speaker);

    const ch = lineText[charIndexRef.current];
    setDisplayedText((prev) => prev + ch);

    const delay = ch === "." ? 400 : speed;
    charIndexRef.current += 1;
    timeoutRef.current = setTimeout(step, delay);
  };

  // Reset on text change
  useEffect(() => {
    clearTimer();
    setLineIndex(0);
    charIndexRef.current = 0;
    setDisplayedText("");
    setCurrentSpeaker(null);
    allFinishedRef.current = false;

    if (lines.length > 0 && (typeof lines[0] === "string" ? lines[0].length : lines[0].text.length) > 0) {
      timeoutRef.current = setTimeout(step, 50);
    } else if (lines.length <= 1) {
      allFinishedRef.current = true;
      onFinished?.();
    }

    return () => clearTimer();
  }, [text]);

  // Advance with Spacebar
  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      e.stopPropagation();

      const lineText = typeof currentLine === "string" ? currentLine : currentLine.text;

      if (charIndexRef.current < lineText.length) {
        clearTimer();
        charIndexRef.current = lineText.length;
        setDisplayedText(lineText);
        setCurrentSpeaker(typeof currentLine === "string" ? null : currentLine.speaker);

        if (lineIndex >= lines.length - 1 && !allFinishedRef.current) {
          allFinishedRef.current = true;
          onFinished?.();
        }
        return;
      }

      if (lineIndex < lines.length - 1) {
        setLineIndex((li) => li + 1);
        charIndexRef.current = 0;
        setDisplayedText("");
        setCurrentSpeaker(null);
        allFinishedRef.current = false;
      }
    };

    window.addEventListener("keydown", handleSpace, true);
    return () => window.removeEventListener("keydown", handleSpace, true);
  }, [currentLine, lineIndex, lines, onFinished]);

  // Step whenever lineIndex changes
  useEffect(() => {
    clearTimer();
    charIndexRef.current = 0;
    setDisplayedText("");
    setCurrentSpeaker(null);

    if (currentLine && (typeof currentLine === "string" ? currentLine.length : currentLine.text.length) > 0) {
      timeoutRef.current = setTimeout(step, 50);
    } else if (lineIndex >= lines.length - 1 && !allFinishedRef.current) {
      allFinishedRef.current = true;
      onFinished?.();
    }

    return () => clearTimer();
  }, [lineIndex]);

  return (
    <div className="text-container-wrapper">
      {/* Only show banner if there is a speaker */}
      {currentSpeaker && <div className="speaker-banner">{currentSpeaker}</div>}

      <div className="text-container">
        <div className="text-content">
          {currentSpeaker ? <em>&quot;{displayedText}&quot;</em> : displayedText}
        </div>
        <div className="text-hint">[Press spacebar to continue and speed up.]</div>
      </div>
    </div>
  );
}
