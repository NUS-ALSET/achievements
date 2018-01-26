/* eslint-disable no-console */
const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-3d2a4.firebaseio.com"
});

admin
  .auth()
  .setCustomUserClaims("0bL57TWyKuZMGvjIueAs292h95B3", {
    someCustomToken: true
  })
  .then(() => console.log("yay"));
