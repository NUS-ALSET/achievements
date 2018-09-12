export const defaultPythonCodeFunction=`import random
def getPlayersCommands(world):
  foo = ['RIGHT', 'LEFT', 'UP','DOWN']
  result = random.choice(foo)
  print(result)
  return result`;
  export const defaultJavascriptFunctionCode = `function getPlayersCommands(world) {
	var player = world.player;
	var closestGem = false;
	/*world.collectives.forEach(stone => {
		if (closestGem == false) closestGem = stone;
		else if (
		Math.sqrt(
			Math.pow(player.x - closestGem.x, 2) +
			Math.pow(player.y - closestGem.y, 2)
		) >
		Math.sqrt(
			Math.pow(player.x - stone.x, 2) + Math.pow(player.y - stone.y, 2)
		)
		) {
		closestGem = stone;
		}
	});*/
	closestGem = world.collectives[0];
	if (closestGem) {
		if (closestGem.x - player.x > 0) {
			var direction = { left: false, right: true, up: false, down: false };
		} else if (closestGem.x - player.x < 0) {
			var direction = { left: true, right: false, up: false, down: false };
		} else if (closestGem.y - player.y > 0) {
			var direction = { left: false, right: false, up: false, down: true };
		} else if (closestGem.y - player.y < 0) {
			var direction = { left: false, right: false, up: true, down: false };
		} else {
			var direction = { left: false, right: false, up: true, down: false };
		}
		
		return direction;
	}
}`;