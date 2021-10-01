// coloring the background //
function backgroundColoring(color) {
  document.querySelector("section.chess").style.background = color;
}
backgroundColoring("#123456");
//  //

// coloring the board //
function boardColoring(color1, color2) {
  let index = 0;

  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      if (index % 2 == 0) {
        if (i % 2 == 0) {
          areas[index].style.background = color1;
        } else {
          areas[index].style.background = color2;
        }
      } else {
        if (i % 2 == 0) {
          areas[index].style.background = color2;
        } else {
          areas[index].style.background = color1;
        }
      }
      index++;
    }
  }
}
boardColoring("black", "darkRed");
//  //

// coloring the graves //
function graveColoring(color) {
  document.querySelector("section.chess .white-grave").style.background = color;
  document.querySelector("section.chess .black-grave").style.background = color;
}
graveColoring("gray");
//  //

// set the setting color buttons //
let backgroundColors = ["#123456", "gray", "black", "brown"];
let boardColors = [
  ["black", "darkRed"],
  ["#da7502", "#ffb969"],
  ["gray", "#000"],
  ["orange", "purple"],
];
let graveColors = ["gray", "black", "darkRed", "darkblue"];
//  //

// set the setting color buttons //
const backgroundColorButtons = document.querySelectorAll(
  "section.chess .setting .backgroundBox .colors div"
);
const boardColorButtons = document.querySelectorAll(
  "section.chess .setting .boardBox .colors div"
);
const graveColorButtons = document.querySelectorAll(
  "section.chess .setting .graveBox .colors div"
);

backgroundColorButtons.forEach((obj, index) => {
  obj.addEventListener("click", (e) => {
    backgroundColorButtons.forEach((o) => {
      o.style.borderColor = "#000";
    });
    e.target.style.borderColor = "#fff";

    backgroundColoring(backgroundColors[index]);
  });
});

boardColorButtons.forEach((obj, index) => {
  obj.addEventListener("click", (e) => {
    boardColorButtons.forEach((o) => {
      o.style.borderColor = "#000";
    });
    e.target.style.borderColor = "#fff";

    boardColoring(boardColors[index][0], boardColors[index][1]);
  });
});

graveColorButtons.forEach((obj, index) => {
  obj.addEventListener("click", (e) => {
    graveColorButtons.forEach((o) => {
      o.style.borderColor = "#000";
    });
    e.target.style.borderColor = "#fff";

    graveColoring(graveColors[index]);
  });
});

//  //

// set the turn time //
const turnTimeObj = document.querySelectorAll(
  "section.chess .setting .turnTime .timeBox input"
);

const whiteTime = document.querySelector(
  "section.chess .container .white-time"
);
const blackTime = document.querySelector(
  "section.chess .container .black-time"
);

let totalMin = 1;
let totalSec = 30;

let restMin = totalMin;
let restSec = totalSec;
let direction = -1;

let currentTurn = "white";

setInterval(() => {
  let team = situation.split(" ")[0];

  if (currentTurn != team) {
    // get the turn time //
    totalMin = parseInt(turnTimeObj[0].value);
    totalSec = parseInt(turnTimeObj[1].value);

    if (totalMin < 0) {
      totalMin = 1;
    } else if (totalMin >= 0);
    else {
      totalMin = 1;
    }

    if (totalSec < 0) {
      totalSec = 30;
    } else if (totalSec >= 0);
    else {
      totalSec = 30;
    }
    // //

    restMin = totalMin;
    restSec = totalSec;

    let m = totalMin;
    let s = totalSec;
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }

    let lastTurn = currentTurn;

    setTimeout(() => {
      if (lastTurn == "white") {
        whiteTime.innerHTML = m + ":" + s;
        whiteTime.style.color = "#fff";
      } else if (lastTurn == "black") {
        blackTime.innerHTML = m + ":" + s;
        blackTime.style.color = "#fff";
      }
    }, 5000);

    currentTurn = team;
    direction = -1;
  } else {
    restSec += direction;

    if (restSec < 0) {
      restMin--;
      restSec = 59;
    } else if (restSec >= 60) {
      restMin++;
      restSec = 0;
    }

    if (restMin < 0) {
      restMin = 0;
      restSec = 0;
      direction = 1;

      if (currentTurn == "white") {
        whiteTime.style.color = "red";
      } else if (currentTurn == "black") {
        blackTime.style.color = "red";
      }
    }
  }

  let m = restMin;
  let s = restSec;

  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }

  if (currentTurn == "white") {
    whiteTime.innerHTML = m + ":" + s;
  } else if (currentTurn == "black") {
    blackTime.innerHTML = m + ":" + s;
  }
}, 1000);
//  //

// setting window /
const settingWindow = document.querySelector("section.chess .setting");
const settingButton = document.querySelector(
  "section.chess .setting button.open"
);

settingButton.addEventListener("click", (e) => {
  settingWindow.classList.toggle("active");
});
//  //

//  //
const bootSettingWindow = document.querySelector("section.chess .setting.boot");
const bootSettingButton = document.querySelector(
  "section.chess .setting.boot button.open"
);

bootSettingButton.addEventListener("click", (e) => {
  bootSettingWindow.classList.toggle("active");
});
//  //

//////////////////////////////////////////////////////////////////////

//  //
board.addEventListener("click", (e) => {
  settingWindow.classList.remove("active");
  bootSettingWindow.classList.remove("active");
});

//////////////////////////////////////////////////////////////

// set the boot team //
function bootTeamStyle(button) {
  document
    .querySelectorAll(".chess .setting.boot .bootActive .b")
    .forEach((obj) => {
      obj.style.border = "3px solid darkblue";
    });
  button.style.border = "3px solid lime";
}

let bootTeam = "none";
document
  .querySelector(".chess .setting.boot .bootActive .off")
  .addEventListener("click", (e) => {
    bootTeam = "none";
    bootTeamStyle(e.target);
  });
document
  .querySelector(".chess .setting.boot .bootActive .white")
  .addEventListener("click", (e) => {
    bootTeam = "white";
    bootTeamStyle(e.target);

    if (situation.split(" ")[0] == "white") {
      hideScoops();

      setTimeout(() => {
        bootTurn();
      }, 1000);

      situation = "black turn";
    }
  });
document
  .querySelector(".chess .setting.boot .bootActive .black")
  .addEventListener("click", (e) => {
    bootTeam = "black";
    bootTeamStyle(e.target);

    if (situation.split(" ")[0] == "black") {
      hideScoops();

      setTimeout(() => {
        bootTurn();
      }, 1000);
    }

    situation = "white turn";
  });
//  //

// formatting //
const formatCode = document.querySelector(".chess .setting.boot .code");
const activeFormateButton = document.querySelector(
  ".chess .setting.boot button.active"
);
const defaultButton = document.querySelector(
  ".chess .setting.boot button.default"
);

activeFormateButton.addEventListener("click", () => {
  let code = formatCode.value;
  resetBiases(code);
});

defaultButton.addEventListener("click", () => {
  resetBiases(defaultPositions);
});
//  //
