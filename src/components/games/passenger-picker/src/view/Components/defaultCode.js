/* eslint-disable */
export const defaultPythonCodeFunction=`import random
def getPlayersCommands(world):
  foo = ['RIGHT', 'LEFT', 'UP','DOWN']
  result = random.choice(foo)
  print(result)
  return result`;
export const defaultJavascriptFunctionCode = `function getPlayersCommands(world) {
	const direction = {
		left : false,
		right : false,
		up : false,
		down : false
	};
	const choice = ~~(Math.random() * 4);
	Object.keys(direction).forEach((c, index) => {
		direction[c] = index === choice ;
	})
	return direction;
}`;