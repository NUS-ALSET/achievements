import firebase from "firebase";
import levels from "./levels";

export const APP_SETTING = {
  DrawerWidth: 250,
  levels: levels,
  basename: process.env.REACT_APP_BASENAME || "/"
};

export const AUTO_HIDE_DURATION = 6000;

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
