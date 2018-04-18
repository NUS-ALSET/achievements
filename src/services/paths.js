import isEmpty from "lodash/isEmpty";
import firebase from "firebase";

const NOT_FOUND_ERROR = 404;

export const YOUTUBE_QUESTIONS = {
  topics:
    "What topics were covered in this video? Put each topic on a new line",
  questionAfter: "What question do you have after watching this video",
  questionAnswer:
    "What is a question someone who watched this video " +
    "should be able to answer"
};

export class PathsService {
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

  static getColabURL(fileId) {
    return "https://colab.research.google.com/notebook#fileId=" + fileId;
  }

  getFileId(url) {
    let result = /file\/d\/([^/]+)/.exec(url);
    if (result && result[1]) return result[1];
    result = /id=([^&/]*)/.exec(url);
    if (result && result[1]) return result[1];
    result = /https:\/\/colab.research.google.com\/drive\/([^/&?#]+)/.exec(url);
    if (result && result[1]) return result[1];

    return url;
  }

  /**
   *
   * @param {String}pathId
   * @param problemId
   * @returns {Promise<PathProblem>}
   */
  fetchPathProblem(pathId, problemId) {
    return Promise.resolve()
      .then(
        () =>
          pathId[0] === "-"
            ? this.firebase
                .database()
                .ref(`/paths/${pathId}`)
                .once("value")
                .then(pathSnapshot => pathSnapshot.val() || {})
            : { owner: pathId, name: "Default" }
      )
      .then(pathInfo =>
        this.firebase
          .database()
          .ref(`/problems/${pathInfo.owner}/${problemId}`)
          .once("value")
          .then(data => data.val())
          .then(problem => ({
            problemName: problem.name,
            pathName: pathInfo.name,
            pathId: pathId,
            problemId,
            owner: pathInfo.owner,
            ...problem
          }))
      )
      .then(pathProblem => {
        if (!pathProblem) {
          throw new Error("Missed Path Problem");
        }
        switch (pathProblem.type) {
          case "jupyter":
            return Promise.all([
              Promise.resolve(this.getFileId(pathProblem.problemURL)).then(
                fileId =>
                  this.fetchFile(fileId).then(data => ({
                    id: fileId,
                    data
                  }))
              ),
              Promise.resolve(this.getFileId(pathProblem.solutionURL)).then(
                fileId =>
                  this.fetchFile(fileId).then(data => ({
                    id: fileId,
                    data
                  }))
              )
            ]).then(files =>
              Object.assign(pathProblem, {
                problemColabURL: PathsService.getColabURL(files[0].id),
                problemJSON: files[0].data,
                problemFileId: files[0].id,
                solutionFileId: files[1].id,
                solutionColabURL: PathsService.getColabURL(files[1].id),
                solutionJSON: files[1].data
              })
            );
          default:
            return pathProblem;
        }
      })
      .catch(err => console.error(err.stack, err.message));
  }

  fetchPathProgress(solverId, pathOwner, pathId) {
    let ref = this.firebase
      .database()
      .ref(`/problems/${pathOwner}`)
      .orderByChild("path");

    if (pathId) {
      ref = ref.equalTo(pathId);
    } else {
      ref = ref.endAt(null);
    }

    return ref
      .once("value")
      .then(data => Object.keys(data.val() || {}))
      .then(problemKeys =>
        Promise.all(
          problemKeys.map(problemKey =>
            this.firebase
              .database()
              .ref(`/problemSolutions/${problemKey}/${solverId}`)
              .once("value")
              .then(data => data.val() || false)
          )
        )
          .then(solutions => solutions.filter(solution => !!solution))
          .then(existingSolutions => ({
            solutions: existingSolutions.length,
            total: problemKeys.length
          }))
      );
  }

  fetchFile(fileId) {
    const request = window.gapi.client.drive.files.get({
      fileId,
      alt: "media"
    });

    return new Promise((resolve, reject) =>
      request.execute(data => {
        if (data.code && data.code === NOT_FOUND_ERROR) {
          return reject(new Error("Failing - Your solution is not public."));
        }
        resolve(data);
      })
    );
  }

  fetchSolutionFile(problemId, uid) {
    return this.firebase
      .database()
      .ref(`/problemSolutions/${problemId}/${uid}`)
      .once("value")
      .then(snapshot => snapshot.val())
      .then(
        fileId =>
          fileId
            ? this.fetchFile(fileId).then(json => ({
                id: fileId,
                json,
                colabURL: PathsService.getColabURL(fileId)
              }))
            : false
      );
  }

  pathChange(uid, pathInfo) {
    const key = this.firebase
      .database()
      .ref("/paths")
      .push().key;

    return this.firebase
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
      case "youtube":
        if (!problemInfo.youtubeURL) throw new Error("Missing youtubeURL");
        if (
          !(
            problemInfo.questionAfter ||
            problemInfo.questionAnswer ||
            problemInfo.topics
          )
        ) {
          throw new Error("Missing any of following question");
        }
        break;
      case "text":
        break;
      default:
        throw new Error("Invalid  problem type");
    }
  }

  problemChange(uid, pathId, problemInfo) {
    this.validateProblem(problemInfo);

    problemInfo.owner = uid;
    if (pathId) {
      problemInfo.path = pathId;
    }

    const key =
      problemInfo.id ||
      this.firebase
        .database()
        .ref(`/problems/${uid}`)
        .push().key;
    const ref = this.firebase.database().ref(`/problems/${uid}/${key}`);

    if (problemInfo.id) {
      delete problemInfo.id;
      ref.update(problemInfo);
    } else {
      ref.set(problemInfo);
    }
    return key;
  }

  /**
   *
   * @param {String} uid
   * @param {PathProblem} pathProblem
   * @param {*} solution
   * @param {Object} [json]
   * @returns {Promise<Boolean>}
   */
  validateSolution(uid, pathProblem, solution, json) {
    return Promise.resolve().then(() => {
      switch (pathProblem.type) {
        case "youtube":
          if (isEmpty(solution.youtubeEvents)) {
            throw new Error("Did you ever start watching this video?");
          }
          Object.keys(YOUTUBE_QUESTIONS).forEach(question => {
            if (pathProblem[question] && !solution.answers[question]) {
              throw new Error(
                `Missing answer for '${YOUTUBE_QUESTIONS[question]}`
              );
            }
          });
          break;
        case "jupyter":
          if (json) {
            const frozenSolution = json.cells
              .filter(cell => cell.source.join().trim())
              .slice(-pathProblem.frozen);
            const frozenProblem = pathProblem.problemJSON.cells
              .filter(cell => cell.source.join().trim())
              .slice(-pathProblem.frozen);

            frozenProblem.forEach((cell, index) => {
              const solution = frozenSolution[index];

              if (!solution || cell.source.join() !== solution.source.join()) {
                throw new Error(
                  "Failing - You have changed the last code block."
                );
              }
              return true;
            });
            return new Promise((resolve, reject) => {
              const answerPath = "/jupyterSolutionsQueue/answers/";
              const answerKey = firebase
                .database()
                .ref(answerPath)
                .push().key;

              firebase
                .database()
                .ref(`${answerPath}${answerKey}`)
                .on("value", response => {
                  if (response.val() === null) return;
                  return response.val()
                    ? resolve(JSON.parse(response.val().solution))
                    : reject(
                        new Error("Failing - Unable execute your solution")
                      );
                });
              return firebase
                .database()
                .ref(`/jupyterSolutionsQueue/tasks/${answerKey}`)
                .set({
                  owner: uid,
                  taskKey: answerKey,
                  problem: pathProblem.problemId,
                  solution: json
                });
            });
          }
          break;
        default:
          return true;
      }
    });
  }

  /**
   * Store solution at firebase
   *
   * @param {String} uid
   * @param {PathProblem} pathProblem
   * @param {any} solution
   * @returns {Promise<any>}
   */
  submitSolution(uid, pathProblem, solution) {
    return Promise.resolve()
      .then(() => this.validateSolution(pathProblem, solution))
      .then(() => {
        switch (pathProblem.type) {
          case "jupyter":
            return this.fetchFile(this.getFileId(solution))
              .then(json => this.validateSolution(pathProblem, solution, json))
              .then(() =>
                this.firebase
                  .database()
                  .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
                  .set(solution)
              );
          case "youtube":
            return this.firebase
              .database()
              .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
              .set(solution);
          default:
            break;
        }
      });
  }

  /**
   *
   * @param uid
   * @returns {Promise<Path[]>}
   */
  fetchPaths(uid) {
    return this.firebase
      .database()
      .ref("/paths")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(data => data.val())
      .then(paths =>
        Object.keys(paths || {}).map(id => ({
          ...paths[id],
          id
        }))
      );
  }

  /**
   *
   * @param {String} uid
   * @param {String} pathId
   * @returns {Promise<Array<Problem>>} list of problems
   */
  fetchProblems(uid, pathId) {
    let ref = this.firebase.database().ref(`/problems/${uid}`);

    if (pathId && pathId !== uid) {
      ref = ref.orderByChild("path").equalTo(pathId);
    }
    return ref
      .once("value")
      .then(data => data.val())
      .then(problems =>
        Object.keys(problems || {}).map(id => ({
          ...problems[id],
          id
        }))
      )
      .then(
        problems =>
          pathId && pathId !== "default"
            ? problems
            : problems.filter(problem => !problem.path)
      );
  }

  constructor(dependencies) {
    dependencies = dependencies || {};

    this.firebase = dependencies.firebase || firebase;
  }
}

/** @type PathsService */
export const pathsService = new PathsService();
