/** @format */

let socket = null;
import { getDeviceId } from "./getDeviceId";

export function connectWebSocket(user, onMessage) {
  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
  socket = new WebSocket(WS_URL);
  socket.onopen = () => {
    const joinMsg = {
      type: "SESSION_JOIN",
      userId: user.id,
      deviceId: getDeviceId(),
    };
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(joinMsg));
    } else {
      const interval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(joinMsg));
          clearInterval(interval);
        }
      }, 100);
    }
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  window.socketInstance = socket;
  socket.onclose = () => {};
}

export function sendWebSocket(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
