console.log("new version");

//  //
function isBelong(ele, list) {
  list.forEach((obj) => {
    if (ele != obj) {
      return false;
    }
  });
  return true;
}

const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const numbers = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8 };
let checkAvailable = false;

//  //
let situation = "white turn";
let biasSelected = "white ";

//  //
const board = document.querySelector(".chess .container .board");
const areas = document.querySelectorAll(".chess .container .board .imgBox");
//  //

//  //
let biases = [];
let boardInfo;
let defaultPositions =
  "bs21/bs22/bs23/bs24/bs25/bs26/bs27/bs28/ws71/ws72/ws73/ws74/ws75/ws76/ws77/ws78/bc11/bc18/wc81/wc88/bn12/bn17/wn82/wn87/br13/br16/wr83/wr86/bk15/bq14/wk85/wq84";

//  //

let lastHuntPlace;
let lastKing;

// check animation //
function checkMateAlarmAnimation(mode, winner = "none") {
  const checkMateAlarm = document.querySelector(
    "section.chess .container .check-alarm.check-mate"
  );

  if (mode == "check mate") {
    checkMateAlarm.innerHTML = "<p>Check Mate</p>";
    checkMateAlarm.style.color = "red";

    setTimeout(() => {
      checkMateAlarm.transition = "0s";
      board.style.opacity = "0.25";
    }, 100);
    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(-300%) scale(0.4)";
    }, 300);
    setTimeout(() => {
      checkMateAlarm.style.transition = "0.5s";
    }, 500);
    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(0) scale(1)";
    }, 600);
    setTimeout(() => {
      checkMateAlarm.style.opacity = "0";
    }, 1700);
    setTimeout(() => {
      checkMateAlarm.innerHTML = "<p>" + winner + " Win</p>";
    }, 2500);
    setTimeout(() => {
      checkMateAlarm.style.opacity = "1";
    }, 2600);
    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(-1000%) ";
      board.style.opacity = "1";
    }, 8000);

    setTimeout(() => {
      checkMateAlarm.style.transition = "0s";
    }, 12000);
    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(0) scale(0)";
    }, 12100);
    setTimeout(() => {
      checkMateAlarm.style.transition = "0.5s";
    }, 6500);
  } else if (mode == "draw") {
    checkMateAlarm.innerHTML = "<p>Draw</p>";
    checkMateAlarm.style.color = "orange";

    setTimeout(() => {
      checkMateAlarm.transition = "0s";
      board.style.opacity = "0.25";
    }, 100);
    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(-300%) scale(0.4)";
    }, 300);
    setTimeout(() => {
      checkMateAlarm.style.transition = "0.5s";
    }, 500);
    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(0) scale(1)";
    }, 600);

    setTimeout(() => {
      checkMateAlarm.style.transform = "translateY(0) scale(0)";
      board.style.opacity = "1";
    }, 3000);
  }
  //  //
}
function checkAlarmAnimation() {
  const checkAlarm = document.querySelector(
    "section.chess .container .check-alarm.check"
  );

  setTimeout(() => {
    checkAlarm.style.transform = "scale(1)";
    board.style.opacity = "0.25";
  }, 100);
  setTimeout(() => {
    checkAlarm.style.transition = "1s cubic-bezier(0.42,-0.89, 0.25, 1)";
  }, 2000);
  setTimeout(() => {
    checkAlarm.style.transform = "scale(1) translateX(200%)";
  }, 2100);
  setTimeout(() => {
    checkAlarm.style.transition = "0s";
    board.style.opacity = "1";
  }, 3500);
  setTimeout(() => {
    checkAlarm.style.transform = "scale(0)";
  }, 3600);
  setTimeout(() => {
    checkAlarm.style.transition = "0.5s";
  }, 4000);
  //  //
}
function checkTest(team) {
  // get the anime king //
  let animeKing;
  biases.forEach((obj) => {
    const animeTeam = obj.src.split("img/")[1].split("%20")[0];
    const animeType = obj.src.split("img/")[1].split("%20")[1].split(".")[0];

    if (animeTeam != team && animeType == "king") {
      animeKing = obj;
      return;
    }
  });

  // get out if did not find king //
  if (animeKing == undefined) {
    return;
  }
  //  //

  // testing if the anime king is available //
  boardInfo.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column["team"] == team) {
        let moves = findMovesAvailable(
          i + 1,
          j + 1,
          column["team"],
          column["type"],
          boardInfo
        );

        moves.forEach((move) => {
          if (move["target"] == "king") {
            checkAvailable = true;

            // active the animation //
            checkAlarmAnimation();
            //  //

            areas[i * 8 + j].style.animation = "hunt-place 1s infinite";
            animeKing.classList.add("king-check");

            // prepare to remove the check //
            lastHuntPlace = areas[i * 8 + j];
            lastKing = animeKing;
            //  //

            return;
          }
        });
      }
      if (checkAvailable == true) {
        return;
      }
    });
  });
}
function removeCheck() {
  if (lastHuntPlace != undefined && lastKing != undefined) {
    checkAvailable = false;

    lastHuntPlace.style.animation = "none";
    lastKing.classList.remove("king-check");
  }
}
//  //
//  //
function biasClickEvent(e) {
  const team = e.target.src.split("img/")[1].split("%20")[0];
  const type = e.target.src.split("img/")[1].split("%20")[1].split(".")[0];

  const i = parseInt(e.target.style.gridArea[1]);
  const j = numbers[`${e.target.style.gridArea[0]}`];

  if (situation == "white select" || situation == "black select") {
    hideScoops();
    situation = situation.split("select")[0] + "turn";
  } else if (bootTeam == team) {
    return;
  } else if (situation == team + " turn") {
    situation = team + " select";
    biasSelected = e.target;

    let moves = findMovesAvailable(i, j, team, type, boardInfo);
    moves = findKingSafety(i, j, team, moves, boardInfo);

    moves.forEach((move) => {
      if (move["target"] == "none") {
        moveScoop[
          (move["move"][0] - 1) * 8 + move["move"][1] - 1
        ].style.transform = "scale(1)";
      } else {
        killScoop[
          (move["move"][0] - 1) * 8 + move["move"][1] - 1
        ].style.transform = "scale(1)";
      }
    });
  }
}
//  //
let biasesOnClick;
function resetBiases(positionsCode) {
  // is code valuable //
  let test = true;
  let index = 0;
  while (index < positionsCode.length) {
    if (
      isBelong(positionsCode[index], ["b", "w", "B", "W"]) &&
      isBelong(positionsCode[index + 1], [
        "c",
        "n",
        "r",
        "q",
        "k",
        "s",
        "C",
        "N",
        "R",
        "Q",
        "K",
        "S",
      ]) &&
      isBelong(positionsCode[index + 2], [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
      ]) &&
      isBelong(positionsCode[index + 3], [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
      ])
    ) {
      index += 5;
    } else {
      test = false;
      break;
    }
  }
  if (test == false) {
    return;
  }
  //  //

  // empty the board and graves //
  document.querySelector(".chess .white-grave").innerHTML = "";
  document.querySelector(".chess .black-grave").innerHTML = "";

  biases.forEach((obj) => {
    board.removeChild(obj);
  });
  //  //

  // reload the board info //
  boardInfo = [];
  for (let i = 0; i < 8; i++) {
    boardInfo.push([]);
    for (let j = 0; j < 8; j++) {
      boardInfo[i].push({ team: "none", type: "none" });
    }
  }
  //  //

  // set the biases //
  let newBias;
  index = 0;
  while (index < positionsCode.length) {
    let i = parseInt(positionsCode[index + 2]);
    let j = parseInt(positionsCode[index + 3]);

    let team;
    let type;

    // set the team //
    if (positionsCode[index] == "b" || positionsCode[index] == "B") {
      team = "black";
    } else if (positionsCode[index] == "w" || positionsCode[index] == "W") {
      team = "white";
    }
    //  //
    // set the type //
    if (positionsCode[index + 1] == "c" || positionsCode[index + 1] == "C") {
      type = "castle";
    } else if (
      positionsCode[index + 1] == "n" ||
      positionsCode[index + 1] == "N"
    ) {
      type = "knight";
    } else if (
      positionsCode[index + 1] == "r" ||
      positionsCode[index + 1] == "R"
    ) {
      type = "rook";
    } else if (
      positionsCode[index + 1] == "q" ||
      positionsCode[index + 1] == "Q"
    ) {
      type = "queen";
    } else if (
      positionsCode[index + 1] == "k" ||
      positionsCode[index + 1] == "K"
    ) {
      type = "king";
    } else if (
      positionsCode[index + 1] == "s" ||
      positionsCode[index + 1] == "S"
    ) {
      type = "soldier";
    }
    //  //

    // set the board info //
    boardInfo[i - 1][j - 1]["team"] = team;
    boardInfo[i - 1][j - 1]["type"] = type;
    //  //

    // add the bias //
    newBias = document.createElement("img");
    newBias.classList.add("bias");
    newBias.setAttribute("src", "img/" + team + " " + type + ".png");
    newBias.style.gridArea = letters[j - 1] + "" + i;
    board.appendChild(newBias);

    index += 5;
  }

  situation = "white turn";
  removeCheck();
  //  //

  biases = document.querySelectorAll(".chess .container .board .bias");

  // set the click event //
  biases.forEach((obj) => {
    obj.addEventListener("click", (e) => {
      biasClickEvent(e);
    });
  });
  //  //

  // simple filter //
  biases.forEach((obj) => {
    if (obj.src.split("img/")[1].split("%20")[0] == "black") {
      obj.style.filter =
        "drop-shadow(-1px -1px 0px #fff) drop-shadow(1px 1px 0px #fff)";
    }
  });
  //  //
}
//  //
resetBiases(defaultPositions);

