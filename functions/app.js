/* eslint-disable no-console,no-magic-numbers */

const admin = require("firebase-admin");
const serviceAccount = require("./config/achievements-dev-b323fe3fe2d7");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://achievements-dev.firebaseio.com"
});

const actor = require("./src/api");
actor
  .handler("kaiyuan_rockstar", "moreProblemsRequests")
  .then(data => console.log(data))
  .then(() => process.exit())
  .catch(err => console.error(err) || process.exit(1));
//
// Promise.all(
//   ["-LNi6JHQKZOlBKD46w5y"].map(key =>
//     actor.handler("-LNi6JHQKZOlBKD46w5y", key)
//   )
// )
//   .then(() => process.exit())
//   .catch(() => process.exit());

// admin
//   .database()
//   .ref("/logged_events")
//   .orderByChild("type")
//   .equalTo("HOME_OPEN_RECOMMENDATION")
//   .once("value")
//   .then(data =>
//     Promise.all(
//       Object.keys(data.val()).map(key =>
//         admin
//           .database()
//           .ref(`/logged_events/${key}`)
//           .remove()
//       )
//     )
//   );
