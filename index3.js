const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const yargs = require("yargs");
//const { Console } = require("console");

const options = yargs.usage("Usage: -p <path>").option("p", {
  alias: "path",
  describe: "Path to file",
  type: "string",
  demandOption: true,
}).argv;

const isFile = (fileName) => {
  let result = true;

  try {
    result = fs.lstatSync(fileName).isFile();
  } catch (err) {
    result = null;
  }
  return result;
};

//const list = fs.readdirSync(options.path)
//.filter((data) => isFile(options.path + "/" + data));
function getList() {
  const dir = [];
  const file = [];

  const list = fs.readdirSync(options.path);

  list.forEach((data) => {
    const res = isFile(options.path + "/" + data);

    if (res !== null) {
      res ? file.push(data) : dir.push(`[DIR] ${data}`);
    }
  });
  return [...dir, ...file];
}

console.log(getList());

// inquirer
//   .prompt([
//     {
//       name: "fileName",
//       type: "list",
//       message: "Choose file:",
//       choices: list,
//     },
//   ])
//   .then((answer) => {
//     const filePath = path.join(options.path + "/", answer.fileName);
//     fs.readFile(filePath, "utf8", (err, data) => {
//       console.log(data);
//     });
//   });
