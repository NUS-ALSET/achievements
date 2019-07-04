import firebase from "firebase/app";
import "firebase/firestore";

import { SOLUTION_PRIVATE_LINK } from "../containers/Root/actions";

const NOT_FOUND_ERROR = 404;

export class AdminCustomAnalysisService {
  /**
   * This method returns true or false based on whether the given user
   * is an admin or not
   *
   * @param {String} uid user id of creator
   *
   * @returns {Boolean} returns true or false
   */

  async checkAdminStatus(uid) {
    return await firebase
      .database()
      .ref(`/admins/${uid}`)
      .once("value")
      .then(response => response.val());
  }

  constructor() {
    this.addAdminCustomAnalysis = this.addAdminCustomAnalysis.bind(this);
    this.onAdminAnalyse = this.onAdminAnalyse.bind(this);
    this.getQueryResults = this.getQueryResults.bind(this);
    this.buildFirebaseQuery = this.buildFirebaseQuery.bind(this);
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
  async addAdminCustomAnalysis(uid, customAnalysisUrl, customAnalysisName) {
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
      .collection("/adminCustomAnalysis")
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
  async deleteAdminCustomAnalysis(customAnalysisID) {
    await firebase
      .firestore()
      .collection("/adminCustomAnalysis")
      .doc(customAnalysisID)
      .delete();
  }

  async executeFirebaseQuery(firebaseQuery) {
    return await firebaseQuery
      .once("value")
      .then(snap => snap.val() || {})
      .catch(err => {
        console.error(err.message);
      });
  }

  async buildFirebaseQuery(firebaseQueries) {
    try {
      let firebaseQuery;
      let firebaseResults = [];

      for (let oneQuery of firebaseQueries) {
        firebaseQuery = firebase
          .database()
          .ref(`/${oneQuery.query.firebase["ref"]}`);

        for (let option of Object.keys(oneQuery.query.firebase)) {
          if (option !== "ref") {
            let value = oneQuery.query.firebase[option] || null;
            if (value) {
              firebaseQuery = firebaseQuery[option](value);
            }
          }
        }
        let tempResults = await this.executeFirebaseQuery(firebaseQuery);
        firebaseResults.push({
          [oneQuery.name]: tempResults
        });
      }
      return firebaseResults;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getQueryResults(queries) {
    let allResults = [];
    let firebaseResults = await this.buildFirebaseQuery(queries.firebase);
    //let firestoreResults = this.buildFirestoreQuery(queries.firestore);
    allResults.push.apply(allResults, firebaseResults);
    return allResults;
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
    await firebase
      .firestore()
      .collection("/adminCustomAnalysisResponse")
      .add({
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        uid: uid,
        analysisID: analysisID,
        response: response
      });
    return JSON.parse(response.data);
  }

  /**
   * This method calls analysis after fetching the data from firebase/firestore
   * based on the query passed in.
   *
   * @param {String} uid user id of creator
   * @param {String} adminCustomAnalysisID customAnalysis ID to be deleted
   * @param {Object} query queries to be executed to fetch data from the database
   *
   */
  async onAdminAnalyse(uid, adminCustomAnalysisID, queries) {
    try {
      let results = await this.getQueryResults(queries).then();
      return await firebase
        .functions()
        .httpsCallable("runCustomAnalysis")({
          uid,
          solutions: results,
          analysisID: adminCustomAnalysisID,
          analysisType: "adminCustomAnalysis"
        })
        .then(response =>
          this.storeAnalysis(uid, response, adminCustomAnalysisID)
        )
        .catch(err => console.error(err));
    } catch (error) {
      console.error(error.message);
    }
  }
}
export const adminCustomAnalysisService = new AdminCustomAnalysisService();