// hide scoop on click area //
areas.forEach((obj) => {
  obj.addEventListener("click", (e) => {
    hideScoops();
  });
});
//  //

// get scoops //
const moveScoop = document.querySelectorAll(
  ".chess .container .board .imgBox img[src='img/scope1.png']"
);
const killScoop = document.querySelectorAll(
  ".chess .container .board .imgBox img[src='img/scope2.png']"
);
// hide animation //
function hideScoops() {
  for (let i = 0; i < 64; i++) {
    moveScoop[i].style.transform = "scale(0)";
    killScoop[i].style.transform = "scale(0)";
  }
}
// //

const castlingInfo = {
  white: {
    king: "did not moved",
    leftCastle: "did not moved",
    rightCastle: "did not moved",
  },
  black: {
    king: "did not moved",
    leftCastle: "did not moved",
    rightCastle: "did not moved",
  },
};
// //
//  //
function findMovesAvailable(i, j, team, type, boardInfo) {
  let movesAvailable = [];

  if (type == "soldier") {
    if (team == "white") {
      if (i > 1 && boardInfo[i - 1 - 1][j - 1]["team"] == "none") {
        movesAvailable.push({ move: [i - 1, j], target: "none" });

        if (i == 7 && boardInfo[i - 2 - 1][j - 1]["team"] == "none") {
          movesAvailable.push({ move: [i - 2, j], target: "none" });
        }
      }

      if (
        i > 1 &&
        j > 1 &&
        boardInfo[i - 1 - 1][j - 1 - 1]["team"] == "black"
      ) {
        movesAvailable.push({
          move: [i - 1, j - 1],
          target: boardInfo[i - 1 - 1][j - 1 - 1]["type"],
        });
      }
      if (
        i > 1 &&
        j < 8 &&
        boardInfo[i - 1 - 1][j + 1 - 1]["team"] == "black"
      ) {
        movesAvailable.push({
          move: [i - 1, j + 1],
          target: boardInfo[i - 1 - 1][j + 1 - 1]["type"],
        });
      }
    } else if (team == "black") {
      if (i < 8 && boardInfo[i + 1 - 1][j - 1]["team"] == "none") {
        movesAvailable.push({ move: [i + 1, j], target: "none" });

        if (i == 2 && boardInfo[i + 2 - 1][j - 1]["team"] == "none") {
          movesAvailable.push({ move: [i + 2, j], target: "none" });
        }
      }

      // show the killing scoops (black soldier)//
      if (
        i < 8 &&
        j > 1 &&
        boardInfo[i + 1 - 1][j - 1 - 1]["team"] == "white"
      ) {
        movesAvailable.push({
          move: [i + 1, j - 1],
          target: boardInfo[i + 1 - 1][j - 1 - 1]["type"],
        });
      }
      if (
        i < 8 &&
        j < 8 &&
        boardInfo[i + 1 - 1][j + 1 - 1]["team"] == "white"
      ) {
        movesAvailable.push({
          move: [i + 1, j + 1],
          target: boardInfo[i + 1 - 1][j + 1 - 1]["type"],
        });
      }
    }
  } else if (type == "castle") {
    // forward //
    for (let castleI = i - 1; castleI > i - 8; castleI--) {
      if (castleI < 1 || boardInfo[castleI - 1][j - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [castleI, j],
          target: boardInfo[castleI - 1][j - 1]["type"],
        });

        if (boardInfo[castleI - 1][j - 1]["type"] != "none") {
          break;
        }
      }
    }

    // backward //
    for (let castleI = i + 1; castleI < i + 8; castleI++) {
      if (castleI > 8 || boardInfo[castleI - 1][j - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [castleI, j],
          target: boardInfo[castleI - 1][j - 1]["type"],
        });

        if (boardInfo[castleI - 1][j - 1]["type"] != "none") {
          break;
        }
      }
    }

    // left //
    for (let castleJ = j - 1; castleJ > j - 8; castleJ--) {
      if (castleJ < 1 || boardInfo[i - 1][castleJ - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [i, castleJ],
          target: boardInfo[i - 1][castleJ - 1]["type"],
        });

        if (boardInfo[i - 1][castleJ - 1]["type"] != "none") {
          break;
        }
      }
    }

    // right //
    for (let castleJ = j + 1; castleJ < j + 8; castleJ++) {
      if (castleJ > 8 || boardInfo[i - 1][castleJ - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [i, castleJ],
          target: boardInfo[i - 1][castleJ - 1]["type"],
        });

        if (boardInfo[i - 1][castleJ - 1]["type"] != "none") {
          break;
        }
      }
    }
  } else if (type == "knight") {
    // top left //
    if (
      i - 2 >= 1 &&
      j - 1 >= 1 &&
      boardInfo[i - 2 - 1][j - 1 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i - 2, j - 1],
        target: boardInfo[i - 2 - 1][j - 1 - 1]["type"],
      });
    }

    // top right //
    if (
      i - 2 >= 1 &&
      j + 1 <= 8 &&
      boardInfo[i - 2 - 1][j + 1 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i - 2, j + 1],
        target: boardInfo[i - 2 - 1][j + 1 - 1]["type"],
      });
    }

    // bottom left //
    if (
      i + 2 <= 8 &&
      j - 1 >= 1 &&
      boardInfo[i + 2 - 1][j - 1 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i + 2, j - 1],
        target: boardInfo[i + 2 - 1][j - 1 - 1]["type"],
      });
    }

    // bottom right //
    if (
      i + 2 <= 8 &&
      j + 1 <= 8 &&
      boardInfo[i + 2 - 1][j + 1 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i + 2, j + 1],
        target: boardInfo[i + 2 - 1][j + 1 - 1]["type"],
      });
    }

    // left top //
    if (
      i - 1 >= 1 &&
      j - 2 >= 1 &&
      boardInfo[i - 1 - 1][j - 2 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i - 1, j - 2],
        target: boardInfo[i - 1 - 1][j - 2 - 1]["type"],
      });
    }

    // left bottom //
    if (
      i + 1 <= 8 &&
      j - 2 >= 1 &&
      boardInfo[i + 1 - 1][j - 2 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i + 1, j - 2],
        target: boardInfo[i + 1 - 1][j - 2 - 1]["type"],
      });
    }

    // right top //
    if (
      i - 1 >= 1 &&
      j + 2 <= 8 &&
      boardInfo[i - 1 - 1][j + 2 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i - 1, j + 2],
        target: boardInfo[i - 1 - 1][j + 2 - 1]["type"],
      });
    }

    // right bottom //
    if (
      i + 1 <= 8 &&
      j + 2 <= 8 &&
      boardInfo[i + 1 - 1][j + 2 - 1]["team"] != team
    ) {
      movesAvailable.push({
        move: [i + 1, j + 2],
        target: boardInfo[i + 1 - 1][j + 2 - 1]["type"],
      });
    }
  } else if (type == "rook") {
    let rookI;
    let rookJ;

    // top left //
    rookI = i;
    rookJ = j;
    while (rookI >= 1 && rookJ >= 1) {
      rookI--;
      rookJ--;

      if (
        rookI < 1 ||
        rookJ < 1 ||
        boardInfo[rookI - 1][rookJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [rookI, rookJ],
          target: boardInfo[rookI - 1][rookJ - 1]["type"],
        });

        if (boardInfo[rookI - 1][rookJ - 1]["type"] != "none") {
          break;
        }
      }
    }

    // top right //
    rookI = i;
    rookJ = j;
    while (rookI >= 1 && rookJ <= 8) {
      rookI--;
      rookJ++;

      if (
        rookI < 1 ||
        rookJ > 8 ||
        boardInfo[rookI - 1][rookJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [rookI, rookJ],
          target: boardInfo[rookI - 1][rookJ - 1]["type"],
        });

        if (boardInfo[rookI - 1][rookJ - 1]["type"] != "none") {
          break;
        }
      }
    }

    // bottom left //
    rookI = i;
    rookJ = j;
    while (rookI <= 8 && rookJ >= 1) {
      rookI++;
      rookJ--;

      if (
        rookI > 8 ||
        rookJ < 1 ||
        boardInfo[rookI - 1][rookJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [rookI, rookJ],
          target: boardInfo[rookI - 1][rookJ - 1]["type"],
        });

        if (boardInfo[rookI - 1][rookJ - 1]["type"] != "none") {
          break;
        }
      }
    }

    // bottom right //
    rookI = i;
    rookJ = j;
    while (rookI <= 8 && rookJ <= 8) {
      rookI++;
      rookJ++;

      if (
        rookI > 8 ||
        rookJ > 8 ||
        boardInfo[rookI - 1][rookJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [rookI, rookJ],
          target: boardInfo[rookI - 1][rookJ - 1]["type"],
        });

        if (boardInfo[rookI - 1][rookJ - 1]["type"] != "none") {
          break;
        }
      }
    }
  } else if (type == "queen") {
    let queenI;
    let queenJ;

    // rook move //

    // top left //
    queenI = i;
    queenJ = j;
    while (queenI >= 1 && queenJ >= 1) {
      queenI--;
      queenJ--;

      if (
        queenI < 1 ||
        queenJ < 1 ||
        boardInfo[queenI - 1][queenJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [queenI, queenJ],
          target: boardInfo[queenI - 1][queenJ - 1]["type"],
        });

        if (boardInfo[queenI - 1][queenJ - 1]["team"] != "none") {
          break;
        }
      }
    }

    // top right //
    queenI = i;
    queenJ = j;
    while (queenI >= 1 && queenJ <= 8) {
      queenI--;
      queenJ++;

      if (
        queenI < 1 ||
        queenJ > 8 ||
        boardInfo[queenI - 1][queenJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [queenI, queenJ],
          target: boardInfo[queenI - 1][queenJ - 1]["type"],
        });

        if (boardInfo[queenI - 1][queenJ - 1]["team"] != "none") {
          break;
        }
      }
    }

    // bottom left //
    queenI = i;
    queenJ = j;
    while (queenI < 8 && queenJ > 1) {
      queenI++;
      queenJ--;

      if (
        queenI > 8 ||
        queenJ < 1 ||
        boardInfo[queenI - 1][queenJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [queenI, queenJ],
          target: boardInfo[queenI - 1][queenJ - 1]["type"],
        });

        if (boardInfo[queenI - 1][queenJ - 1]["team"] != "none") {
          break;
        }
      }
    }

    // bottom right //
    queenI = i;
    queenJ = j;
    while (queenI <= 8 && queenJ <= 8) {
      queenI++;
      queenJ++;

      if (
        queenI > 8 ||
        queenJ > 8 ||
        boardInfo[queenI - 1][queenJ - 1]["team"] == team
      ) {
        break;
      } else {
        movesAvailable.push({
          move: [queenI, queenJ],
          target: boardInfo[queenI - 1][queenJ - 1]["type"],
        });

        if (boardInfo[queenI - 1][queenJ - 1]["team"] != "none") {
          break;
        }
      }
    }

    // castle move //

    // forward //
    for (queenI = i - 1; queenI > i - 8; queenI--) {
      if (queenI < 1 || boardInfo[queenI - 1][j - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [queenI, j],
          target: boardInfo[queenI - 1][j - 1]["type"],
        });

        if (boardInfo[queenI - 1][j - 1]["team"] != "none") {
          break;
        }
      }
    }

    // backward //
    for (queenI = i + 1; queenI < i + 8; queenI++) {
      if (queenI > 8 || boardInfo[queenI - 1][j - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [queenI, j],
          target: boardInfo[queenI - 1][j - 1]["type"],
        });

        if (boardInfo[queenI - 1][j - 1]["team"] != "none") {
          break;
        }
      }
    }

    // left //
    for (queenJ = j - 1; queenJ > j - 8; queenJ--) {
      if (queenJ < 1 || boardInfo[i - 1][queenJ - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [i, queenJ],
          target: boardInfo[i - 1][queenJ - 1]["type"],
        });

        if (boardInfo[i - 1][queenJ - 1]["team"] != "none") {
          break;
        }
      }
    }

    // right //
    for (queenJ = j + 1; queenJ < j + 8; queenJ++) {
      if (queenJ > 8 || boardInfo[i - 1][queenJ - 1]["team"] == team) {
        break;
      } else {
        movesAvailable.push({
          move: [i, queenJ],
          target: boardInfo[i - 1][queenJ - 1]["type"],
        });

        if (boardInfo[i - 1][queenJ - 1]["team"] != "none") {
          break;
        }
      }
    }
  } else if (type == "king") {
    // forward //
    if (i > 1 && boardInfo[i - 1 - 1][j - 1]["team"] != team) {
      movesAvailable.push({
        move: [i - 1, j],
        target: boardInfo[i - 1 - 1][j - 1]["type"],
      });
    }

    // backward //
    if (i < 8 && boardInfo[i + 1 - 1][j - 1]["team"] != team) {
      movesAvailable.push({
        move: [i + 1, j],
        target: boardInfo[i + 1 - 1][j - 1]["type"],
      });
    }

    // left //
    if (j > 1 && boardInfo[i - 1][j - 1 - 1]["team"] != team) {
      movesAvailable.push({
        move: [i, j - 1],
        target: boardInfo[i - 1][j - 1 - 1]["type"],
      });
    }

    // right //
    if (j < 8 && boardInfo[i - 1][j + 1 - 1]["team"] != team) {
      movesAvailable.push({
        move: [i, j + 1],
        target: boardInfo[i - 1][j + 1 - 1]["type"],
      });
    }

    // top left //
    if (i > 1 && j > 1 && boardInfo[i - 1 - 1][j - 1 - 1]["team"] != team) {
      movesAvailable.push({
        move: [i - 1, j - 1],
        target: boardInfo[i - 1 - 1][j - 1 - 1]["type"],
      });
    }

    // top right //
    if (i > 1 && j < 8 && boardInfo[i - 1 - 1][j + 1 - 1]["team"] != team) {
      movesAvailable.push({
        move: [i - 1, j + 1],
        target: boardInfo[i - 1 - 1][j + 1 - 1]["type"],
      });
    }

    // bottom left //
    if (i < 8 && j > 1 && boardInfo[i + 1 - 1][j - 1 - 1]["team"] != team) {
      movesAvailable.push({
        move: [i + 1, j - 1],
        target: boardInfo[i + 1 - 1][j - 1 - 1]["type"],
      });
    }

    // bottom right //
    if (i < 8 && j < 8 && boardInfo[i + 1 - 1][j + 1 - 1]["team"] != team) {
      movesAvailable.push({
        move: [i + 1, j + 1],
        target: boardInfo[i + 1 - 1][j + 1 - 1]["type"],
      });
    }

    // castling //
    if (
      ((team == "white" && i == 8 && j == 5) ||
        (team == "black" && i == 1 && j == 5)) &&
      checkAvailable == false
    ) {
      // castling left //
      if (
        castlingInfo[team]["king"] == "did not moved" &&
        castlingInfo[team]["leftCastle"] == "did not moved"
      ) {
        if (
          boardInfo[i - 1][j - 1 - 1]["team"] == "none" &&
          boardInfo[i - 1][j - 2 - 1]["team"] == "none" &&
          boardInfo[i - 1][j - 3 - 1]["team"] == "none"
        ) {
          movesAvailable.push({ move: [i, j - 2], target: "none" });
        }
      }

      // castling right //
      if (
        castlingInfo[team]["king"] == "did not moved" &&
        castlingInfo[team]["rightCastle"] == "did not moved"
      ) {
        if (
          boardInfo[i - 1][j + 1 - 1]["team"] == "none" &&
          boardInfo[i - 1][j + 2 - 1]["team"] == "none"
        ) {
          movesAvailable.push({ move: [i, j + 2], target: "none" });
        }
      }
    }
    //  //
  }

  return movesAvailable;
}
function findKingSafety(i, j, team, moves, boardInfo) {
  let animeTeam = "";
  if (team == "white") {
    animeTeam = "black";
  } else if (team == "black") {
    animeTeam = "white";
  }

  let safeMove = [];

  moves.forEach((move) => {
    // make the move //
    boardInfo[move["move"][0] - 1][move["move"][1] - 1]["team"] =
      boardInfo[i - 1][j - 1]["team"];
    boardInfo[move["move"][0] - 1][move["move"][1] - 1]["type"] =
      boardInfo[i - 1][j - 1]["type"];

    boardInfo[i - 1][j - 1]["team"] = "none";
    boardInfo[i - 1][j - 1]["type"] = "none";
    //  //

    // test if the king is an target //
    let safe = true;
    boardInfo.forEach((row, I) => {
      row.forEach((column, J) => {
        if (column["team"] == animeTeam) {
          let animeMoves = findMovesAvailable(
            I + 1,
            J + 1,
            column["team"],
            column["type"],
            boardInfo
          );

          animeMoves.forEach((obj) => {
            if (obj["target"] == "king") {
              safe = false;
              return;
            }
          });
        }

        if (safe == false) {
          return;
        }
      });
      if (safe == false) {
        return;
      }
    });
    //  //

    // unmake the move //
    boardInfo[i - 1][j - 1]["team"] =
      boardInfo[move["move"][0] - 1][move["move"][1] - 1]["team"];
    boardInfo[i - 1][j - 1]["type"] =
      boardInfo[move["move"][0] - 1][move["move"][1] - 1]["type"];

    if (move["target"] == "none") {
      boardInfo[move["move"][0] - 1][move["move"][1] - 1]["team"] = "none";
      boardInfo[move["move"][0] - 1][move["move"][1] - 1]["type"] = "none";
    } else {
      boardInfo[move["move"][0] - 1][move["move"][1] - 1]["team"] = animeTeam;
      boardInfo[move["move"][0] - 1][move["move"][1] - 1]["type"] =
        move["target"];
    }
    //  //

    if (safe == true) {
      safeMove.push(move);
    }
    //  //
  });

  return safeMove;
}
function numberOfMoves(team, info) {
  let number = 0;

  info.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column["team"] == team) {
        let moves = findMovesAvailable(
          i + 1,
          j + 1,
          team,
          column["type"],
          info
        );
        moves = findKingSafety(i + 1, j + 1, team, moves, info);

        number += moves.length;
      }
    });
  });

  return number;
}
function noMoves(team, info) {
  let test = true;

  info.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column["team"] == team) {
        let moves = findMovesAvailable(
          i + 1,
          j + 1,
          team,
          column["type"],
          info
        );
        moves = findKingSafety(i + 1, j + 1, team, moves, info);

        if (moves.length > 0) {
          test = false;
          return;
        }
      }
    });
    if (test == false) {
      return;
    }
  });

  return test;
}

