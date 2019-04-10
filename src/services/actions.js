import {
  ASSIGNMENTS_SORT_CHANGE,
  UPDATE_NEW_ASSIGNMENT_FIELD
} from "../containers/Assignments/actions";
import {
  COURSE_NEW_DIALOG_CHANGE,
  COURSE_NEW_REQUEST
} from "../containers/Courses/actions";
import firebase from "firebase/app";
import 'firebase/firestore';
export class ActionsService {
  consumerKey = undefined;

  bannedActions = [
    COURSE_NEW_DIALOG_CHANGE,
    COURSE_NEW_REQUEST,
    ASSIGNMENTS_SORT_CHANGE,
    UPDATE_NEW_ASSIGNMENT_FIELD
  ];
  static clearActions = {
    PROBLEM_INIT_SUCCESS: ["payload"]
  };

  static pickActionData(action) {
    action = Object.assign({}, action);
    const clearInfo = ActionsService.clearActions[action.type];

    if (clearInfo) {
      for (const field of clearInfo) {
        delete action[field];
      }
    }

    delete action.type;
    return action;
  }

  removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === "object") {
        this.removeEmpty(obj[key]);
      } else if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }

  // add `store` as first param if needed
  catchAction = () => next => action => {
    const currentUserId =
      firebase.auth().currentUser && firebase.auth().currentUser.uid;
    if (this.consumerKey === undefined && currentUserId) {
      this.consumerKey = "";
      firebase
        .database()
        .ref(`/users/${currentUserId}/consumerKey`)
        .once("value")
        .then(data => (this.consumerKey = data.val() || ""));
    }
    const data = {};
    if (this.consumerKey) {
      data.consumerKey = this.consumerKey;
    }
    if (
      action.type &&
      // Ignore react-redux-firebase builtin actions
      action.type.indexOf("@@reactReduxFirebase") === -1 &&
      !this.bannedActions.includes(action.type) &&
      currentUserId
    ) {
      try {
        firebase
          .database()
          .ref("/logged_events")
          .push({
            ...data,
            createdAt: {
              ".sv": "timestamp"
            },
            type: action.type,
            uid: currentUserId,
            version: process.env.REACT_APP_VERSION,
            otherActionData: JSON.stringify(
              ActionsService.pickActionData(action)
            )
          });
          
          const firestore_db = firebase.firestore();
              
          firestore_db.collection('/logged_events').add({
            ...data,
            createdAt: firebase.firestore.Timestamp.now().toMillis(),
            type: action.type,
            uid: currentUserId,
            version: process.env.REACT_APP_VERSION,
            otherActionData: JSON.stringify(
              ActionsService.pickActionData(action)
            )
          });  
         
      } catch (err) {
        console.error(err, action);
      }
    }
    return next(action);
  };

  constructor() {
    // Refresh blacklist actions on start
    firebase
      .database()
      .ref("/blacklistActions")
      .once("value")
      .then(actions => {
        this.bannedActions = this.bannedActions.concat(
          Object.keys(actions.val() || {})
        );
      });
  }
}

/**
 * For some reason IDEA doesn't catch correct type
 * @type {ActionsService}
 */
export const actionsService = new ActionsService();
