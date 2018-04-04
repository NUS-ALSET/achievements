/* eslint-disable no-console */
const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-3d2a4.firebaseio.com"
});

// admin
//   .auth()
//   .createCustomToken("vdI7p5pfGOX6hjLZ3FCLwxw2bLo2", {
//     premiumAccount: true
//   })
//   .then(function(customToken) {
//     console.log("customToken", customToken);
//   })
//   .catch(function(error) {
//     console.log("Error creating custom token:", error);
//   });
//
admin
  .database()
  .ref("/logged_events")
  .remove()
  .then(() => process.exit(0));

// admin
//   .database()
//   .ref("/problems")
//   .orderByChild("owner");