// moving animation //
function biasMove(bias, scoopI, scoopJ) {
  // fixing the right side error //
  if (scoopJ == 0) {
    scoopJ = 8;
    scoopI--;
  }
  //  //

  // get the bias info //
  const biasI = parseInt(bias.style.gridArea[1]);
  const biasJ = numbers[`${bias.style.gridArea[0]}`];

  const team = bias.src.split("img/")[1].split("%20")[0];
  const type = bias.src.split("img/")[1].split("%20")[1].split(".")[0];
  //  //

  let animeTeam;
  if (team == "white") {
    animeTeam = "black";
  } else if (team == "black") {
    animeTeam = "white";
  }
  //  //

  // bias moving animation //
  let width = areas[0].offsetWidth;
  setTimeout(() => {
    bias.style.transform = `translate(${
      (scoopJ - biasJ) * width + width * 0.8 * 0.1
    }px, ${(scoopI - biasI) * width + width * 0.8 * 0.1}px)`;
  }, 200);
  setTimeout(() => {
    bias.style.transition = "0s";
  }, 1000);
  setTimeout(() => {
    bias.style.transform = "translate(10%, 10%)";
    bias.style.gridArea = `${letters[scoopJ - 1]}${scoopI}`;
  }, 1100);
  setTimeout(() => {
    bias.style.transition = "0.5s";
  }, 1200);
  //  //

  // update the castling info //
  if (type == "king" && biasJ == 5) {
    castlingInfo[team]["king"] = "moved";
  } else if (type == "castle") {
    if (biasJ == 1) {
      castlingInfo[team]["leftCastle"] = "moved";
    }
    if (biasJ == 8) {
      castlingInfo[team]["rightCastle"] = "moved";
    }
  }

  if (boardInfo[scoopI - 1][scoopJ - 1]["type"] == "castle") {
    if (scoopJ == 1) {
      castlingInfo[animeTeam]["leftCastle"] = "moved";
    }
    if (scoopJ == 8) {
      castlingInfo[animeTeam]["rightCastle"] = "moved";
    }
  }
  //  //

  let upgradeWindow = "close";
  // the soldier upgrade //
  if (bootTeam != team) {
    if (
      (type == "soldier" && team == "white" && scoopI == 1) ||
      (type == "soldier" && team == "black" && scoopI == 8)
    ) {
      // open the soldier upgrade window //
      soliderUpgradeWindow.style.transform = "scale(1)";
      //  //
      upgradeWindow = "open";

      // set the soldier upgrade window choices //
      soliderUpgradeChoices[0].src = "img/" + team + " queen.png";
      soliderUpgradeChoices[1].src = "img/" + team + " knight.png";
      soliderUpgradeChoices[2].src = "img/" + team + " castle.png";
      soliderUpgradeChoices[3].src = "img/" + team + " rook.png";
    }
  }
  //  //

  // castle move (castling move)  //
  if (type == "king") {
    let line = bias.style.gridArea[1];
    let castle;

    if (scoopJ == biasJ + 2) {
      biases.forEach((obj) => {
        if (obj.style.gridArea[0] == "H" && obj.style.gridArea[1] == line) {
          castle = obj;

          return;
        }
      });

      // castle moving animation //
      setTimeout(() => {
        castle.style.transform = `translate(${
          -2 * width + width * 0.8 * 0.1
        }px, ${0 * width + width * 0.8 * 0.1}px)`;
      }, 200);
      setTimeout(() => {
        castle.style.transition = "0s";
      }, 1000);
      setTimeout(() => {
        castle.style.transform = "translate(10%, 10%)";
        castle.style.gridArea = `F${scoopI}`;
      }, 1100);
      setTimeout(() => {
        castle.style.transition = "0.5s";
      }, 1200);
      //  //

      // update the board info //
      boardInfo[biasI - 1][8 - 1]["team"] = "none";
      boardInfo[biasI - 1][8 - 1]["type"] = "none";
      boardInfo[biasI - 1][6 - 1]["team"] = team;
      boardInfo[biasI - 1][6 - 1]["type"] = "castle";
      //  //
    } else if (scoopJ == biasJ - 2) {
      biases.forEach((obj) => {
        if (obj.style.gridArea[0] == "A" && obj.style.gridArea[1] == line) {
          castle = obj;
          return;
        }
      });

      // castle moving animation //
      setTimeout(() => {
        castle.style.transform = `translate(${
          +3 * width + width * 0.8 * 0.1
        }px, ${0 * width + width * 0.8 * 0.1}px)`;
      }, 200);
      setTimeout(() => {
        castle.style.transition = "0s";
      }, 1000);
      setTimeout(() => {
        castle.style.transform = "translate(10%, 10%)";
        castle.style.gridArea = `D${scoopI}`;
      }, 1100);
      setTimeout(() => {
        castle.style.transition = "0.5s";
      }, 1200);
      //  //

      // update the board info //
      boardInfo[biasI - 1][1 - 1]["team"] = "none";
      boardInfo[biasI - 1][1 - 1]["type"] = "none";
      boardInfo[biasI - 1][4 - 1]["team"] = team;
      boardInfo[biasI - 1][4 - 1]["type"] = "castle";
      //  //
    }
  }
  //  //

  // update the board info //
  boardInfo[biasI - 1][biasJ - 1]["team"] = "none";
  boardInfo[biasI - 1][biasJ - 1]["type"] = "none";
  boardInfo[scoopI - 1][scoopJ - 1]["team"] = team;
  boardInfo[scoopI - 1][scoopJ - 1]["type"] = type;
  //  //

  removeCheck();
  setTimeout(() => {
    checkTest(team);
  }, 1500);

  setTimeout(() => {
    if (noMoves(animeTeam, boardInfo) == true) {
      if (checkAvailable == true) {
        setTimeout(() => {
          checkMateAlarmAnimation("check mate", team);
        }, 4000);
      } else if (checkAvailable == false) {
        setTimeout(() => {
          checkMateAlarmAnimation("draw");
        }, 1000);
      }
    } else if (upgradeWindow == "close") {
      // active boot //
      if (bootTeam != "none" && team != bootTeam) {
        bootTurn();
      }
    }
  }, 2000);
  //  //
}

