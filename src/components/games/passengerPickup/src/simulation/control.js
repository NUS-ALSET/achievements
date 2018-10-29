var bot = function (world) {
  var direction = false;
  if (world.controlInfo.current[world.gameId] === world.index) {
    switch (world.controlInfo.keyPressed[world.gameId]) {
      case "up":
        direction = { up: true }
        break;
      case "down":
        direction = { down: true }
        break;
      case "left":
        direction = { left: true }
        break;
      case "right":
        direction = { right: true }
        break;
      default:
        break;
    }
  }
  if (direction) {
    return direction;
  }
  return world.direction;
  //return {right:true};
}
module.exports = bot;