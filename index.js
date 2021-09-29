const moment = require("moment");
require("moment-precise-range-plugin");

console.clear();

const countDownTimer = (endTime) => {
  const now = moment();
  let result = null;
  const format = "HH-DD-MM-YYYY";

  if (moment(endTime, format).isValid()) {
    if (moment(endTime, format).diff(moment()) >= 0) {
      let timerID = setInterval(() => {
        console.clear();
        result = moment().preciseDiff(moment(endTime, format));
        if (result !== "") {
          console.log(result);
        } else {
          console.log("Timer finished");
          clearTimeout(timerID);
        }
      }, 1000);
    } else {
      console.log("The time must be more current.");
    }
  } else {
    console.log("Time or Date isn`t correct");
  }
};

countDownTimer(process.argv[2]);