// the solider upgrade //
const soliderUpgradeWindow = document.querySelector(
  ".chess .container .soldier-upgrade"
);
const soliderUpgradeButtons = document.querySelectorAll(
  ".chess .container .soldier-upgrade div"
);
const soliderUpgradeChoices = document.querySelectorAll(
  ".chess .container .soldier-upgrade div img"
);

soliderUpgradeButtons.forEach((obj, index) => {
  obj.addEventListener("click", (e) => {
    // upgrade the soldier to your choice //
    biasSelected.setAttribute("src", soliderUpgradeChoices[index].src);

    // close the solider upgrade window //
    soliderUpgradeWindow.style.transform = "scale(0)";

    // update the board info //
    let i = parseInt(biasSelected.style.gridArea[1]);
    let j = numbers[biasSelected.style.gridArea[0]];
    //  //

    //  //
    const team = biasSelected.src.split("img/")[1].split("%20")[0];
    const type = biasSelected.src
      .split("img/")[1]
      .split("%20")[1]
      .split(".")[0];

    boardInfo[i - 1][j - 1]["type"] = soliderUpgradeChoices[index].src
      .split("img/")[1]
      .split("%20")[1]
      .split(".")[0];
    //  //

    let animeTeam;
    if (team == "white") {
      animeTeam = "black";
    } else if (team == "black") {
      animeTeam = "white";
    }

    setTimeout(() => {
      checkTest(team);
    }, 1500);

    setTimeout(() => {
      if (noMoves(animeTeam, boardInfo) == true) {
        if (checkAvailable == true) {
          setTimeout(() => {
            checkMateAlarmAnimation("check mate", team);
          }, 4000);
        } else if (checkAvailable == false) {
          setTimeout(() => {
            checkMateAlarmAnimation("draw");
          }, 1000);
        }
      } else {
        // active boot //
        if (bootTeam != "none" && team != bootTeam) {
          if (soliderUpgradeWindow.style.transform != "scale(1)") {
            bootTurn();
          }
        }
      }
    }, 2000);
  });
});
//  //

