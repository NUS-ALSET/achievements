const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const axios = require("axios");
const lti = require("@dinoboff/ims-lti");

const ERROR_401 = 401;
const profilesRefreshApproach =
  (functions.config().profiles &&
    functions.config().profiles["refresh-approach"]) ||
  "none";
const jupyterLambdaProcessor =
  "https://o6rpv1ofri.execute-api.ap-southeast-1.amazonaws.com/Prod";

let canCreateTokens = false;
let serviceAccount = null;
try {
  serviceAccount = require("./adminsdk.json");
  canCreateTokens = true;
} catch (e) {
  console.error(e.message);
}

// If service account deployed, then use it.
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().firebase.databaseURL
  });
  // Otherwise, initialize with the default config.
} else {
  admin.initializeApp();
}

function processProfileRefreshRequest(data, resolve) {
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

exports.handleNewProblemSolution =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/jupyterSolutionsQueue/tasks/{requestId}")
    .onWrite(change => {
      const data = change.after.val();
      axios({
        url: jupyterLambdaProcessor,
        method: "post",
        data: data.solution
      })
        .then(response =>
          admin
            .database()
            .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
            .set({
              owner: data.owner,
              solution: response.data
            })
        )
        .catch(() =>
          admin
            .database()
            .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
            .set(false)
        );
    });

exports.handleProblemSolutionQueue = functions.https.onRequest((req, res) => {
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
        admin.database().ref("/jupyterSolutionsQueue"),
        (data, progress, resolve) =>
          axios({
            url: jupyterLambdaProcessor,
            method: "post",
            data: data.solution
          })
            .then(response =>
              admin
                .database()
                .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
                .set({
                  owner: data.owner,
                  solution: response.data
                })
            )
            .catch(() =>
              admin
                .database()
                .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
                .set(false)
            )
            .then(() => resolve())
      );
      queue.addWorker();
      res.send("Done");
    });
});

exports.handleNewSolution = functions.database
  .ref("/solutions/{courseId}/{studentId}/{assignmentId}")
  .onWrite(event => {
    const { courseId, studentId, assignmentId } = event.params;

    return admin
      .database()
      .ref(`/assignments/${courseId}/${assignmentId}`)
      .once("value")
      .then(assignment => {
        assignment = assignment.val();
        // Fixit: add more assignment conditions
        // We should process only solutions for actual assignments
        if (assignment.visible) {
          return admin
            .database()
            .ref(`/visibleSolutions/${courseId}/${studentId}/${assignmentId}`)
            .set(
              assignment.solutionVisible
                ? event.data.val()
                : Object.assign(event.data.val(), { value: "Complete" })
            );
        }
        return true;
      });
  });

exports.handleProfileRefreshRequest =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/updateProfileQueue/tasks/{requestId}")
    .onCreate(event =>
      new Promise(resolve =>
        processProfileRefreshRequest(event.data.val(), resolve)
      ).then(() =>
        admin.database
          .ref(`/updateProfileQueue/tasks/${event.params.requestId}`)
          .remove()
      )
    );

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
          return processProfileRefreshRequest(data, resolve);
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

