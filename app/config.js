const admin = require("firebase-admin");

constg serviceAccount = require("../config/data.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-3d2a4.firebaseio.com"
});
