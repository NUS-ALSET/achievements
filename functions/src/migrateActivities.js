const admin = require("firebase-admin");

exports.handler = () => {
  const pathsMap = {};
  const completeMap = {};
  const activitiesMap = {};

  return admin
    .database()
    .ref("/problems")
    .once("value")
    .then(usersSnapshot => usersSnapshot.val())
    .then(users =>
      Promise.all(
        Object.keys(users).map(userKey =>
          Promise.all(
            Object.keys(users[userKey])
              .map(id => Object.assign({ id }, users[userKey][id]))
              .map(activity => {
                const activityKey = activity.id;

                delete activity.id;
                activity.path = activity.path || activity.owner;
                activitiesMap[activityKey] = activity.path;

                pathsMap[activity.path] = pathsMap[activity.path] || 0;
                pathsMap[activity.path] += 1;

                return admin
                  .database()
                  .ref(`/activities/${activityKey}`)
                  .set(activity);
              })
          )
        )
      )
    )
    .then(() =>
      Promise.all(
        Object.keys(pathsMap).map(pathId =>
          admin
            .database()
            .ref(`/paths/${pathId}/totalActivities`)
            .set(pathsMap[pathId])
        )
      )
    )
    .then(() =>
      admin
        .database()
        .ref("/problemSolutions")
        .once("value")
        .then(snapshot => snapshot.val())
        .then(activities => {
          for (const activityKey of Object.keys(activities)) {
            for (const userKey of Object.keys(activities[activityKey])) {
              completeMap[userKey] = completeMap[userKey] || {};
              const userMap = completeMap[userKey];
              const pathKey = activitiesMap[activityKey];
              if (pathKey) {
                userMap[pathKey] = userMap[pathKey] || {};
                userMap[pathKey][activityKey] = true;
              }
            }
          }
          return admin
            .database()
            .ref("/completedActivities")
            .set(completeMap);
        })
    );
};
