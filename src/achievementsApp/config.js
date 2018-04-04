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
authProvider.addScope("https://www.googleapis.com/auth/drive.file");
