import firebase from "firebase";
import levels from "./levels";

export const APP_SETTING = {
  drawerWidth: 250,
  levels: levels,
  basename: process.env.REACT_APP_BASENAME || "/",
  defaultThrottle: 500,
  defaultTimeout: 6000,
  isSuggesting: window.location.href.includes("isSuggesting=true")
};

// Initialize Firebase
// start script's process.env.NODE_ENV = 'development';
// build script's process.env.NODE_ENV = 'production';
// use different firebase database for different script
// default as development
const config = {
  apiKey: "AIzaSyA232bBlzWT0fl3ST_KVC3Aay41yTMz5vM",
  authDomain: "achievements-dev.firebaseapp.com",
  databaseURL: "https://achievements-dev.firebaseio.com",
  projectId: "achievements-dev",
  storageBucket: "achievements-dev.appspot.com",
  messagingSenderId: "479020625755"
};

firebase.initializeApp(config);

export const authProvider = new firebase.auth.GoogleAuthProvider();
// authProvider.addScope("https://www.googleapis.com/auth/drive.file");
