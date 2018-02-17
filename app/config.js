/* eslint-disable no-console */
const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-3d2a4.firebaseio.com"
});

// admin
//   .database()
//   .ref("/test/")
//   .update();
