const io = require("socket.io");
const fs = require("fs");
const http = require("http");
const path = require("path");

// const app = http.createServer((request, response) => {
//   if (request.method === "GET") {
//     const filePath = path.join(__dirname, "../client/index.html");

//     readStream = fs.createReadStream(filePath);
//     readStream.pipe(response);
//   } else if (request.method === "POST") {
//     let data = "";

//     request.on("data", (chunk) => {
//       data += chunk;
//     });
//     request.on("end", () => {
//       const parsedData = JSON.parse(data);

//       console.log(parsedData);
//       // response.writeHead(200, { "Content-Type": "json" });
//       response.end(data);
//     });
//   } else {
//     response.statusCode = 405;
//     response.end();
//   }
// });

const app = http.createServer(function (request, response) {
  console.log('request ', request.url);

  let filePath = path.join(__dirname, "../client");
  const dir = "../client";

  filePath = '.' + request.url;
    if (filePath == './') {
        filePath = path.join(__dirname, dir, "./index.html");
      } else {
        filePath = path.join(__dirname, dir, request.url);
    }
console.log("filePath - ", filePath);
  var extname = String(path.extname(filePath)).toLowerCase();
  console.log('extname - ', extname);
  var mimeTypes = {  
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm'
  };

  var contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, function(error, content) {
      if (error) {
          if(error.code == 'ENOENT') {
              fs.readFile('./404.html', function(error, content) {
                  response.writeHead(404, { 'Content-Type': 'text/html' });
                  response.end(content, 'utf-8');
              });
          }
          else {
              response.writeHead(500);
              response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
          }
      }
      else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
      }
  });

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

  if (findUserIndex(socket.id) === -1) {
    addUser(socket.id);
    console.log(users);
  }

  socket.on("connected", () => {
    socket.emit("SERVER_MSG", {
      msg: `User${findUserIndex(socket.id)} connected`,
      user: `User${findUserIndex(socket.id)}`,
    });
  });

  socket.on("disconnect", () => {
    console.log("socket id - ", socket.id, "disconnected");
  });

  socket.broadcast.emit("NEW_CONN_EVENT", {
    msg: `User${findUserIndex(socket.id)} connected`,
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
