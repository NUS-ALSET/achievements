import firebase from "firebase";
import CodeCombatLevels from "./CodeCombatLevels";

export const APP_SETTING = {
  CodeCombatLevels: CodeCombatLevels,
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
  defaultTimeout: 2000,
  GITHUB_BASE_URL: "https://github.com/",
  AWS_SERVER_URL:
    "https://dgiy2j88ll.execute-api.us-east-1.amazonaws.com/dev/helloTest"
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
export const firebaseConfig = firebase;
