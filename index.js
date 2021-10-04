const fs = require("fs");
const rl = require("readline");

const readStream = fs.createReadStream("./access.log", "utf-8");
const writeStream89 = fs.createWriteStream(
  "p:/%89.123.1.41%_requests.log",
  "utf-8"
);
const writeStream34 = fs.createWriteStream(
  "p:/%34.48.240.111%_requests.log",
  "utf-8"
);

const expr89 = /89\.123\.1\.41.*/g;
const expr34 = /34\.48\.240\.111.*/g;

let readline = rl.createInterface(readStream);
let record1 = 0;
let record2 = 0;

readline.on("line", (line) => {
  const match89 = line.match(expr89);
  const match34 = line.match(expr34);

  if (match89) {
    record1++;
    writeStream89.write(`Record ${record1} - ` + match89.toString() + "\n");
  }
  if (match34) {
    record2++;
    writeStream34.write(`Record ${record2} - ` + match34.toString() + "\n");
  }
});
