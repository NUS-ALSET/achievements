/* eslint-disable no-magic-numbers */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const axios = require("axios");

const ERROR_401 = 401;

admin.initializeApp(functions.config().firebase);

exports.handleProfileQueue = functions.https.onRequest((req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(ERROR_401).send("Token is missing");
  }

  admin
    .database()
    .ref("api_tokens/" + token)
    .once("value")
    .then(snapshot => {
      if (!snapshot.val()) {
        return res.status(ERROR_401).send("Invalid token");
      }

      const queue = new Queue(
        admin.database().ref("/updateProfileQueue"),
        (data, progress, resolve) => {
          switch (data.service) {
            case "CodeCombat":
              return axios
                .get(
                  `https://codecombat.com/db/user/${
                    data.serviceId
                  }/level.sessions?project=state.complete,levelID,` +
                    "levelName,playtime,codeLanguage,created"
                )
                .then(response =>
                  response.data.filter(levelInfo => levelInfo.levelID)
                )
                .then(levels => {
                  const achievements = {};

                  levels.forEach(levelInfo => {
                    achievements[levelInfo.levelID] = {
                      name: levelInfo.levelName,
                      complete:
                        (levelInfo &&
                          levelInfo.state &&
                          levelInfo.state.complete) ||
                        false
                    };
                  });

                  admin
                    .database()
                    .ref(`/userAchievements/${data.uid}/${data.service}`)
                    .update({
                      achievements,
                      lastUpdate: new Date().getTime(),
                      totalAchievements: levels.filter(
                        levelInfo =>
                          levelInfo &&
                          levelInfo.state &&
                          levelInfo.state.complete
                      ).length
                    });
                })
                .then(() => resolve());
            default:
              return resolve();
          }
        }
      );

      queue.addWorker();
      res.send("Done");
    });
});

exports.downloadEvents = functions.https.onRequest((req, res) => {
  const { token, start, stop = 0 } = req.query;

  if (token) {
    admin
      .database()
      .ref("api_tokens/" + token)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          const ref = admin.database().ref("logged_events");
          let promise;
          let startFrom;
          let stopAt;

          if (!start) {
            if (stop) {
              stopAt = Date.now() - stop * 24 * 60 * 60 * 1000;
              promise = ref
                .once("value")
                .orderByChild("createdAt")
                .endAt(stopAt);
            } else {
              promise = ref.once("value");
            }
          } else {
            if (stop) {
              stopAt = Date.now() - stop * 24 * 60 * 60 * 1000;
              startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000;
              promise = ref
                .orderByChild("createdAt")
                .startAt(startFrom)
                .endAt(stopAt)
                .once("value");
            } else {
              startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000;
              promise = ref
                .orderByChild("createdAt")
                .startAt(startFrom)
                .once("value");
            }
          }

          promise.then(snapshot2 => {
            const log_object = snapshot2.val();
            if (log_object) {
              res.send(log_object);
            } else {
              res.send("No data");
            }
          });
        } else {
          res.send("Invalid token");
        }
      });
  } else {
    res.send("Token is missing ");
  }
});
