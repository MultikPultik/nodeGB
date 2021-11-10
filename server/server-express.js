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
        console.log(err);
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
    return item.isDir()
      ? { link: item.fileName, isDir: true }
      : { link: item.fileName, isDir: false };
  });

  return toDest;
};

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.use(cors());

//эта роутинг на готовый бандл
app.use("/", express.static(path.join(__dirname, "/../client/dist/")));

//это роутинг для клиента запущенного на другом тестовом сервере
app.get("/root", cors(), (req, res) => {
  res.json(run(__dirname, res.json));
});

app.get(/\/root\/.*/, cors(), (req, res) => {
  let link = req.url.replace(/^.*root\//, "");

  if (fs.lstatSync(path.join(__dirname, link)).isDirectory()) {
    res.json(run(path.join(__dirname, link)));
  } else {
    res.send(fs.readFileSync(path.join(__dirname, link)));
  }
});