// killing animation //
function biasDied(scoopI, scoopJ) {
  // fixing the left side error //
  if (scoopJ == 0) {
    scoopJ = 8;
    scoopI--;
  }
  //  //

  let gridArea = letters[scoopJ - 1] + scoopI;
  let bias;
  let team;

  biases.forEach((obj) => {
    if (
      obj.style.gridArea[0] == gridArea[0] &&
      obj.style.gridArea[1] == gridArea[1] &&
      obj.style.display != "none"
    ) {
      bias = obj;
      team = obj.src.split("img/")[1].split("%20")[0];

      return null;
    }
  });

  // died animation //
  setTimeout(() => {
    bias.style.transition = "1s";
  }, 10);
  setTimeout(() => {
    bias.style.opacity = "0";
  }, 100);
  setTimeout(() => {
    bias.style.display = "none";
  }, 1500);
  //  //

  // take it to the grave //
  const grave = document.querySelector(".chess ." + team + "-grave");

  let diedBox = document.createElement("div");
  let innerImg = document.createElement("img");
  innerImg.setAttribute("src", bias.src);

  diedBox.appendChild(innerImg);
  grave.appendChild(diedBox);
  //  //
}

// move on click moveScoop //
moveScoop.forEach((obj, index) => {
  obj.addEventListener("click", (e) => {
    biasMove(
      biasSelected,
      (index + 1 - ((index + 1) % 8)) / 8 + 1,
      (index + 1) % 8
    );

    if (situation == "white select") {
      situation = "black turn";
    } else if (situation == "black select") {
      situation = "white turn";
    }
  });
});

