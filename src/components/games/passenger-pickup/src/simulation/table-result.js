/* eslint-disable */
import Store from '../store';

let simulate = function (botFiles, config) {
  let tableStart = `<table id="game-result-table" border='0' align='center' cellspacing=0 cell><tr><td></td><td></td>`;
  let tableStart2 = '<tr><td></td><td class="cell-player-number" rowspan=' + (botFiles.length + 1) + '>As Player 1</td><td class="cell-player-number" colspan=' + botFiles.length + '>As Player 2</td><td colspan=3></td></tr>';
  let tableStartArr = new Array(botFiles.length);
  let player1Score = new Array(botFiles.length);
  let player2Score = new Array(botFiles.length);
  const Simulation = require("./simulation.js");
  var key1 = 0;
  var key2 = 0;
  for (var bot1 of botFiles) {
    tableStart += "<td class='cell-player-name'>" + bot1.name + "</td>";
    tableStartArr[key1] = "<tr><td class='cell-player-name'>" + bot1.name + "</td>";
    //if(key1==3) tableStartArr[3]+= "<td rowspan="+botFiles.length+">As Player 1</td>";
    player1Score[key1] = 0;
    key2 = 0;
    for (var bot2 of botFiles) {
      if (typeof player2Score[key2] !== "number")
        player2Score[key2] = 0;
      if (key1 !== key2) {
        var time = config.time * 60;
        var result;
        var simulation = new Simulation(config, bot1, bot2, Store.botsQuantity);
        while (time > 0) {
          result = simulation.simulate();
          time--;
        }
        if (result.player1 > result.player2) {
          tableStartArr[key1] += "<td class='cell-number-won'><a class='restartGame' data-bot1='" + bot1.name + "' data-bot2='" + bot2.name + "' href='#'>1.0</a></td>";
          player1Score[key1] += 1;
        }
        else if (result.player1 < result.player2) {
          tableStartArr[key1] += "<td class='cell-number-lose'><a class='restartGame' data-bot1='" + bot1.name + "' data-bot2='" + bot2.name + "' href='#'>0.0</a></td>";
          player2Score[key2] += 1;
        }
        else {
          tableStartArr[key1] += "<td class='cell-number-even'><a class='restartGame' data-bot1='" + bot1.name + "' data-bot2='" + bot2.name + "' href='#'>0.5</a></td>";
          player1Score[key1] += 0.5;
          player2Score[key2] += 0.5;
        }
      }
      else {
        tableStartArr[key1] += "<td class='cell-empty-cells'></td>";
      }
      key2++;
    }

    key1++;
  }
  for (var i = 0; i < player1Score.length; i++) {
    tableStartArr[i] += "<td class='cell-number'>" + player1Score[i].toFixed(1) + "</td>";
    tableStartArr[i] += "<td class='cell-number'>" + player2Score[i].toFixed(1) + "</td>";
    tableStartArr[i] += "<td class='cell-number-bold'>" + (player1Score[i] + player2Score[i]).toFixed(1) + "</td></tr>";
  }
  var sum = player1Score.map(function (num, idx) {
    return { sum: num + player2Score[idx], index: idx };
  });
  sum.sort((a, b) => {
    if (a.sum > b.sum)
      return -1;
    if (a.sum < b.sum)
      return 1;
    return 0;
  });
  tableStart += "<td class='cell-player-name'>Won as Player 1</td><td class='cell-player-name'>Won as Player 2</td><td class='cell-player-name'>Overall Total</td></tr>";
  tableStart += tableStart2;
  for (i = 0; i < sum.length; i++) {
    tableStart += tableStartArr[sum[i].index];
  }

  tableStart += "</table>";
  return { tableHtml: tableStart, score: player1Score[0] + player2Score[0] };
};
export default simulate;