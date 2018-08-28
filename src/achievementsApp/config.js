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
};

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDQuGo8wKcxLbLZo56aYWLTdP2qrbMamYQ",
  authDomain: "achievements-prod.firebaseapp.com",
  databaseURL: "https://achievements-prod.firebaseio.com",
  projectId: "achievements-prod",
  storageBucket: "achievements-prod.appspot.com",
  messagingSenderId: "829016923358"
};
firebase.initializeApp(config);

export const authProvider = new firebase.auth.GoogleAuthProvider();
// authProvider.addScope("https://www.googleapis.com/auth/drive.file");