// move and kill on click killScoop //
killScoop.forEach((obj, index) => {
  obj.addEventListener("click", (e) => {
    biasMove(
      biasSelected,
      (index + 1 - ((index + 1) % 8)) / 8 + 1,
      (index + 1) % 8
    );

    biasDied((index + 1 - ((index + 1) % 8)) / 8 + 1, (index + 1) % 8);

    if (situation == "white select") {
      situation = "black turn";
    } else if (situation == "black select") {
      situation = "white turn";
    }
  });
});
//  //

// boot //

// boot turn //
let Values = {
  none: 0,
  soldier: 100,
  rook: 400,
  castle: 500,
  knight: 400,
  queen: 800,
  king: 0,
};
let bootDepth = 1;

let compar;
//  //

function positionEvaluation(oldFormat, newFormate) {
  let oldValue = 0;
  let newValue = 0;

  oldFormat.forEach((row) => {
    row.forEach((column) => {
      if (column["team"] == bootTeam) {
        oldValue += Values[column["type"]];
      } else if (column["team"] != "none") {
        oldValue -= Values[column["type"]];
      }
    });
  });

  newFormate.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column["team"] == bootTeam) {
        newValue += Values[column["type"]];
      } else if (column["team"] != "none") {
        newValue -= Values[column["type"]];
      }
    });
  });

  return newValue - oldValue;
}

