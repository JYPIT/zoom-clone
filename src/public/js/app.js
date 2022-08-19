const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form#roomForm");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nameForm.querySelector("input");
  socket.emit("nickname", input.value);
  input.value = "";
  form.addEventListener("submit", handleRoomSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

const nameForm = welcome.querySelector("form#name");
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} Joined`);
});

socket.on("bye", (left) => {
  addMessage(`${left} Left`);
});

socket.on("new_message", addMessage);
