const fs = require("fs");
const actions = require("./data/PROBLEM_SOLUTION_SUBMIT_REQUEST");
const admin = require("firebase-admin");
const serviceAccount = require("./config/achievements-dev-b323fe3fe2d7");
const completed = require("./completedActivities");
const userActions = {};

let missing = 0;
let valid = 0;
let all = 0;

Object.keys(completed).forEach(a => {
  Object.keys(completed[a]).forEach(b => {
    Object.keys(completed[a][b]).forEach(() => {
      all++;
      return true;
    });
    return true;
  });
  return true;
});

for (const actionKey of Object.keys(actions)) {
  const action = actions[actionKey];
  let actionData = action.otherActionData || {};
  if (typeof actionData === "string") {
    actionData = JSON.parse(actionData);
  }
  const pathId = actionData.pathId;
  const activityId = actionData.problemId || actionData.activityId;
  const userId = action.uid;

  if (!(userId && pathId && activityId)) {
    throw new Error("Missing one of required fields");
  }
  if (
    completed[userId] &&
    completed[userId][pathId] &&
    completed[userId][pathId][activityId]
  ) {
    const success = completed[userId][pathId][activityId];
    if (success === true) {
      userActions[action.uid] = userActions[action.uid] || {};
      const userPaths = userActions[action.uid];
      userPaths[pathId] = userPaths[pathId] || {};
      const pathData = userPaths[pathId];
      pathData[activityId] = action.createdAt;
      valid += 1;
    } else {
      missing += 1;
    }
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://achievements-dev.firebaseio.com"
});

fs.writeFile("./output.json", JSON.stringify(userActions), () => ({}));

console.log(all, missing, valid);