/* eslint-disable */
exports.api = functions.https.onRequest((req, res) => {
  let { token, data } = req.query;
  let supportedDatatypes = [
    "users",
    "cohorts",
    "courses",
    "assignments",
    "solutions",
    "courseMembers",
    "cohortCourses",
    "problems",
    "paths",
    "problemSolutions",
    "usage"
  ];
  if (!supportedDatatypes.includes(data)) {
    res.send("Unsupported data type " + data);
  }
  if (data === "usage") {
    data = "apiTracking/" + token;
  }
  if (token) {
    admin
      .database()
      .ref("api_tokens/" + token)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          const ref = admin.database().ref(data);
          let promise;
          let startFrom;
          let stopAt;
          promise = ref.once("value");

          promise.then(snapshot2 => {
            const theData = snapshot2.val();
            if (theData) {
              // Track cost against API key
              // Put a node in the apikeys cost tracking.
              const apiTrackingRef = admin
                .database()
                .ref("apiTracking/" + token);
              let size = JSON.stringify(theData).length;
              apiTrackingRef
                .child("usage")
                .push({
                  data: data,
                  size: size,
                  createdAt: {
                    ".sv": "timestamp"
                  }
                })
                .then(snapshot2 => {
                  console.log("Recording api resource usage.");

                  // Update the total
                  apiTrackingRef
                    .child("totalUsage")
                    .transaction(function(total) {
                      if (total) {
                        total += size;
                      } else {
                        total = size;
                      }
                      return total;
                    })
                    .then(snap => {
                      // And finally, send back data
                      res.send(theData);
                    });
                });
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

function redirectToLogin(message, res) {
  res.redirect(`${message}`);
}

// Tests to see if /users/<userId> has any data.
function checkIfUserExists(data, res) {
  let uid = data["user_id"] + "@" + data["oauth_consumer_key"];
  var newString = uid.split(".").join("---");
  admin
    .database()
    .ref(`/users/` + newString)
    .once("value", function(snapshot) {
      var exists = snapshot.val() !== null;
      get_token(data, res, exists);
      // res.send(exists);
    });
}

function get_token(data, res, exists) {
  //Create a new user.
  let uid = data["user_id"] + "@" + data["oauth_consumer_key"];
  admin
    .auth()
    .createCustomToken(uid)
    .then(function(customToken) {
      console.log("Custom token here: ", customToken);
      let message = "user_id -> " + data["user_id"] + "\n";
      message += "oauth_consumer_key -> " + data["oauth_consumer_key"] + "\n";
      message += "create user -> " + uid + "\n";
      message += "redirect to\n\n ";
      message += data["APP_REDIRECT_URL"] + customToken;
      var link = data["APP_REDIRECT_URL"] + customToken;

      var newString = uid.split(".").join("---");
      // data['oauth_consumer_key'] = newString;

      if (exists) {
        admin
          .database()
          .ref(`/users/` + newString)
          .update({})
          .then(function(snap) {
            redirectToLogin(link, res);
          })
          .catch(function(error) {
            console.log("Error creating user:", error);
          });
      } else {
        admin
          .database()
          .ref(`/users/` + newString)
          .update({
            isLTI: true,
            displayName: data["user_id"],
            consumerKey: data["oauth_consumer_key"]
          })
          .then(function(snap) {
            redirectToLogin(link, res);
          })
          .catch(function(error) {
            console.log("Error creating user:", error);
          });
      }
    })
    .catch(function(error) {
      console.log("Error creating custom token:", error);
    });
}

exports.ltiLogin = functions.https.onRequest((req, res) => {
  let data = req.body;
  let oauth_consumer_key = data["oauth_consumer_key"];
  let user_id = data["user_id"];

  // Hardcoding secret until starts being pulled form database.
  let consumerSecret = "secret";

  //let provider = new lti.Provider(oauth_consumer_key , consumerSecret);
  var provider = new lti.Provider(oauth_consumer_key, consumerSecret, {
    trustProxy: true
  });
  if (!req.path) {
    req.url = "/ltiLogin";
  }

  if (req.headers["x-appengine-https"] == "on") {
    req.headers["x-forwarded-proto"] = "https";
  }
  req.protocol = "https";
  provider.valid_request(req, req.body, function(err, isValid) {
    /*
    To work around the lti library issue, but continue on with development, we will automatically login
    specific test users attempting to use a specifc consumer key.
    */
    let testUser = false;
    if (
      oauth_consumer_key == "AWESOME_CONSUMER_KEY" &&
      user_id == "AWESOME_USER_1"
    ) {
      testUser = true;
    }

    //if isValid or testUser, continue to login.
    if (isValid || testUser) {
      // Get the redirectURL and other lti details from the database.
      admin
        .database()
        .ref("lti")
        .once("value")
        .then(snapshot => {
          ltiData = snapshot.val();
          data["APP_REDIRECT_URL"] =
            ltiData["redirectUrl"] +
            "?pause=" +
            ltiData["pauseRedirect"] +
            "&token=";
          if (canCreateTokens) {
            checkIfUserExists(data, res);
          } else {
            res.send(
              "Cannot create tokens. Service account file may not have been deployed."
            );
          }
        });
    } else {
      let message =
        "LTI login request was invalid. protocol -> " +
        req.protocol +
        " error-> " +
        err;
      message +=
        "oauth_consumer_key -> " +
        oauth_consumer_key +
        " user_id -> " +
        user_id;
      message += "\nisValid ->" + isValid;
      message += "\n\n" + JSON.stringify(data);
      res.send(message);
    }
  });
});
/* eslint-enable */
