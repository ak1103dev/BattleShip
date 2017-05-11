const _ = require('lodash');

const isLegal = (board, positions) => {
  let checkingArea = [];
  positions.map((p) => {
    if (p === 0) return (checkingArea = _.union(checkingArea, [0, 1, 10, 11]));
    if (p === 9) return (checkingArea = _.union(checkingArea, [8, 9, 18, 19]));
    if (p === 90) return (checkingArea = _.union(checkingArea, [90, 91, 80, 81]));
    if (p === 99) return (checkingArea = _.union(checkingArea, [98, 99, 88, 89]));
    if (p / 10 === 0) return (checkingArea = _.union(checkingArea, [p - 1, p, p + 1, p + 9, p + 10, p + 11]));
    if (p / 10 === 9) return (checkingArea = _.union(checkingArea, [p - 1, p, p + 1, p - 11, p - 10, p - 9]));
    if (p % 10 === 0) return (checkingArea = _.union(checkingArea, [p - 10, p, p + 10, p - 9, p + 1, p + 11]));
    if (p % 10 === 9) return (checkingArea = _.union(checkingArea, [p - 10, p, p + 10, p - 11, p - 1, p + 9]));
    return (checkingArea = _.union(checkingArea, [
      p - 11, p - 10, p - 9,
      p - 1, p, p + 1,
      p + 9, p + 10, p + 11
    ]));
  });
  // console.log(checkingArea);
  let legal = false;
  checkingArea.map((p) => (legal = legal || board[p]));
  return !legal;
};

module.exports = isLegal;
