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
        scope: "https://www.googleapis.com/auth/drive"
      });
    });
  }

  getFileId(url) {
    return Promise.resolve(/file\/d\/([^/]+)/.exec(url)[1]);
  }

  fetchProblemFile(pathId, problemId, solution) {
    // Enter promiseficated area
    return Promise.resolve()
      .then(
        () =>
          pathId[0] === "-"
            ? firebase
                .database()
                .ref(`/paths/${pathId}`)
                .once("value")
                .then(pathSnapshot => pathSnapshot.val() || {})
            : { owner: pathId, name: "Default" }
      )
      .then(pathInfo =>
        firebase
          .database()
          .ref(`/problems/${pathInfo.owner}/${problemId}`)
          .once("value")
          .then(data => data.val())
          .then(problem =>
            this.getFileId(
              solution ? problem.solutionURL : problem.problemURL
            ).then(fileId =>
              this.fetchFile(fileId).then(problemJSON => ({
                pathName: pathInfo.name,
                owner: pathInfo.owner,
                problemName: problem.name,
                frozen: problem.frozen,
                problemJSON,
                problemColabURL:
                  "https://colab.research.google.com/notebook#fileId=" + fileId,
                problemURL: problem.problemURL
              }))
            )
          )
      );
  }

  fetchSolutionFile(problemId, uid) {
    return firebase
      .database()
      .ref(`/problemSolutions/${problemId}/${uid}`)
      .once("value")
      .then(snapshot => snapshot.val())
      .then(fileId => (fileId ? this.fetchFile(fileId) : false));
  }

  solveProblem(uid, problemId, problemJSON) {
    return this.uploadFile(
      `Solution${problemId}.ipynb`,
      JSON.stringify(problemJSON)
    ).then(file =>
      firebase
        .database()
        .ref(`/problemSolutions/${problemId}/${uid}`)
        .set(file.id)
        .then(() => file.id)
    );
  }

  fetchFile(fileId) {
    return window.gapi.client.drive.files
      .get({
        fileId,
        alt: "media"
      })
      .then(data => JSON.parse(data.body));
  }

  /** Taken from https://goo.gl/jyfMGj
   *
   * @param name
   * @param data
   * @returns {Promise<any>}
   */
  uploadFile(name, data) {
    return new Promise(resolve => {
      const boundary = "-------314159265358979323846";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const contentType = "application/vnd.google.colab";

      const metadata = {
        name: name,
        mimeType: contentType
      };

      const multipartRequestBody =
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: " +
        contentType +
        "\r\n\r\n" +
        data +
        close_delim;

      const request = window.gapi.client.request({
        path: "/upload/drive/v3/files",
        method: "POST",
        params: { uploadType: "multipart" },
        headers: {
          "Content-Type": `multipart/related; boundary="${boundary}"`
        },
        body: multipartRequestBody
      });
      request.execute(resolve);
    });
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
