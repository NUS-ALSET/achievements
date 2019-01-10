import firebase from "firebase";


class CRUDdemoService {
  WriteToCRUDdemo(value) {
    if (!firebase.auth()) {
      throw new Error("Not logged in");
    }
    firebase.set(
      `/analytics/CRUDdemo/${firebase.auth().currentUser.uid}/`,
      value
    )
    /* return firebase
    .database()
    .ref(`/analytics/CRUDdemo`)
    .once("value")
    .then(snap => snap.val() || {}) */
  }
}

export const _CRUDdemoService = new CRUDdemoService();