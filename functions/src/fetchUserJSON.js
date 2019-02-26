const admin = require("firebase-admin");
const Queue = require("firebase-queue");

const fetchUserJSON = (data, taskKey, uid) => {
  return Promise.all([
    admin
      .database()
      .ref(`/users/${uid}`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/userAchievements/${uid}`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/usersPrivate/${uid}`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/completedActivities/${uid}`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref("/problemSolutions/")
      .once("value")
      .then(snap => snap.val())
  ])
  .then(
    ([userData, userAchievements, userPrivate, completedActivities, solutions]) => {
            let problemSolutions = solutions;
            const userSolutions = Object.keys(problemSolutions).reduce((acc, activityID) => {
              const propIsEmpty = !Object.keys(problemSolutions[activityID]).length;
              let singleActivityData;
              if (!propIsEmpty) {
                singleActivityData = !propIsEmpty && Object.keys(problemSolutions[activityID]).reduce((acc2, userID) => {
                  if (userID === uid) {
                    acc2["answers"] = problemSolutions[activityID][userID]
                  }
                  return acc2;
                }, {})
              }
              if (Object.keys(singleActivityData).length) (function() {acc[activityID] = singleActivityData})();
              return acc;
            }, {})
            solutions = userSolutions;
          admin
          .database()
          .ref(`/fetchUserJSONQueue/responses/${taskKey}`)
          .set({
            owner: uid,
            data: {
              userData, userAchievements, userPrivate, completedActivities, solutions
            }
          })
    },
    err => console.log(err)
  );
}


exports.handler = fetchUserJSON;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/fetchUserJSONQueue"),
    (data, progress, resolve) =>
    fetchUserJSON(data, data.taskKey, data.owner).then(() =>
        resolve()
      )
  );
  queue.addWorker();
};

