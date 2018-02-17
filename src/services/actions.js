import firebase from "firebase";

export class ActionsService {
  bannedActions = [];

  static pickActionData(action) {
    action = Object.assign({}, action);
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

  // eslint-disable-next-line no-unused-vars
  catchAction = store => next => action => {
    const currentUser =
      firebase.auth().currentUser && firebase.auth().currentUser.uid;

    if (
      action.type &&
      // Ignore react-redux-firebase builtin actions
      action.type.indexOf("@@reactReduxFirebase") === -1 &&
      !this.bannedActions.includes(action.type) &&
      currentUser
    ) {
      firebase
        .database()
        .ref("/logged_events")
        .push({
          createdAt: {
            ".sv": "timestamp"
          },
          type: action.type,
          uid: currentUser,
          isAnonymous: !currentUser,
          otherActionData: this.removeEmpty(
            ActionsService.pickActionData(action)
          )
        })
        .catch(err => console.error(err));
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
        this.bannedActions = Object.keys(actions.val() || {});
      });
  }
}

/**
 * For some reason IDEA doesn't catch correct type
 * @type {ActionsService}
 */
export const actionsService = new ActionsService();
