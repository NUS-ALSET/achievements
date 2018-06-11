/**
 * This module processes profile refreshment requests
 */
const admin = require("firebase-admin");
const axios = require("axios");
const functions = require("firebase-functions");
const Queue = require("firebase-queue");
const checkToken = require("./utils/checkToken");

const ERROR_500 = 500;
const profilesRefreshApproach =
  (functions.config().profiles &&
    functions.config().profiles["refresh-approach"]) ||
  "none";

function updateProfile(data, resolve) {
  switch (data.service) {
    case "CodeCombat":
      return admin
        .database()
        .ref(`/userAchievements/${data.uid}/${data.service}/achievements`)
        .once("value")
        .then(existing => existing.val() || {})
        .then(existing =>
          axios
            .get(
              `https://codecombat.com/db/user/${data.serviceId
                .toLowerCase()
                .replace(/[ _]/g, "-")
                .replace(
                  /[!@#$%^&*()]/g,
                  ""
                )}/level.sessions?project=state.complete,levelID,` +
                "levelName,playtime,codeLanguage,created"
            )
            .then(response =>
              response.data.filter(
                levelInfo =>
                  levelInfo &&
                  levelInfo.levelID &&
                  levelInfo.state &&
                  levelInfo.state.complete
              )
            )
            .then(levels => {
              let achievements = false;
              let events = false;

              levels.forEach(levelInfo => {
                if (!existing[levelInfo.levelID]) {
                  achievements = achievements || {};
                  events = events || {};
                  achievements[levelInfo.levelID] = {
                    name: levelInfo.levelName,
                    created: levelInfo.created || "",
                    playtime: (levelInfo && levelInfo.playtime) || 0,
                    complete: true
                  };
                  const newEventKey = admin
                    .database()
                    .ref("/logged_events")
                    .push().key;
                  events[newEventKey] = {
                    createdAt: {
                      ".sv": "timestamp"
                    },
                    isAnonymous: true,
                    type: "UPDATE_ACHIEVEMENTS_DATA",
                    otherActionData: {
                      uid: data.uid,
                      levelId: levelInfo.levelID,
                      complete: true,
                      created: levelInfo.created || "",
                      playtime: (levelInfo && levelInfo.playtime) || 0
                    }
                  };
                }
                return true;
              });

              return admin
                .database()
                .ref(`/userAchievements/${data.uid}/${data.service}`)
                .update({
                  lastUpdate: new Date().getTime(),
                  totalAchievements: levels.filter(
                    levelInfo =>
                      levelInfo && levelInfo.state && levelInfo.state.complete
                  ).length
                })
                .then(
                  achievements
                    ? admin
                        .database()
                        .ref(
                          `/userAchievements/${data.uid}/${
                            data.service
                          }/achievements`
                        )
                        .update(achievements)
                    : Promise.resolve()
                )
                .then(
                  events
                    ? admin
                        .database()
                        .ref("/logged_events")
                        .update(events)
                    : Promise.resolve()
                );
            })

            .then(() => resolve())
        )
        .catch(err => console.error(err.message) || resolve());
    default:
      return Promise.resolve();
  }
}

exports.updateProfile = updateProfile;
exports.updateProfileHttpTrigger =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/updateProfileQueue/tasks/{requestId}")
    .onCreate((snap, context) =>
      new Promise(resolve => updateProfile(snap.val(), resolve)).then(() =>
        admin
          .database()
          .ref(`/updateProfileQueue/tasks/${context.params.requestId}`)
          .remove()
      )
    );
exports.updateProfileDbTrigger = functions.https.onRequest((req, res) => {
  return checkToken(req)
    .then(() => {
      const queue = new Queue(
        admin.database().ref("/updateProfileQueue"),
        (data, progress, resolve) => {
          return updateProfile(data, resolve);
        }
      );

      queue.addWorker();
      res.send("Done");
    })
    .catch(err => res.status(err.code || ERROR_500).send(err.message));
});
