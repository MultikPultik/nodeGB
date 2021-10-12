const fs = require("fs");
const path = require("path");
const readline = require("readline");
const inquirer = require("inquirer");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// rl.question("Please enter the path to the file: ", function (inputedPath) {
//   const filePath = path.join(__dirname, inputedPath);
//   fs.readFile(filePath, "utf8", (err, data) => {
//     console.log(data);
//     rl.close();
//   });
// });

// rl.on("close", function () {
//   process.exit(0);
// });

const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};
const list = fs.readdirSync(__dirname).filter(isFile);

inquirer
  .prompt([
    {
      name: "fileName",
      type: "list",
      message: "Choose file:",
      choices: list,
    },
  ])
  .then((answer) => {
    //console.log(answer.fileName);
    const filePath = path.join(__dirname, answer.fileName);
    fs.readFile(filePath, "utf8", (err, data) => {
      console.log(data);
    });
  });

// const fs = require("fs");
// const rl = require("readline");

// const readStream = fs.createReadStream("./access.log", "utf-8");
// const writeStream89 = fs.createWriteStream(
//   "p:/%89.123.1.41%_requests.log",
//   "utf-8"
// );
// const writeStream34 = fs.createWriteStream(
//   "p:/%34.48.240.111%_requests.log",
//   "utf-8"
// );

// const expr89 = /89\.123\.1\.41.*/g;
// const expr34 = /34\.48\.240\.111.*/g;

// let readline = rl.createInterface(readStream);
// let record1 = 0;
// let record2 = 0;

// readline.on("line", (line) => {
//   const match89 = line.match(expr89);
//   const match34 = line.match(expr34);

//   if (match89) {
//     record1++;
//     writeStream89.write(`Record ${record1} - ` + match89.toString() + "\n");
//   }
//   if (match34) {
//     record2++;
//     writeStream34.write(`Record ${record2} - ` + match34.toString() + "\n");
//   }
// });
