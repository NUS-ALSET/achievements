console.log("Fetching data")
let url = "http://localhost:9000/.inspect/coverage?ns=achievements"

const http = require('http');

function analyze(data){
    let covered = data.split('"values":[{').length - 1;
    let uncovered = data.split('"values":[]').length - 1;

    console.log(covered,"covered rules");
    console.log(uncovered,"uncovered rules");
    let percent = 100*covered/(covered+uncovered)
    console.log(percent.toFixed(2),"percent coverage")
}
function saveReport(data){
  const fs = require('fs');
  let highlighting = `
  span[title=""] {
    background-color: yellow;
  }
  `
  let newData = data.replace("<style>", "<style>"+highlighting);
  fs.writeFile("./securityRulesCoverage.html", newData, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Security rules coverage report saved as securityRulesCoverage.html.");
});

}
http.get(url, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    //console.log(data);
    analyze(data)
    saveReport(data)
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

