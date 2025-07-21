/** @format */

let socket = null;
import { getDeviceId } from "./getDeviceId";

export function connectWebSocket(user, onMessage) {
  socket = new WebSocket("ws://localhost:3000");
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
