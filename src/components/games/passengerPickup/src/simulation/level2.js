var bot = function (world) {
  var findShortestPath = function (arr, pointA, pointB, charId) {
    var heuristic = function (a, b) {
      var x = a.x - b.x;
      var y = a.y - b.y;
      var d = Math.sqrt(x * x + y * y);
      return d;
    };
    var removeFromArray = function (array, elt) {
      for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === elt) {
          array.splice(i, 1);
        }
      }
    };
    //getting point on the map provided
    var cellPointA = arr[pointA.y][pointA.x];
    var cellPointB = arr[pointB.y][pointB.x];
    //initializing variables we'll gonna use for searching path
    var openSet = [];
    var closeSet = [];
    var path = [];
    var current = cellPointA;
    openSet.push(cellPointA);
    //searching path function started here
    while (openSet.length > 0) {
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      current = openSet[winner];
      if (current === cellPointB) {
        var temp = current;
        path.push(temp);
        while (temp.previous[charId]) {
          path.push(temp.previous[charId]);
          temp = temp.previous[charId];
        }
        for (i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr[0].length; j++) {
            if (arr[i][j]) {
              arr[i][j].previous[charId] = undefined;
            }
          }
        }
        return path;
      }
      removeFromArray(openSet, current);
      closeSet.push(current);
      var neighbors = current.neighbors;
      for (i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (!closeSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + 1;
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          }
          else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }
          if (newPath) {
            neighbor.h = heuristic(neighbor, cellPointB);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous[charId] = current;
          }
        }
      }
    }
  }
  //continue calculating path if flag calculating is set to true
  var pointA, pointB;
  var player = world.player;
  var closestPassenger = false;
  var random = Math.random();
  if (player.path.length === 0 && !world.player.passenger) {
    if (random > 0.2)
      world.collectives.forEach(passenger => {
        if (closestPassenger === false)
          closestPassenger = passenger;
        else if (
          Math.sqrt(
            Math.pow(player.x - closestPassenger.x, 2) +
            Math.pow(player.y - closestPassenger.y, 2)
          ) >
          Math.sqrt(
            Math.pow(player.x - passenger.x, 2) + Math.pow(player.y - passenger.y, 2)
          )
        ) {
          closestPassenger = passenger;
        }
      });
    else
      closestPassenger = world.collectives[0];
    if (closestPassenger) {
      //finding path to the closest passenger
      pointA = { x: Math.floor(player.x / world.config.roadWidth), y: Math.floor(player.y / world.config.roadWidth) };
      pointB = { x: Math.floor(closestPassenger.x / world.config.roadWidth), y: Math.floor(closestPassenger.y / world.config.roadWidth) };
      player.path = findShortestPath(world.map, pointA, pointB, world.index);
    }
  }
  else if (player.path.length === 0 && world.player.passenger) {
    //finding path to passenger takeof destination if passenger is picked up
    pointA = { x: Math.floor(player.x / world.config.roadWidth), y: Math.floor(player.y / world.config.roadWidth) };
    pointB = { x: Math.floor(player.passenger.takeofX / world.config.roadWidth), y: Math.floor(player.passenger.takeofY / world.config.roadWidth) };
    player.path = findShortestPath(world.map, pointA, pointB, world.index);
  }
  else if (player.path.length > 0) {
    //going to the next cell of current path (once bot reaches this point it will be deleted automaticly)
    var direction = {};
    var point = player.path[player.path.length - 1];
    if (point.x * world.config.roadWidth - player.x > 0) {
      direction = { left: false, right: true, up: false, down: false };
    } else if (point.x * world.config.roadWidth - player.x < 0) {
      direction = { left: true, right: false, up: false, down: false };
    } else if (point.y * world.config.roadWidth - player.y > 0) {
      direction = { left: false, right: false, up: false, down: true };
    } else if (point.y * world.config.roadWidth - player.y < 0) {
      direction = { left: false, right: false, up: true, down: false };
    }
    return direction;
  }
}
module.exports = bot;