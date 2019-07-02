import firebase from "firebase/app";
import "firebase/firestore";

import { SOLUTION_PRIVATE_LINK } from "../containers/Root/actions";

const NOT_FOUND_ERROR = 404;

export class CustomAnalysisService {
  constructor() {
    this.addCustomAnalysis = this.addCustomAnalysis.bind(this);
    this.analyseHandler = this.analyseHandler.bind(this);
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
   * This method returns all activities for the paths created
   * by user with uid
   *
   * @param {String} uid user id of path creator
   *
   * @returns {Object} Object containing all activities created
   */
  async fetchMyActivities(uid) {
    return await firebase
      .database()
      .ref("/paths")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(snap => snap.val() || {})
      .then(paths =>
        Promise.all(
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
        )
      );
  }

  /**
   * This method returns all solutions for the selected
   * path/course assignment/activity
   *
   * @param {String} uid user id of creator
   *
   * @returns {Object} Object containing all activities created
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
   * This method returns all assignments for the course created
   * by user with uid
   *
   * @param {String} uid user id of course creator
   *
   * @returns {Object} Object containing all assignments created
   */
  async fetchMyAssignments(uid) {
    return await firebase
      .database()
      .ref("/courses")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(response => response.val() || {})
      .then(courses =>
        Promise.all(
          Object.keys(courses || {}).map(courseKey =>
            firebase
              .database()
              .ref(`/assignments/${courseKey}`)
              .once("value")
              .then(snap => snap.val() || {})
              .then(assignments => ({
                id: courseKey,
                name: courses[courseKey].name,
                assignments: Object.keys(assignments).map(assignmentsKey => ({
                  id: assignmentsKey,
                  name: assignments[assignmentsKey].name,
                  type: assignments[assignmentsKey].type
                }))
              }))
          )
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
    return await firebase
      .firestore()
      .collection("/customAnalysis")
      .add({
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        uid: uid,
        name: customAnalysisName,
        url: customAnalysisUrl,
        ...storeData
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
      .delete();
  }

  /**
   * This method stores the Custom Analysis response
   *
   * @param {String} uid user id of creator
   * @param {String} response collection of user solutions to be analysed
   * @param {String} analysisID Custom Analysis ID
   *
   */

  async storeAnalysis(uid, response, analysisID) {
    await firebase
      .firestore()
      .collection("/customAnalysisResponse")
      .add({
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        uid: uid,
        analysisID: analysisID,
        response: response
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
        analysisID
      })
      .then(response => this.storeAnalysis(uid, response, analysisID))
      .catch(err => console.error(err));
  }
}

export const customAnalysisService = new CustomAnalysisService();
