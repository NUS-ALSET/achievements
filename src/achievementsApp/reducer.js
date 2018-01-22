import { combineReducers } from "redux";
import { appFrame } from "../containers/AppFrame/reducer";
import { firebaseReducer as firebase } from "react-redux-firebase";
import { courses } from "../containers/Courses/reducer";

export default combineReducers({
  appFrame,
  firebase,
  courses
});
