const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "./login.html";
}

const socket = io("http://localhost:3000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("Conectado ao servidor:", socket.id);
});

function joinRoom() {
  const roomName = document.getElementById("roomInput").value;
  socket.emit("joinRoom", { roomName });
  document.getElementById("group").textContent = `Chat Messages ${roomName}`;
}

function send() {
  const content = document.getElementById("messageInput").value;
  const roomName = document.getElementById("roomInput").value;
  socket.emit("message", { roomName, content });
  document.getElementById("messageInput").value = "";
}

document.getElementById("joinBtn").addEventListener("click", joinRoom);
document.getElementById("sendBtn").addEventListener("click", send);

socket.on("message", (msg) => {
  const li = document.createElement("li");
  li.textContent = `[${msg.roomName}] ${msg.username}: ${msg.content} (${msg.createdAt})`;
  document.getElementById("messages").appendChild(li);
});

socket.on("system", () => {
  const li = document.createElement("li");
  li.textContent = `A user joined the room`;
  li.style.color = "gray";
  document.getElementById("messages").appendChild(li);
});
