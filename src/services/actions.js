import firebase from "firebase";

export class ActionsService {
  bannedActions = ["MAIN_DRAWER_TOGGLE"];

  setStore(store) {
    this.store = store;
  }

  removeEmpty(obj) {
    Object.keys(obj).forEach(function(key) {
      if (obj[key] && typeof obj[key] === "object") {
        this.removeEmpty(obj[key]);
      } else if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }

  // eslint-disable-next-line no-unused-vars
  catchAction = store => next => action => {
    if (
      action.type.indexOf("@@reactReduxFirebase") === -1 &&
      !this.bannedActions.includes(action.type) &&
      firebase.auth().currentUser &&
      firebase.auth().currentUser.uid
    ) {
      firebase
        .database()
        .ref("/logged_events")
        .push({
          createdAt: new Date().getTime(),
          action: this.removeEmpty(action)
        });
    }
    return next(action);
  };
}

export const actionsService = new ActionsService();
