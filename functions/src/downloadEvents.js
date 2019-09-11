/* eslint-disable no-magic-numbers */
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const checkToken = require("./utils/checkToken");

exports.httpTrigger = functions.https.onRequest((req, res) => {
  return checkToken(req).then(() => {
    const { start, stop = 0 } = req.query;
    const ref = admin.firestore().collection("logged_events");
    let promise;
    let startFrom;
    let stopAt;

    if (!start) {
      if (stop) {
        stopAt = Date.now() - stop * 24 * 60 * 60 * 1000;
        promise = ref
          .orderBy('createdAt')
          .endAt(stopAt)
          .limit(100).get();
          ;
      } else {
        promise = ref.limit(100).get();
      }
    } else {
      if (stop) {
        stopAt = Date.now() - stop * 24 * 60 * 60 * 1000;
        startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000;
        promise = ref.get()
          .orderBy("createdAt")
          .startAt(startFrom)
          .endAt(stopAt)
          .limit(100)
          .get();
      } else {
        startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000;
        promise = ref
          .orderBy("createdAt")
          .startAt(startFrom)
          .limit(100)
          .get();
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
