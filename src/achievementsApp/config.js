import firebase from "firebase";
import levels from "./levels";

export const APP_SETTING = {
  DrawerWidth: 250,
  levels: levels
};

export const AUTO_HIDE_DURATION = 6000;

// Initialize Firebase
const config = {
  apiKey: "AIzaSyC27mcZBSKrWavXNhsDA1HJCeUurPluc1E",
  authDomain: "fir-project-3d2a4.firebaseapp.com",
  databaseURL: "https://fir-project-3d2a4.firebaseio.com",
  projectId: "fir-project-3d2a4",
  storageBucket: "fir-project-3d2a4.appspot.com",
  messagingSenderId: "765594031611"
};
firebase.initializeApp(config);

export const authProvider = new firebase.auth.GoogleAuthProvider();
