const Promise = require("bluebird");
const fs = require("fs");

const open = require("./data/PROBLEM_INIT_SUCCESS");
const activities = require("./activities");
const status = require("./data/PROBLEM_SOLUTION_REFRESH_SUCCESS");

const admin = require("firebase-admin");
const serviceAccount = require("./config/achievements-prod.json");

const userOpened = {};
const userWrites = [];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://achievements-prod.firebaseio.com"
});

const wrongValues = [JSON.stringify({ updatedAt: "1538967467686" })];

for (const action of Object.values(open)) {
  userOpened[action.uid] = userOpened[action.uid] || {};
  if (typeof action.otherActionData === "string") {
    action.otherActionData = JSON.parse(action.otherActionData);
  }
  userOpened[action.uid][action.otherActionData.problemId] =
    userOpened[action.uid][action.otherActionData.problemId] || [];
  userOpened[action.uid][action.otherActionData.problemId].push(
    action.createdAt
  );
}

for (const action of Object.values(status)) {
  if (typeof action.otherActionData === "string") {
    action.otherActionData = JSON.parse(action.otherActionData);
  }
  const activity = activities[action.otherActionData.problemId];
  const opened =
    userOpened[action.uid] &&
    userOpened[action.uid][action.otherActionData.problemId];

  if (opened && activity.type === "jupyterInline") {
    let problemOpen = opened.filter(a => a < action.createdAt);
    problemOpen = problemOpen[problemOpen.length - 1];

    if (!activity) {
      throw new Error("Missing activity");
    }

    let solutionFailed = false;
    if (action.otherActionData.payload) {
      let json =
        action.otherActionData.payload.json || action.otherActionData.payload;

      if (typeof json.solution === "string") {
        json = JSON.parse(json.solution);
        json = json.result || json;
      }
      if (typeof json === "string") {
        json = JSON.parse(json);
      }

      if (
        !json.cells &&
        !["updatedAt", "updatedAt,version"].includes(Object.keys(json).join())
      ) {
        fs.writeFile("./issue.json", JSON.stringify(json), () => ({}));
        break;
      }

      if (!wrongValues.includes(JSON.stringify(json)) && json.cells) {
        for (const index of Object.keys(json.cells)) {
          if (!(index < action.frozen)) {
            const cell = json.cells[index];
            if (cell.outputs) {
              for (const output of Object.values(cell.outputs)) {
                if (output.output_type === "error") {
                  solutionFailed = true;
                } else {
                  // console.log(output);
                }
              }
            }
          }
        }
      }
      userWrites.push({
        time: { ".sv": "timestamp" },
        userKey: action.uid,
        open: Number(problemOpen) || 0,
        completed: Number(!solutionFailed),
        activityKey: action.otherActionData.problemId
      });
    }
  }
}

let bulk = {};

Promise.reduce(
  userWrites,
  (index, userWrite) => {
    if (index && !(index % 100)) {
      return admin
        .database()
        .ref("/analytics/jupyterSolutions")
        .update(bulk)
        .then(() => {
          bulk = {};
          return ++index;
        });
    }
    const key = admin
      .database()
      .ref("/analytics/jupyterSolutions")
      .push().key;
    bulk[key] = userWrite;
    return ++index;
  },
  0
);
