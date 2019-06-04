/**
 * Service for actions with account
 */
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseService } from "./firebaseQueueService";
const authProvider = new firebase.auth.GoogleAuthProvider();
// authProvider.addScope("https://www.googleapis.com/auth/drive.file");

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
    const now = new Date().getTime();
    let index = 0;
    return new Promise((resolve, reject) =>
      firebase
        .database()
        .ref(`/userAchievements/${uid}/${externalProfileId}`)
        .on("value", snap => {
          const val = snap.val();
          if (index && !val) {
            reject(new Error("Invalid CodeCombat username provided"));
          }
          index += 1;
          if (val && val.lastUpdate && val.lastUpdate > now) {
            firebase
              .database()
              .ref(`/userAchievements/${uid}/${externalProfileId}`)
              .off();
            resolve(val);
          }
        })
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

  fetchAchievements(uid, service = "CodeCombat") {
    return firebase
      .database()
      .ref(`/userAchievements/${uid}/${service}`)
      .once("value")
      .then(snap => snap.val());
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
   * Replaces auth with provided UID. Available only for admins
   *
   * @param {String} uid custom UID to auth with
   */
  authWithCustomToken(uid) {
    return firebase
      .functions()
      .httpsCallable("createCustomToken")({ uid })
      .then(response => response && response.data)
      .then(token => {
        if (!token) {
          throw new Error("Invalid UID");
        }
        return firebase.auth().signInWithCustomToken(token);
      });
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
    if (config.codeCombatProfileURL) {
      configUpdates.codeCombatProfileURL = config.codeCombatProfileURL;
    }
    if (config.jupyterAnalysisLambdaProcessor) {
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

  watchVersionChange(callback) {
    firebase
      .database()
      .ref("/config/version")
      .on("value", snap => callback({ version: snap.val() }));
    return () =>
      firebase
        .database()
        .ref("/config/version")
        .off();
  }
  fetchUserJSON(uid) {
    return new Promise(resolve => {
      firebaseService
        .startProcess(
          {
            owner: uid
          },
          "newFetchUserJSONQueue",
          "Fetch JSON Data"
        )
        .then(res => {
          resolve(res);
        });
    });
  }

  savePromoCode(data) {
    const db = firebase.firestore();
    const code = data.promocode.split("=");
    return db.collection("/logged_events").add({
      type :  data.type,
      createdAt: Date.now(),
      uid: data.uid,
      query: {
        [code[0]]: code[1]
      }
    });
  }

  saveNavigationChange(data) {
    const db = firebase.firestore();
    const code = data.promocode.split("=");
    const PROMO_CODE_NAV_TRACK = "PROMO_CODE_NAV_TRACK";
    const output = {
      type : PROMO_CODE_NAV_TRACK,
      createdAt: Date.now(),
      uid: data.uid,
      query: {
        [code[0]]: code[1]
      },
      visitedPath : data.pathName
    };
    return db.collection("/logged_events").add(output);
  }
}

/**
 * @type {AccountService}
 */
export const accountService = new AccountService();