function bootTesting(info, team, alpha, beta, depth) {
  // compar++;

  //  //
  if (depth == 0) {
    return positionEvaluation(boardInfo, info);
  } else if (noMoves(team, info) == true) {
    if (team == bootTeam) {
      return -10000;
    } else {
      return 10000;
    }
  }
  //  //

  let animeTeam;
  if (team == "white") {
    animeTeam = "black";
  } else {
    animeTeam = "white";
  }

  let bestMove;
  info.forEach((row, i) => {
    row.forEach((column, j) => {
      if (column["team"] == team) {
        // get legal moves //
        let moves = findMovesAvailable(
          i + 1,
          j + 1,
          column["team"],
          column["type"],
          info
        );
        moves = findKingSafety(i + 1, j + 1, column["team"], moves, info);
        //  //

        // sorting the moves //
        for (let x = 0; x < moves.length - 1; x++) {
          let bestIndex = x;
          for (let y = x + 1; y < moves.length; y++) {
            if (
              Values[moves[y]["target"]] > Values[moves[bestIndex]["target"]]
            ) {
              bestIndex = y;
            }
          }
          let move = moves[x];
          moves[x] = moves[bestIndex];
          moves[bestIndex] = move;
        }
        //  //

        // test all moves //
        moves.forEach((move) => {
          // the king edg bonus //
          let kingEdg = 0;
          if (column["type"] == "king") {
            if (
              (i + 1 <= 4 && move["move"][0] < i) ||
              (i + 1 >= 5 && move["move"][0] > i)
            ) {
              kingEdg += -1;
            }
            if (
              (j + 1 <= 4 && move["move"][1] < j) ||
              (j + 1 >= 5 && move["move"][1] > j)
            ) {
              kingEdg += -1;
            }
          }
          //  //

          let target = {
            team: info[move["move"][0] - 1][move["move"][1] - 1]["team"],
            type: info[move["move"][0] - 1][move["move"][1] - 1]["type"],
          };

          // make the move //
          info[move["move"][0] - 1][move["move"][1] - 1]["team"] =
            column["team"];
          info[move["move"][0] - 1][move["move"][1] - 1]["type"] =
            column["type"];
          column["team"] = "none";
          column["type"] = "none";
          //  //

          // get the evaluation //
          let nextLevel =
            bootTesting(info, animeTeam, alpha, beta, depth - 1) + kingEdg;

          // unmake the move //
          column["team"] =
            info[move["move"][0] - 1][move["move"][1] - 1]["team"];
          column["type"] =
            info[move["move"][0] - 1][move["move"][1] - 1]["type"];

          info[move["move"][0] - 1][move["move"][1] - 1]["team"] =
            target["team"];
          info[move["move"][0] - 1][move["move"][1] - 1]["type"] =
            target["type"];
          //  //

          //  //
          if (team == bootTeam && nextLevel > alpha) {
            alpha = nextLevel;
            bestMove = {
              from: [i + 1, j + 1],
              to: [move["move"][0], move["move"][1]],
              targetType: target["type"],
              upgrade: "none",
            };
          }
          if (team != bootTeam && nextLevel < beta) {
            beta = nextLevel;
            bestMove = {
              from: [i + 1, j + 1],
              to: [move["move"][0], move["move"][1]],
              targetType: target["type"],
              upgrade: "none",
            };
          }

          if (alpha >= beta) {
            return;
          }
          //  //
        });

        //  //
      }
    });
  });

  if (depth == bootDepth) {
    return bestMove;
  } else {
    if (team == bootTeam) {
      return alpha;
    } else {
      return beta;
    }
  }
}

