/** @format */

let socket = null;
export function connectWebSocket(onMessage) {
  socket = new WebSocket("ws://localhost:3000");
  socket.onopen = () => {};
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  socket.onclose = () => {};
}

export function sendWebSocket(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
