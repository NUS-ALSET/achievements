import firebase from "firebase";

class CohortsService {
  addCohort(cohortName, uid, instructorName) {
    const key = firebase
      .database()
      .ref("/cohorts")
      .push().key;

    return firebase
      .database()
      .ref(`/cohorts/${key}`)
      .set({
        name: cohortName,
        owner: uid,
        instructorName
      })
      .then(() => key);
  }
}

/** @type {CohortsService} */
export const cohortsService = new CohortsService();
