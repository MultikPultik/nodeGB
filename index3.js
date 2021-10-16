const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const yargs = require("yargs");
//const { Console } = require("console");

// const options = yargs.usage("Usage: -p <path>").option("p", {
//   alias: "path",
//   describe: "Path to file",
//   type: "string",
//   demandOption: true,
// }).argv;

// const isFile = (fileName) => {
//   let result = true;

//   try {
//     result = fs.lstatSync(fileName).isFile();
//   } catch (err) {
//     result = null;
//   }
//   return result;
// };

class listDir {
  constructor(path, fileName) {
    this.path = path;
    this.fileName = fileName;
  }
  getListDir() {
    const list = fs.readdirSync(this.path);
    return list.map((nameItem) => {
      return { name: nameItem, value: { nameFile: nameItem, path: this.path } };
    });
  }
}
//const list = fs.readdirSync(options.path)
//.filter((data) => isFile(options.path + "/" + data));
function getList(path) {
  const dir = [];
  const file = [];

  const list = fs.readdirSync(path);

  list.forEach((data) => {
    const res = isFile(path + "/" + data);

    if (res !== null) {
      res ? file.push(data) : dir.push(`[${data}]`);
      // res
      //   ? file.push({ name: data, isFile: true })
      //   : dir.push({ name: `[DIR] ${data}`, isFile: false });
    }
  });
  return [...dir, ...file];
}

//console.log(getList());

//list = getList(options.path);
list = new listDir(__dirname, 0);

const run = async () => {
  const nn = await inquirer.prompt([
    {
      name: "fileName",
      type: "list",
      message: "Choosed file:",
      choices: list.getListDir(),
    },
  ]);
  // .then((answer) => {
  //   //console.log(answer.fileName.match(new RegExp('[^[].*[^]]')));
  //   //console.log(answer); 
  //   // const filePath = path.join(options.path + "/", answer.fileName);
  //   // fs.readFile(filePath, "utf8", (err, data) => {
  //   //   console.log(data);
  //   // });
  // });

  console.log(nn);
};

run();
