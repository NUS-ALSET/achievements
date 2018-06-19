const admin = require("firebase-admin");

const updateProfile = require("./src/updateProfile");
const executeJupyterSolution = require("./src/executeJupyterSolution");
const outgoingRequests = require("./src/outgoingRequest");

const serviceAccount = require("./config/serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-3d2a4.firebaseio.com"
});

updateProfile.queueHandler();
executeJupyterSolution.queueHandler();
outgoingRequests.queueHandler();
