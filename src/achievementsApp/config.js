// Import core of Firebase client
import firebase from "firebase/app";

// Import Firebase Authentication (optional)
import "firebase/auth";

// Import Firebase Realtime Database (optional)
import "firebase/database";

// Import Firestore Database
import "firebase/firestore";

// Import Firebase Functions (optional)
import "firebase/functions";

import CodeCombatLevels from "./CodeCombatLevels";

export const APP_SETTING = {
  CodeCombatLevels,
  games: {
    "passenger-picker": {
      id: "passenger-picker",
      name: "Passenger Pick-up"
    },
    squad: {
      id: "squad",
      name: "Squad"
    }
  },
  basename: process.env.REACT_APP_BASENAME || "/",
  defaultThrottle: 500,
  defaultTimeout: 10000,
  GITHUB_BASE_URL: "https://github.com/",
  AWS_SERVER_URL:
    "https://dgiy2j88ll.execute-api.us-east-1.amazonaws.com/dev/helloTest",
  JUPYTER_FILE_UPLOAD_LIMIT: 1, //in MB
  ADMIN_ANALYSIS_LIMIT: 500,
  LOG_ANALYSIS_LIMIT: 100,
  USER_ANALYSIS_LIMIT: 100
};

// Initialize Firebase
const config = {
  apiKey: "AIzaSyA232bBlzWT0fl3ST_KVC3Aay41yTMz5vM",
  authDomain: "achievements-dev.firebaseapp.com",
  databaseURL: "https://achievements-dev.firebaseio.com",
  projectId: "achievements-dev",
  storageBucket: "achievements-dev.appspot.com",
  messagingSenderId: "479020625755"
};

firebase.initializeApp(config);

// initialize Firestore
firebase.firestore();

export const firebaseConfig = firebase;
