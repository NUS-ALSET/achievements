import firebase from "firebase";
import levels from "./levels";

export const APP_SETTING = {
  drawerWidth: 250,
  levels: levels,
  games : {
    "passenger-picker" : {
      "id" : "passenger-picker",
      "name" : "Passenger Picker"
    },
    // "squad" : {
    //   "id" : "squad",
    //   "name" : "Squad"
    // }
  },
  basename: process.env.REACT_APP_BASENAME || "/",
  defaultThrottle: 500,
  defaultTimeout: 6000,
  isSuggesting: window.location.href.includes("isSuggesting=true"),
  GITHUB_BASE_URL: 'https://github.com/',
  AWS_SERVER_URL: 'https://dgiy2j88ll.execute-api.us-east-1.amazonaws.com/dev/helloTest',
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

export const authProvider = new firebase.auth.GoogleAuthProvider();
// authProvider.addScope("https://www.googleapis.com/auth/drive.file");
