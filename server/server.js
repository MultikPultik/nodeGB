const io = require("socket.io");
const fs = require("fs");
const http = require("http");
const path = require("path");

const app = http.createServer((request, response) => {
  if (request.method === "GET") {
    const filePath = path.join(__dirname, "../client/index.html");

    readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
  } else if (request.method === "POST") {
    let data = "";

    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", () => {
      const parsedData = JSON.parse(data);

      console.log(parsedData);
      // response.writeHead(200, { "Content-Type": "json" });
      response.end(data);
    });
  } else {
    response.statusCode = 405;
    response.end();
  }
});

const users = [];
const socket = io(app);

function findUserIndex(userID) {
  return users.findIndex((el) => {
    return el.ID === userID;
  });
}

function addUser(userID) {
  users.push({ ID: userID, user: `User${users.length}` });
}

socket.on("connection", function (socket) {
  console.log("New connection");
  
  if(findUserIndex(socket.id) === -1){
    addUser(socket.id);
    console.log(users);
  }

  socket.on("connected", ()=>{
    socket.emit("SERVER_MSG", {
      msg: `User${findUserIndex(socket.id)} connected`,
      user: `User${findUserIndex(socket.id)}`,
    });
  })
   
  socket.on("disconnect", () => {
    console.log("socket id - ", socket.id, "disconnected");
  });

  socket.broadcast.emit("NEW_CONN_EVENT", {
    msg:  `User${findUserIndex(socket.id)} connected`,
    user: `User${findUserIndex(socket.id)}`,
  }); 

  socket.on("CLIENT_MSG", (data) => {
    // users.push({id, nik})
    // console.log(users);
    socket.broadcast.emit("SERVER_MSG", {
      msg: data.msg,
      user: `User${findUserIndex(socket.id)}`,
    });
    socket.emit("SERVER_MSG", {
      msg: data.msg,
      user: `User${findUserIndex(socket.id)}`,
    });
  }); 
});

app.listen(3000, () => console.log("Сервер запущен на порте 3000"));
