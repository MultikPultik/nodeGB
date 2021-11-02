const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const yargs = require("yargs");

const options = yargs.usage("Usage: -p <path>").option({
  p: {
    alias: "path",
    describe: "Path to directory",
    type: "string",
    default: process.cwd(),
    demandOption: false,
  },
  t: {
    alias: "text",
    describe: "Text of find",
    type: "string",
    default: "",
    demandOption: false,
  },
}).argv;

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

  inquirer
    .prompt([
      {
        name: "destination",
        type: "list",
        message: "Choosed:",
        choices: itemsDir.map((item) => ({
          name: item.isDir() ? `[${item.fileName}]` : item.fileName,
          value: item,
        })),
      },
    ])
    .then((answer) => {
      if (answer.destination.isDir()) {
        run(answer.destination.path);
      } else {
        const regex = new RegExp(options.t, "gi");
        console.log(options.t);
        fs.readFile(answer.destination.path, "utf8", (err, data) => {
          if (options.t) {
            if (regex.test(data)) {
              console.log(
                `Текст "${options.t}" в файле "${answer.destination.fileName}" найден`
              );
            } else {
              console.log(
                `Текст "${options.t}" в файле "${answer.destination.fileName}" не найден`
              );
            }
          } else {
            console.log(data);
          }
        });
      }
    });
};

run(options.path);
