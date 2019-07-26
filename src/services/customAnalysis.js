import firebase from "firebase/app";
import "firebase/firestore";

import { SOLUTION_PRIVATE_LINK } from "../containers/Root/actions";

const NOT_FOUND_ERROR = 404;

export class CustomAnalysisService {
  constructor() {
    this.formAnalysisContents = this.formAnalysisContents.bind(this);
    this.addCustomAnalysis = this.addCustomAnalysis.bind(this);
    this.analyseHandler = this.analyseHandler.bind(this);
    this.updateCustomAnalysis = this.updateCustomAnalysis.bind(this);
  }
  auth() {
    return new Promise(resolve =>
      window.gapi.load("client:auth2", () => {
        window.gapi.client
          .init({
            apiKey: "AIzaSyC27mcZBSKrWavXNhsDA1HJCeUurPluc1E",
            clientId:
              "765594031611-aitdj645mls974mu5oo7h7m27bh50prc.apps." +
              "googleusercontent.com",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
            ]
          })
          .then(resolve);
      })
    );
  }
  /**
   * This method returns all paths where the user is
   * either the owner or a colllaborator
   *
   * @param {String} uid user id of path creator/collaborator
   *
   * @returns {Object} Object containing all paths related to user
   */
  fetchMyPaths(uid) {
    return Promise.all([
      firebase
        .database()
        .ref("/paths")
        .orderByChild("owner")
        .equalTo(uid)
        .once("value")
        .then(snap => snap.val() || {}),
      firebase
        .database()
        .ref("/pathAssistants")
        .orderByChild(uid)
        .equalTo(true)
        .once("value")
        .then(snap => snap.val() || {})
        .then(assistantPaths =>
          Promise.all(
            Object.keys(assistantPaths || {}).map(pathKey =>
              firebase
                .database()
                .ref(`/paths/${pathKey}`)
                .once("value")
                .then(snap => (snap.val() ? { [pathKey]: snap.val() } : {}))
            )
          )
        )
    ]).then(([myPaths, assistantPaths]) => {
      let paths = Object.assign({}, myPaths);
      assistantPaths.forEach(assistantPath => {
        paths = { ...paths, ...assistantPath };
      });
      return paths;
    });
  }
  /**
   * This method returns all activities for the paths created/collaborated
   * by user with uid
   *
   * @param {Object} paths all the paths either created/collaborated by the user
   *
   * @returns {Object} Object containing all activities created
   */
  fetchMyActivities(paths) {
    return Promise.all(
      Object.keys(paths || {}).map(pathKey =>
        firebase
          .database()
          .ref("/activities")
          .orderByChild("path")
          .equalTo(pathKey)
          .once("value")
          .then(snap => snap.val() || {})
          .then(activities => ({
            id: pathKey,
            name: paths[pathKey].name,
            activities: Object.keys(activities).map(activityKey => ({
              id: activityKey,
              name: activities[activityKey].name,
              type: activities[activityKey].type
            }))
          }))
      )
    );
  }

  /**
   * This method returns all solutions for the selected
   * path/course assignment/activity
   *
   * @param {String} uid user id of creator
   *
   * @returns {Object} Object containing solutions for
   * the activities/assignment created/collaborated by the user
   */
  async fetchSolutionsHandler(typeSelected, typeID, activityID) {
    if (typeSelected === "Path") {
      return await firebase
        .ref(`/problemSolutions/${activityID}`)
        .once("value")
        .then(snap => snap.val() || {})
        .then(solutions => {
          let solutionsSelected = [];
          Object.keys(solutions).forEach(user => {
            solutionsSelected.push(solutions[user]);
          });
          return solutionsSelected;
        });
    } else {
      /**
       * Course's assignment solutions are stored in /solutions/courseID/userID/assignmentID/
       * TODO : Find an effective soltion to fetch solutions to an assignment on a course regardless of user
       */
      return await firebase
        .ref(`/solutions/${typeID}`)
        .once("value")
        .then(snap => snap.val() || {})
        .then(users => {
          let solutionsSelected = [];
          Object.keys(users).forEach(user => {
            if (users[user][activityID])
              solutionsSelected.push(users[user][activityID]);
          });
          return solutionsSelected;
        });
    }
  }
  /**
   * This method returns all courses where the user is
   * either the owner or an assistant
   *
   * @param {String} uid user id of path creator/assistant
   *
   * @returns {Object} Object containing all courses related to user
   */
  fetchMyCourses(uid) {
    return Promise.all([
      firebase
        .database()
        .ref("/courses")
        .orderByChild("owner")
        .equalTo(uid)
        .once("value")
        .then(snap => snap.val() || {}),
      firebase
        .database()
        .ref("/courseAssistants")
        .orderByChild(uid)
        .equalTo(true)
        .once("value")
        .then(snap => snap.val() || {})
        .then(assistantCourses =>
          Promise.all(
            Object.keys(assistantCourses || {}).map(courseKey =>
              firebase
                .database()
                .ref(`/courses/${courseKey}`)
                .once("value")
                .then(snap => (snap.val() ? { [courseKey]: snap.val() } : {}))
            )
          )
        )
    ]).then(([myCourses, assistantCourses]) => {
      let courses = Object.assign({}, myCourses);
      assistantCourses.forEach(assistantCourse => {
        courses = { ...courses, ...assistantCourse };
      });
      return courses;
    });
  }

  /**
   * This method returns all assignments for the paths created/assisted
   * by user with uid
   *
   * @param {Object} courses all the courses either created/assisted by the user
   *
   * @returns {Object} Object containing all assignments created/assisted
   */
  fetchMyAssignments(courses) {
    return Promise.all(
      Object.keys(courses || {}).map(courseKey =>
        firebase
          .database()
          .ref(`/assignments/${courseKey}`)
          .once("value")
          .then(snap => snap.val() || {})
          .then(assignments => ({
            id: courseKey,
            name: courses[courseKey].name,
            assignments: Object.keys(assignments).map(assignmentKey => ({
              id: assignmentKey,
              name: assignments[assignmentKey].name,
              type: assignments[assignmentKey].type
            }))
          }))
      )
    );
  }

  /**
   * This method takes in the file id from the url and returns
   * notebook contents for the passed in fileID.
   *
   * @param {String} fileID file id from the Custom Analysis url
   *
   * @returns {Object} Object containing notebook contents
   */

  fetchFile(fileId) {
    const request = window.gapi.client.drive.files.get({
      fileId,
      alt: "media"
    });
    return new Promise((resolve, reject) =>
      request.execute(data => {
        if (data.code && data.code === NOT_FOUND_ERROR) {
          return reject(new Error(SOLUTION_PRIVATE_LINK));
        }
        resolve({
          ...data,
          cells: (data.cells || []).filter(d =>
            d.source.join("").replace(/\n/g, "")
          ),
          result: {
            ...data.result,
            cells: data.result.cells.filter(
              d => d.source.join("").replace(/\n/g, "").length > 0
            )
          }
        });
      })
    );
  }

  /**
   * This method forms the contents of the analysis notebook.
   * If the url submitted is for a cloud function then the type is set.
   * Otherwise for jupyter notebook urls the notebook contents are fetched.
   *
   * @param {String} uid user id of creator
   * @param {String} customAnalysisUrl Colab URL/ Cloud Function url for analysis
   *
   */
  async formAnalysisContents(customAnalysisUrl) {
    let storeData = {};
    let result = /https:\/\/colab.research.google.com\/drive\/([^/&?#]+)/.exec(
      customAnalysisUrl
    );
    if (result && result[1]) {
      // Colaboratory link. Fetch notebook contents
      let fileID = result[1];
      let data = await this.fetchFile(fileID);
      storeData = { analysisNotebook: JSON.stringify(data), type: "jupyter" };
    } else {
      // Cloud function. No notebook contents to fetch.
      storeData = { type: "cloudFunction" };
    }
    return storeData;
  }

  /**
   * This method adds custom analysis details to firestore.
   * URL stored can be of two types -
   * 1. Colaboratory URL :
   *    Custom Analysis type : "jupyter"
   *    Notebook contents stored along with other details.
   * 2. Cloud Function :
   *    Custom Analysis type : "cloudFunction"
   *
   * @param {String} uid user id of creator
   * @param {String} customAnalysisUrl Colab URL/ Cloud Function url for analysis
   * @param {String} customAnalysisName Custom Analysis name
   *
   */
  async addCustomAnalysis(uid, customAnalysisUrl, customAnalysisName) {
    let storeData = await this.formAnalysisContents(customAnalysisUrl);
    return await firebase
      .firestore()
      .collection("/customAnalysis")
      .add({
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        uid: uid,
        name: customAnalysisName,
        url: customAnalysisUrl,
        ...storeData
      })
      .then(docRef => {
        firebase
          .firestore()
          .collection("/logged_events")
          .add({
            createdAt: firebase.firestore.Timestamp.now().toMillis(),
            type: "CUSTOM_ANALYSIS_CREATE",
            uid: uid,
            version: process.env.REACT_APP_VERSION,
            otherActionData: { customAnalysis: docRef.id }
          });
      });
  }

  /**
   * This method removes the custom activity of the given
   * custom analysis id and user id
   *
   * @param {String} uid user id of creator
   * @param {String} customAnalysisID customAnalysis ID to be deleted
   *
   */
  async deleteCustomAnalysis(uid, customAnalysisID) {
    await firebase
      .firestore()
      .collection("/customAnalysis")
      .doc(customAnalysisID)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection("/logged_events")
          .add({
            createdAt: firebase.firestore.Timestamp.now().toMillis(),
            type: "CUSTOM_ANALYSIS_DELETE",
            uid: uid,
            version: process.env.REACT_APP_VERSION,
            otherActionData: { customAnalysis: customAnalysisID }
          });
      });
  }

  /**
   * This method updates the custom activity of the given
   * custom analysis id and user id
   *
   * @param {String} uid user id of creator
   * @param {String} customAnalysisID customAnalysis ID to be deleted
   *
   */
  async updateCustomAnalysis(uid, customAnalysisID) {
    let docRef = firebase
      .firestore()
      .collection("/customAnalysis")
      .doc(customAnalysisID);
    await docRef.get().then(async doc => {
      let customAnalysis = doc.data();
      let storeData = await this.formAnalysisContents(customAnalysis.url);
      docRef
        .update({
          createdAt: firebase.firestore.Timestamp.now().toMillis(),
          ...storeData
        })
        .then(() => {
          firebase
            .firestore()
            .collection("/logged_events")
            .add({
              createdAt: firebase.firestore.Timestamp.now().toMillis(),
              type: "CUSTOM_ANALYSIS_UPDATE",
              uid: uid,
              version: process.env.REACT_APP_VERSION,
              otherActionData: { customAnalysis: customAnalysisID }
            });
        });
    });
  }

  /**
   * This method stores the Custom Analysis response
   *
   * @param {String} uid user id of creator
   * @param {String} response Analysis Response
   * @param {String} analysisID Custom Analysis ID
   *
   */

  async storeAnalysis(uid, response, analysisID) {
    let docRef = firebase
      .firestore()
      .collection("/customAnalysisResponse")
      .doc(analysisID);
    let data = {};
    data = {
      createdAt: firebase.firestore.Timestamp.now().toMillis(),
      uid: uid,
      response: JSON.parse(response.data).results
        ? JSON.stringify(JSON.parse(response.data).results)
        : JSON.parse(response.data).result,
      ipynb: JSON.stringify(JSON.parse(response.data).ipynb)
    };
    await docRef.set(data).then(() => {
      firebase
        .firestore()
        .collection("/logged_events")
        .add({
          createdAt: firebase.firestore.Timestamp.now().toMillis(),
          type: "CUSTOM_ANALYSIS_EXECUTE",
          uid: uid,
          version: process.env.REACT_APP_VERSION,
          otherActionData: { customAnalysisResponse: analysisID }
        });
    });
    return JSON.parse(response.data);
  }

  /**
   * This method calls the custom analysis cloud function - runCustomAnalysis
   * Two possible cases -
   * 1. Analysis Type - Jupyter/Colab link:
   *    Call the Jupyter Executer with the colab notebook contents and
   *    the solutions as a data.json file.
   * 2. Analysis Type - Cloud Function link:
   *    Call the Cloud function with solutions in the request body
   *
   * @param {String} uid user id of creator
   * @param {Array} solutions collection of user solutions to be analysed
   * @param {String} analysisID Custom Analysis ID
   *
   */
  async analyseHandler(uid, solutions, analysisID) {
    return await firebase
      .functions()
      .httpsCallable("runCustomAnalysis")({
        uid,
        solutions,
        analysisID,
        analysisType: "customAnalysis"
      })
      .then(response => this.storeAnalysis(uid, response, analysisID))
      .catch(err => console.error(err));
  }
}

export const customAnalysisService = new CustomAnalysisService();
