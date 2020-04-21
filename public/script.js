const socket = io();
const messageContainer = document.getElementById("message-container");
const roomContainer = document.getElementById("room-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

if (messageForm != null) {
  const name = prompt("What is your name?");
  appendMessageUser("You joined");
  socket.emit("new-user", roomName, name);

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessageUser(`You: ${message}`);
    socket.emit("send-chat-message", roomName, message);
    messageInput.value = "";
  });
}

socket.on("room-created", (room) => {
  const roomElement = document.createElement("div");
  roomElement.innerText = room;
  const roomLink = document.createElement("a");
  roomLink.href = `/${room}`;
  roomLink.innerText = "join";
  roomContainer.append(roomElement);
  roomContainer.append(roomLink);
});

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  const par = document.createElement("p");
  par.innerText = message;
  messageElement.appendChild(par);
  messageContainer.append(messageElement);
  messageContainer.append(createTime());
  updateScroll();
}

function appendMessageUser(message) {
  const messageElement = document.createElement("div");
  messageElement.style = "margin-left:auto";

  const par = document.createElement("p");
  par.innerText = message;
  messageElement.appendChild(par);
  messageContainer.append(messageElement);

  const time = createTime();
  time.style = "margin-left:auto";
  messageContainer.append(time);

  updateScroll();
}

function createTime() {
  const timeElement = document.createElement("span");
  timeElement.innerText = getDate();
  return timeElement;
}
function getDate() {
  const today = new Date();
  const h = addZero(today.getHours());
  const m = addZero(today.getMinutes());
  const time = h + ":" + m;
  return time;
}

function addZero(element) {
  if (element < 10) {
    element = "0" + element;
  }
  return element;
}

function updateScroll() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
