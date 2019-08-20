import firebase from "firebase/app";

class CRUDdemoService {
  WriteToCRUDdemo(value) {
    if (!firebase.auth()) {
      throw new Error("Not logged in");
    }
    firebase
      .database()
      .ref(`/analytics/CRUDdemo/${firebase.auth().currentUser.uid}/`)
      .set(value);
    /* return firebase
    .database()
    .ref(`/analytics/CRUDdemo`)
    .once("value")
    .then(snap => snap.val() || {}) */
  }

  DeleteCRUDdemoData() {
    firebase
      .database()
      .ref(`/analytics/CRUDdemo/${firebase.auth().currentUser.uid}/`)
      .remove();
  }

  fetchActivityAttempts(pathUID) {
    // return Object.keys(activityAttempts).reduce((acc, el) => {
    //   if (activityAttempts[el].pathKey === pathUID) acc[el] = activityAttempts[el];
    //   return acc;
    // }, {})
    return firebase
      .database()
      .ref("/analytics/activityAttempts/")
      .orderByChild("pathKey")
      .equalTo(pathUID)
      .once("value")
      .then(snapshot => snapshot.val());
  }
}

export const _CRUDdemoService = new CRUDdemoService();
