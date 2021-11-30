const socket = io("localhost:3000");
const addMessage = (data) => {
  document.getElementById("messages").insertAdjacentHTML(
    "beforeend",
    `<div  class="card" style="width: 18rem">
            <div class="card-body">
              <h5 class="card-title">${data.user}</h5>
              <p class="card-text">
                ${data.msg}
              </p>
            </div>
          </div>`
  );
  document.getElementById("messages").append(document.createElement("br"));
};

socket.on("connect", function () {
  console.log("Successful connected to server");
  socket.emit("connected");
});
socket.on("SERVER_MSG", function (data) {
  console.log(data);
  document.getElementById("user").innerText = `${data.user}`;
  addMessage(data);
});

socket.on("NEW_CONN_EVENT", function (data) {
  console.log(data);
  addMessage(data);
});

document.getElementById("send").onclick = function () {
  socket.emit("CLIENT_MSG", {
    msg: document.getElementById("input").value,
  });
  document.getElementById("input").value = "";
};
