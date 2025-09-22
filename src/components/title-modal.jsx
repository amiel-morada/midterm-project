import React from "react";
import "../pages/title-screen.css";

export default function TitleModal({ isVisible, onConfirm, onCancel }) {
  if (!isVisible) return null; // hide modal if not visible

  return (
    <div className="overlay">
      <div className="confirm-popup">
        <p>
          Are you sure to start a new game? Current progress will be lost if you proceed.
        </p>
        <div className="popup-buttons">
          <button className="menu-button" onClick={onConfirm}>
            Yes
          </button>
          <button className="menu-button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
