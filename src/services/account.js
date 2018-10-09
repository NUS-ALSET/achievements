/**
 * Service for actions with account
 */

import { authProvider } from "../achievementsApp/config";
import firebase from "firebase";

export class AccountService {
  static isAdmin = false;

  /**
   * This method converts external profile id (login) to required format
   * @param {String} profileType variant of external profile (e.g. CodeCombat)
   * @param {String} id external profile id (login)
   * @returns {String} converted profile
   */
  static processProfile(profileType, id) {
    switch (profileType) {
      case "CodeCombat":
        return id
          .toLowerCase()
          .replace(/[ _]/g, "-")
          .replace(/[!@#$%^&*()]/g, "");
      default:
        return id;
    }
  }

  signIn() {
    return firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(ref =>
        // Get existing user name and update display name if it doesn't exists
        firebase
          .database()
          .ref(`/users/${ref.user.uid}`)
          .once("value")
          .then(existing => existing.val() || {})
          .then(existing => {
            return (
              firebase
                .database()
                .ref(`/users/${ref.user.uid}`)
                // Get existing user name and update display name if it doesn't exists
                .update({
                  createdAt: existing.createdAt || new Date().getTime(),
                  displayName: existing.displayName || ref.user.displayName,
                  photoURL: ref.user.photoURL
                })
            );
          })
          // Return user ref to continue processing
          .then(() => ref)
      )
      .then(ref =>
        // Update some private fields (could be increased in future)
        firebase
          .database()
          .ref(`/usersPrivate/${ref.user.uid}`)
          .update({
            displayName: ref.user.displayName,
            email: ref.user.email
          })
      );
  }

  checkEULAAgreement() {
    return firebase
      .ref(`/users/${firebase.auth().currentUser.uid}/acceptedEULA`)
      .once("value")
      .then(data => data.val());
  }

  acceptEULA() {
    return firebase
      .ref(`/users/${firebase.auth().currentUser.uid}`)
      .update({ acceptedEULA: true });
  }

  signOut() {
    return firebase.auth().signOut();
  }

  checkAdminStatus(uid) {
    return firebase
      .database()
      .ref(`/admins/${uid}`)
      .once("value")
      .then(response => response.val());
  }

  /**
   *
   * @param {ExternalProfile} externalProfileId
   * @param {String} uid
   * @param {String} login
   */
  addExternalProfile(externalProfileId, uid, login) {
    return firebase.ref(`/userAchievements/${uid}/${externalProfileId}`).set({
      id: login,
      lastUpdate: 0,
      totalAchievements: 0,
      achievements: {}
    });
  }

  watchProfileRefresh(uid, externalProfileId) {
    return firebase.watchEvent(
      "value",
      `/userAchievements/${uid}/${externalProfileId}`
    );
  }

  /**
   *
   * @param {ExternalProfile} externalProfileId
   * @param {String} uid
   * @param {String} login
   */
  refreshAchievements(externalProfileId, uid, login) {
    return firebase.ref("updateProfileQueue/tasks").push({
      service: externalProfileId,
      serviceId: login,
      uid: uid
    });
  }

  fetchJoinedPaths(uid) {
    return Promise.all([
      firebase
        .database()
        .ref(`/users/${uid}/displayName`)
        .once("value")
        .then(snap => snap.val()),
      firebase
        .database()
        .ref(`/studentJoinedPaths/${uid}`)
        .once("value")
        .then(snap => snap.val() || {})
        .then(joinedPathsData =>
          Promise.all(
            Object.keys(joinedPathsData).map(key =>
              firebase
                .database()
                .ref(`/paths/${key}/name`)
                .once("value")
                .then(snap => ({
                  id: key,
                  name: snap.val() || ""
                }))
            )
          )
        ),
      firebase
        .database()
        .ref(`/completedActivities/${uid}`)
        .once("value")
        .then(snap => snap.val() || {})
    ]).then(
      ([userName, paths, solutions]) =>
        userName &&
        paths.map(path => ({
          ...path,
          solutions: Object.keys(solutions[path.id] || {}).length
        }))
    );
  }

  /**
   *
   * @param {ExternalProfile} externalProfileId
   * @param {String} uid
   */
  removeExternalProfile(externalProfileId, uid) {
    return firebase
      .ref(`/userAchievements/${uid}/${externalProfileId}`)
      .remove();
  }

  updateDisplayName(uid, displayName) {
    const needUpdate = ["cohorts", "courses"];
    return firebase
      .database()
      .ref(`/users/${uid}/displayName`)
      .set(displayName)
      .then(() =>
        // Since we cache `instructorName` for cohorts and courses we have
        // update these values directly
        Promise.all(
          needUpdate.map(node =>
            firebase
              .database()
              .ref(`/${node}`)
              .orderByChild("owner")
              .equalTo(uid)
              .once("value")
              .then(snap => snap.val() || {})
              .then(items =>
                Promise.all(
                  Object.keys(items).map(key =>
                    firebase
                      .database()
                      .ref(`/${node}/${key}/instructorName`)
                      .set(displayName)
                  )
                )
              )
          )
        )
      );
  }

  fetchExternalProfiles() {
    // This should be in firebase, I guess
    return {
      CodeCombat: {
        url: "https://codecombat.com",
        id: "CodeCombat",
        name: "CodeCombat",
        description: "learn programming by playing games"
      }
      /* Unnecessary for now
      FreeCodeCamp: {
        url: "https://fetch-free-code-ca.mp",
        description:
          "<a href='https://www.freecodecamp.org'>Free Code Camp</a>, " +
          "Learn to code with free online courses, programming projects, " +
          "and interview preparation for developer jobs."
      },
      PivotalExpert: {
        url: "https://fetch-pivotal-expe.rt",
        description: "Some description"
      } */
    };
  }

  /**
   * This method updates `authTime` data to current. Used mostly for invoking
   * `generateUserRecommendations`
   * @param uid
   */
  authTimeUpdate(uid) {
    return uid
      ? firebase
          .database()
          .ref(`/users/${uid}/lastAuthTime`)
          .set({ ".sv": "timestamp" })
      : Promise.resolve();
  }

  /**
   *
   * @param config
   * @returns {Promise<void>}
   */
  updateAdminConfig(config) {
    const configUpdates = {};
    const jestUpdates = {};
    config = config || {};
    config.recommendations = config.recommendations || {};
    if (config.jupyterLambdaProcessor) {
      configUpdates.jupyterLambdaProcessor = config.jupyterLambdaProcessor;
    }
    if (config.jupyterLambdaProcessor) {
      configUpdates.jupyterAnalysisLambdaProcessor =
        config.jupyterAnalysisLambdaProcessor;
    }
    if (config.awsJestRunnerServerURL) {
      jestUpdates.awsJestRunnerServerURL = config.awsJestRunnerServerURL;
    }
    if (config.githubAccessToken) {
      jestUpdates.githubAccessToken = config.githubAccessToken;
    }
    // FIXIT: should update it with one write but it's not too often procedure
    // so, it could be little unoptimized
    return Promise.all([
      firebase
        .database()
        .ref("/config/recommendations")
        .update(config.recommendations),
      firebase
        .database()
        .ref("/config")
        .update(configUpdates),
      firebase
        .database()
        .ref("/config/jestRunnerConfig")
        .update(jestUpdates)
    ]);
  }

  updateProfileData(uid, field, data) {
    return firebase
      .database()
      .ref(`/users/${uid}/${field}`)
      .set(data);
  }
}

/**
 * @type {AccountService}
 */
export const accountService = new AccountService();
