const http = require("http");
const path = require("path");
const url = require("url");
const static = require("node-static");

/* Creating server */
const file = new static.Server(path.join(__dirname, "../", "client", "dist"));
const server = http.createServer(function (req, res) {
  const { query } = url.parse(req.url, true);

  req.addListener('end',()=>{
    file.serve(req, res);
    console.log("Метод GET", query);

  }).resume()
  
  
  //console.log(params);
  //file.serve(req, res);

  if (req.method === "GET") {
    console.log("Метод GET", query);
    //res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(query))
    //res.end(JSON.stringify(query || 'error'));
     
  }

  // if (req.method === "POST") {
  //   let data = " ";

  //   req.on("data", (chunk) => {
  //     data += chunk;
  //     console.log(data);
  //   });

  //   req.on("end", () => {
  //     console.log(data);
  //     res.setHeader('Content-Type', 'application/json'); 
  //     res.end(data);
      
  //     // const parsedData = JSON.parse(data);
  //     // console.log(data);
  //     // console.log(parsedData);
  //     // res.setHeader("Content-Type", "application/json");
  //     //res.end(data);
  //   });
  // } else {
  //   //res.end();  
  // }
});

server.listen(8000, ()=>console.log('Server started at port 8000'));
