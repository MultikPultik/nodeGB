const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 5000;

class listDir {
  constructor(path, fileName) {
    this.path = path;
    this.fileName = fileName;
  }
  isDir() {
    return fs.lstatSync(this.path).isDirectory();
  }
}

//Сортирует список, сначало директории, потом файлы.
function getListSort(curDir, itemsList) {
  const dir = [];
  const file = [];

  itemsList.forEach((item) => {
    const fullPath = path.join(curDir, item);
    if (fullPath !== undefined) {
      try {
        fs.lstatSync(fullPath).isDirectory() ? dir.push(item) : file.push(item);
      } catch (err) {
        //console.log(err);
      }
    }
  });
  return [...dir, ...file];
}

const run = (dir) => {
  const list = getListSort(dir, fs.readdirSync(dir));
  const itemsDir = list.map(
    (nameItem) => new listDir(path.join(dir, nameItem), nameItem)
  );

  const toDest = itemsDir.map((item) => {
    return item.isDir() ? `[${item.fileName}]` : item.fileName;
  });

  //console.log(toDest);
  //console.log(cb(toDest));
  return toDest;
};
//run(__dirname);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.use(cors());
app.use("/", express.static(path.join(__dirname, "/../client/dist/")));

app.get("/root", (req, res) => {
  res.json(run(__dirname, res.json));
  //console.log(req.path);
});

app.get(/\/root\/.*/, (req, res) => {
  // fs.readdir(path.join(__dirname, "." || "node_modules"), (err, data) => {
  //   //console.log(data);
  //   // res.send(JSON.stringify(data));
  //   res.json(data);
  // });
  //console.log(req.url.replace("/root/", ""));
  res.send(fs.readFileSync(path.join(__dirname, req.url.replace("/root", ""))))
  
  //console.log(req.url);
});

// app.use(function(req, res, next) {
//   res.status(404).send('Sorry cant find that!');
// });

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send("Something broke!"); 
