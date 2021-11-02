const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname + "/../client/tree-project/dist/",
  "index.html"
);
//const filePath = __dirname + '/../client/tree-project/dist/';
//const readStream = fs.createReadStream(filePath);

const http = require("http");
http
  .createServer(function (request, response) {
    console.log(`Заголовки запроса: \n${JSON.stringify(request.headers)}\n`);
    response.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile(filePath, (err, data) => {
      if (request.url.endsWith(".html")) {
        response.writeHeader(200, {
          "Content-Type": "text/html",
        });
      }

      if (request.url.endsWith(".css")) {
        response.writeHeader(200, {
          "Content-Type": "text/css",
        });
      }

      // if (request.url.endsWith(".js")) {
      //   response.writeHeader(200, {
      //     "Content-Type": "application/javascript",
      //   });
      // }

      response.write(data);
      response.end();
    });
    //readStream.pipe(response)
  })
  .listen(5555, () => console.log("Сервер запущен на порте 5555"));

// const server = http.createServer((req, res) => {
//     // console.log(`Worker ${process.pid} handling request`);
//     // res.writeHead(200, {
//     //     'Content-Type': 'text/html'
//     // });
//     // readStream.pipe(res);

//     setTimeout(() => {
//         console.log(`Worker ${process.pid} handling request`);
//         res.writeHead(200, {
//             'Content-Type': 'text/html'
//         });
//         readStream.pipe(res);
//     }, 5000);
// });

// console.log(`Worker ${process.pid} is running`);
// server.listen(5555);
