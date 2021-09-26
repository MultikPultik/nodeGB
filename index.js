let colors = require("colors");

let start = +process.argv[2];
let end = +process.argv[3];

colors.setTheme({
  first: "green",
  second: "yellow",
  third: "red",
});

function simpleNumber(start, end) {
  const number = [];

  for (let i = start; i <= end; i++) {
    let flag = true;
    for (let j = 2; j < i; j++) {
      if (i % j == 0) {
        flag = false;
        break;
      }
    }
    if (flag === true) {
      number.push(i);
    }
  }
  return number;
}

if (Number.isInteger(start) && Number.isInteger(end)) {
  if (simpleNumber(start, end).length) {
    let i = 0;
    //for
    simpleNumber(start, end).forEach((el) => {
      if (i === 0) {
        console.log(colors.first(el));
      }
      if (i === 1) {
        console.log(colors.second(el));
      }
      if (i === 2) {
        console.log(colors.third(el));
      }
      i++;
      if (i > 2) {
        i = 0;
      }
    });
  } else {
    console.log("No prime numbers".red);
  }
} else {
  console.log("Arguments is not number");
}
