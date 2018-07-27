import firebase from "firebase";
import levels from "./levels";

export const APP_SETTING = {
  drawerWidth: 250,
  levels: levels,
  basename: process.env.REACT_APP_BASENAME || "/",
  defaultThrottle: 500,
  defaultTimeout: 6000,
  isSuggesting: window.location.href.includes("isSuggesting=true"),
  GITHUB_BASE_URL: 'https://github.com/',
  GITHUB_SERVER_URL: 'https://api.github.com',
  RAW_GIT_URL: 'https://raw.githubusercontent.com',
  AWS_SERVER_URL: 'https://dgiy2j88ll.execute-api.us-east-1.amazonaws.com/dev/helloTest',
  GITHUB_ACCESS_TOKEN: atob('NDlmNDE5OWM0MGNmM2Q1OTA1NTEwOTM3OWFiMzhmOGExYjcwMTE2Yw=='),
};

// Initialize Firebase
const config = {
  // apiKey: "AIzaSyA232bBlzWT0fl3ST_KVC3Aay41yTMz5vM",
  // authDomain: "achievements-dev.firebaseapp.com",
  // databaseURL: "https://achievements-dev.firebaseio.com",
  // projectId: "achievements-dev",
  // storageBucket: "achievements-dev.appspot.com",
  // messagingSenderId: "479020625755"
  apiKey: "AIzaSyDFhwVmkAD_Uq-abtHserMz4mOHuR7M6cc",
  authDomain: "react-firebase-19d1f.firebaseapp.com",
  databaseURL: "https://react-firebase-19d1f.firebaseio.com",
  projectId: "react-firebase-19d1f",
  storageBucket: "react-firebase-19d1f.appspot.com",
  messagingSenderId: "911112473910"
};

firebase.initializeApp(config);

export const authProvider = new firebase.auth.GoogleAuthProvider();
// authProvider.addScope("https://www.googleapis.com/auth/drive.file");
