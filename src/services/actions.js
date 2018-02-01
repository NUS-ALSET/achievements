import firebase from "firebase";

export class ActionsService {
  bannedActions = ["MAIN_DRAWER_TOGGLE"];

  static pickActionData(action) {
    action = Object.assign({}, action);
    delete action.type;
    return action;
  }

  removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof HTMLElement) {
        obj[key] = "htmlElement";
      }
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
    const currentUser =
      firebase.auth().currentUser && firebase.auth().currentUser.uid;

    if (
      action.type.indexOf("@@reactReduxFirebase") === -1 &&
      !this.bannedActions.includes(action.type) &&
      currentUser
    ) {
      firebase
        .database()
        .ref("/logged_events")
        .push({
          createdAt: new Date().getTime(),
          type: action.type,
          uid: (currentUser && currentUser.uid) || null,
          isAnonymous: !currentUser,
          otherActionData: this.removeEmpty(
            ActionsService.pickActionData(action)
          )
        })
        .catch(err => console.error(err));
    }
    return next(action);
  };
}

export const actionsService = new ActionsService();
