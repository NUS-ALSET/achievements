/* eslint-disable */
import Store from '../store';
function createLink(func1,func2){
    return '?player2='+func1+'&player1='+func2;
}

let simulate = function(botFiles, config){
    var restartGame = function(func1,func2){
        console.log(func1.name,func2.name);
    }
    let tableStart = `<table id="game-result-table" border='0' align='center' cellspacing=0 cell>
        <tr><td>Totals as Player 2 &#8594;</td>`;
    let tableStart2 = "<tr id='game-result-header'><td>Totals as Player 1 &#8595;</td>";
    let tableStart3 = "";
    let tableStartArr = new Array(botFiles.length);
    let player1Score = new Array(botFiles.length);
    let player2Score = new Array(botFiles.length);
    const Simulation = require("./simulation.js");
    for (let bot1 of botFiles){
        tableStart2 += "<td>"+bot1.name+"(2)</td>";
        tableStartArr[botFiles.indexOf(bot1)]  = "<tr><td>"+bot1.name+"(1)</td>";
        player1Score[botFiles.indexOf(bot1)]=0;
        
        for (let bot2 of botFiles){
            if(typeof player2Score[botFiles.indexOf(bot2)]!=="number")
                player2Score[botFiles.indexOf(bot2)]=0;
            if(bot1!==bot2){
                var time = config.time*60;
                var result;
                var simulation = new Simulation(config,bot1,bot2,Store.botsQuantity);
                while(time>0){
                    result = simulation.simulate();
                    time--;
                }
                if(result.player1>result.player2){
                    tableStartArr[botFiles.indexOf(bot1)]+="<td><a class='restartGame' data-bot1='"+bot1.name+"' data-bot2='"+bot2.name+"' href='#'>1.0</a></td>";
                    player1Score[botFiles.indexOf(bot1)]+=1;
                }
                else if(result.player1<result.player2){
                    tableStartArr[botFiles.indexOf(bot1)]+="<td><a class='restartGame' data-bot1='"+bot1.name+"' data-bot2='"+bot2.name+"' href='#'>0.0</a></td>";
                    player2Score[botFiles.indexOf(bot2)]+=1;
                }
                else{
                    tableStartArr[botFiles.indexOf(bot1)]+="<td><a class='restartGame' data-bot1='"+bot1.name+"' data-bot2='"+bot2.name+"' href='#'>0.5</a></td>";
                    player1Score[botFiles.indexOf(bot1)]+=0.5;
                    player2Score[botFiles.indexOf(bot2)]+=0.5;
                }
            }
            else{
                tableStartArr[botFiles.indexOf(bot1)]+="<td class='empty-cells'></td>";
            }
        }
        tableStartArr[botFiles.indexOf(bot1)]+="<td>"+player1Score[botFiles.indexOf(bot1)].toFixed(1)+"</td>"
    }
    tableStart2+="</tr>"
    for(var i=botFiles.length-1;i>=0;i--){
        tableStart+="<td>"+player2Score[i].toFixed(1)+"</td>";
        tableStartArr[i]+="<td>"+(player1Score[i]+player2Score[i]).toFixed(1)+"</td></tr>";
        tableStart3+=tableStartArr[i];
    }
    tableStart+="<td rowspan=2>Totals as Player1</td><td rowspan=2>Overall Total</td></tr>";
    return tableStart+tableStart2+tableStart3+"</table>";
};
export default simulate;