function bootTurn() {
  // copy the board information //
  let copyInfo = [];
  boardInfo.forEach((row, i) => {
    copyInfo.push([]);
    row.forEach((column) => {
      copyInfo[i].push({ team: column["team"], type: column["type"] });
    });
  });
  //  //

  // console.log("boot playing");
  // compar = 0;

  let bootMove = bootTesting(copyInfo, bootTeam, -100000, 100000, bootDepth);

  // console.log("num of testes: " + compar);
  // console.log("");

  let bootBias;
  biases.forEach((bias) => {
    const biasI = parseInt(bias.style.gridArea[1]);
    const biasJ = numbers[`${bias.style.gridArea[0]}`];

    if (
      bias.style.display != "none" &&
      biasI == bootMove["from"][0] &&
      biasJ == bootMove["from"][1]
    ) {
      bootBias = bias;
      return;
    }
  });

  // kill the anime bias //
  if (bootMove["targetType"] != "none" && bootMove["targetType"] != "died") {
    biasDied(bootMove["to"][0], bootMove["to"][1]);
  }
  //  //
  // move the boot bias //
  biasMove(bootBias, bootMove["to"][0], bootMove["to"][1]);
  //  //
  // upgrade the soldier //
  if (bootMove["upgrade"] != "none") {
    setTimeout(() => {
      boardInfo[bootMove["to"][0] - 1][bootMove["to"][1] - 1]["type"] =
        bootMove["upgrade"];
    }, 500);
    setTimeout(() => {
      bootBias.setAttribute(
        "src",
        "img/" + bootTeam + " " + bootMove["upgrade"] + ".png"
      );
    }, 1500);
  }
  //  //

  // next turn //
  if (bootTeam == "white") {
    situation = "black turn";
  } else if (bootTeam == "black") {
    situation = "white turn";
  }
  //  //
}
//  //
// set the difficult level //
const difficultButtons = document.querySelectorAll(
  ".chess .setting.boot .bootActive .hard-level .b"
);

difficultButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    // light the button //
    difficultButtons.forEach((obj) => {
      obj.style.background = "#ddd";
    });

    e.target.style.background = "#f20";
    //  //

    bootDepth = index + 1;
    //  //
  });
});
//  //

//
