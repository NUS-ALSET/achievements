import firebase from "firebase";

export class PathsService {
  auth() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        apiKey: "AIzaSyC27mcZBSKrWavXNhsDA1HJCeUurPluc1E",
        clientId:
          "765594031611-aitdj645mls974mu5oo7h7m27bh50prc.apps." +
          "googleusercontent.com",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
        ],
        scope: "https://www.googleapis.com/auth/drive.readonly"
      });
    });
  }

  fetchProblemFile(ownerId, problemId) {
    return firebase
      .database()
      .ref(`/problems/${ownerId}/${problemId}/problemURL`)
      .once("value")
      .then(data => data.val())
      .then(response => /file\/d\/([^/]+)/.exec(response)[1])
      .then(fileId => this.fetchFile(fileId));
  }

  fetchFile(fileId) {
    return window.gapi.client.drive.files
      .get({
        fileId,
        alt: "media"
      })
      .then(data => JSON.parse(data.body));
  }

  pathChange(uid, pathInfo) {
    const key = firebase
      .database()
      .ref("/paths")
      .push().key;

    return firebase
      .database()
      .ref(`/paths/${key}`)
      .set({ ...pathInfo, owner: uid })
      .then(() => key);
  }

  validateProblem(problemInfo) {
    if (!problemInfo) throw new Error("Missing problem");
    if (problemInfo.id) return;
    if (!problemInfo.name) throw new Error("Missing problem name");
    if (!problemInfo.type) throw new Error("Missing problem type");
    switch (problemInfo.type) {
      case "jupyter":
        if (!problemInfo.problemURL) throw new Error("Missing problemURL");
        if (!problemInfo.solutionURL) throw new Error("Missing solutionURL");
        if (!problemInfo.frozen) throw new Error("Missing frozen");
        break;
      default:
        throw new Error("Invalid  problem type");
    }
  }

  problemChange(uid, pathId, problemInfo) {
    pathId = pathId || `default${uid}`;
    this.validateProblem(problemInfo);

    problemInfo.owner = uid;

    const key =
      problemInfo.id ||
      firebase
        .database()
        .ref(`/problems/${uid}`)
        .push().key;
    const ref = firebase.database().ref(`/problems/${uid}/${key}`);

    if (problemInfo.id) {
      delete problemInfo.id;
      ref.update(problemInfo);
    } else {
      ref.set(problemInfo);
    }
    return key;
  }
}

/** @type PathsService */
export const pathsService = new PathsService();
