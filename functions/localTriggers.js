const admin = require("firebase-admin");

const updateProfile = require("./src/updateProfile");
const executeJupyterSolution = require("./src/executeJupyterSolution");
const analyseJupyterSolution = require("./src/analyseJupyterSolution");
const outgoingRequests = require("./src/outgoingRequest");
const fetchGithubFiles = require("./src/fetchGithubFiles");
const fetchUserJSON = require("./src/fetchUserJSON");

const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://achievements-dev.firebaseio.com"
});

updateProfile.queueHandler();
executeJupyterSolution.queueHandler();
outgoingRequests.queueHandler();
analyseJupyterSolution.queueHandler();
fetchGithubFiles.queueHandler();
fetchUserJSON.queueHandler();

