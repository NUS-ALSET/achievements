/* eslint-disable no-magic-numbers */
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const checkToken = require("./utils/checkToken");

exports.httpTrigger = functions.https.onRequest((req, res) => {
  return checkToken(req).then(() => {
    const { start, stop = 0 } = req.query;
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
  });
});
