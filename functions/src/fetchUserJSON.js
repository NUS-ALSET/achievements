const admin = require("firebase-admin");
const Queue = require("firebase-queue");
//const MAX_CHAR_IN_ACTION = 2000;
const MAX_LOGGED_EVENTS = 500;

const fetchUserJSON = (taskKey, uid) => {
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
      .then(snap => snap.val()),
    admin
      .database()
      .ref("/analytics/activityAttempts")
      .orderByChild("userKey")
      .equalTo(uid)
      .once("value")
      .then(snap => snap.val()),
    admin
      .firestore()
      .collection("logged_events")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(MAX_LOGGED_EVENTS)
      .get()
      .then(querySnapshot => {
        const allActions = [];
        querySnapshot.forEach(function(doc) {
          allActions.push({ [doc.id]: doc.data() });
                 
        });
        return allActions;
      })
  ])
    .then(
      ([
        userData,
        userAchievements,
        userPrivate,
        completedActivities,
        solutions,
        activityAttempts,
        filteredEvents
      ]) => {
        let problemSolutions = solutions;
        const userSolutions = Object.keys(problemSolutions).reduce(
          (acc, activityID) => {
            const propIsEmpty = !Object.keys(problemSolutions[activityID])
              .length;
            let singleActivityData;
            if (!propIsEmpty) {
              singleActivityData = Object.keys(
                problemSolutions[activityID]
              ).reduce((acc2, userID) => {
                if (userID === uid) {
                  acc2["answers"] = problemSolutions[activityID][userID];
                }
                return acc2;
              }, {});
            }
            if (Object.keys(singleActivityData).length)
              (function() {
                acc[activityID] = singleActivityData;
              })();
            return acc;
          },
          {}
        );
        solutions = userSolutions;
        
        admin
          .database()
          .ref(`/newFetchUserJSONQueue/responses/${taskKey}`)
          .set({
            owner: uid,
            data: {
              userData,
              userAchievements,
              userPrivate,
              completedActivities,
              solutions,
              activityAttempts,
              loggedEvents: filteredEvents
            }
          });
          
      }
    )
    .catch(err => console.log(err));
};

exports.handler = fetchUserJSON;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/newFetchUserJSONQueue"),
    (data, progress, resolve) =>
      fetchUserJSON(data.taskKey, data.owner).then(() => resolve())
  );
  queue.addWorker();
};
