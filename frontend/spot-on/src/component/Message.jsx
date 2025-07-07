/** @format */
import React from "react";
import "../styles/Modal.css";
import { useEffect } from "react";
const Message = ({ message, setIsVisible }) => {
  const duration = 3000;
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default Message;
