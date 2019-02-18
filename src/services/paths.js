import isEmpty from "lodash/isEmpty";
import firebase from "firebase";
import { coursesService } from "./courses";
import { firebaseService } from "./firebaseService";
import {
  SOLUTION_PRIVATE_LINK,
  SOLUTION_MODIFIED_TESTS,
  notificationShow
} from "../containers/Root/actions";

import { fetchGithubFilesSuccess } from "../containers/Path/actions";

const NOT_FOUND_ERROR = 404;
const JUPYTER_NOTEBOOL_BASE_URL = "https://colab.research.google.com";
export const YOUTUBE_QUESTIONS = {
  topics:
    "What topics were covered in this video? Put each topic on a new line",
  questionAfter: "What question do you have after watching this video",
  questionAnswer:
    "What is a question someone who watched this video " +
    "should be able to answer",
  questionCustom: "Custom question after watching this video"
};

export const ACTIVITY_TYPES = {
  text: {
    id: "text",
    caption: "Text"
  },
  multipleQuestion: {
    id: "multipleQuestion",
    caption: "Multiple-choice question"
  },
  profile: {
    id: "profile",
    caption: "Fetch CodeCombat Profile"
  },
  codeCombat: {
    id: "codeCombat",
    caption: "Complete CodeCombat Level"
  },
  codeCombatNumber: {
    id: "codeCombatNumber",
    caption: "Complete Number of CodeCombat Levels"
  },
  codeCombatMultiPlayerLevel: {
    id: "codeCombatMultiPlayerLevel",
    caption: "Complete CodeCombat Multiplayer Level"
  },
  jupyter: {
    id: "jupyter",
    caption: "Colaboratory Notebook"
  },
  jupyterInline: {
    id: "jupyterInline",
    caption: "Jupyter Notebook"
  },
  youtube: {
    id: "youtube",
    caption: "YouTube"
  },
  game: {
    id: "game",
    caption: "Game"
  },
  jest: {
    id: "jest",
    caption: "Jest"
  },
  gameTournament: {
    id: "gameTournament",
    caption: "Game Tournament"
  },
  creator: {
    id: "creator",
    caption: "Creator"
  },
  educator: {
    id: "educator",
    caption: "Educator"
  }
};

export const CodeCombat_Multiplayer_Data = {
  teams: {
    humans: {
      id: "humans",
      name: "Red",
    },
    ogres:{
      id: "ogres",
      name: "Blue",
    }
  },
  levels: {
    "king-of-the-hill": {
      id: "king-of-the-hill",
      name: "King of the Hill"
    },
    "treasure-games":{
      id: "treasure-games",
      name: "Treasure Games"
    }
  },
  rankingPercentile: [0, 10, 20, 30, 40, 50]
}

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
  setStore(store) {
    this.store = store;
  }

  dispatch(action) {
    this.store.dispatch(action);
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
   * @param {String} pathId
   * @param {String} activitiyId
   * @returns {Promise<PathProblem>}
   */
  fetchPathProblem(pathId, activitiyId) {
    return Promise.resolve()
      .then(() =>
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
          .ref(`/activities/${activitiyId}`)
          .once("value")
          .then(data => data.val())
          .then(problem => ({
            problemName: problem.name,
            pathName: pathInfo.name,
            pathId: pathId,
            problemId: activitiyId,
            owner: pathInfo.owner,
            ...problem
          }))
      )
      .then(pathProblem => {
        if (!pathProblem) {
          throw new Error("Missed Path Problem");
        }
        switch (pathProblem.type) {
          case "jest": {
            if(pathProblem.version === 1){
              return firebase
              .ref(`/activityData/${activitiyId}`)
              .once("value")
              .then(data => {
                Object.assign(pathProblem, {
                  files: data.val().files 
                })
                return pathProblem;
              })
            }
            return pathProblem;
          }
          case "jupyter":
          case "jupyterInline": {
              return Promise.all([
                Promise.resolve(this.getFileId(pathProblem.problemURL)).then(
                  fileId => {
                    if (pathProblem.version === 1) {
                      return firebase
                      .database()
                      .ref(`/activityData/${activitiyId}`)
                      .once("value")
                      .then(data => {
                        return {
                          id: fileId,
                          data: JSON.parse(data.val().problemData)
                        }
                      });
                    } else {
                      return this.fetchFile(fileId).then(data => ({
                        id: fileId,
                        data
                      }))
                    }
                  }
                )
                // Promise.resolve(this.getFileId(pathProblem.solutionURL)).then(
                //   fileId =>
                //     this.fetchFile(fileId).then(data => ({
                //       id: fileId,
                //       data
                //     }))
                // )
              ])
                .then(files => {
                  Object.assign(pathProblem, {
                    problemColabURL: PathsService.getColabURL(files[0].id),
                    problemJSON: files[0].data,
                    problemFileId: files[0].id
                    // solutionFileId: files[1].id,
                    // solutionColabURL: PathsService.getColabURL(files[1].id),
                    // solutionJSON: files[1].data
                  })
                }
                  
                )
                .then(() => {
                  if (
                    pathProblem.problemJSON &&
                    pathProblem.problemJSON.metadata
                  ) {
                    pathProblem.problemJSON.metadata.language_info = {
                      name: "python"
                    };
                  }
                  if (
                    pathProblem.solutionJSON &&
                    pathProblem.solutionJSON.metadata
                  ) {
                    pathProblem.solutionJSON.metadata.language_info = {
                      name: "python"
                    };
                  }
                  return pathProblem;
                });
          }
          
          default:
            return pathProblem;
        }
      })
      .catch(err => console.error(err.stack, err.message) || false);
  }

  fetchPathProgress(solverId, pathOwner, pathId) {
    return Promise.all([
      firebase
        .database()
        .ref(`/completedActivities/${solverId}/${pathId}`)
        .once("value")
        .then(snapshot => snapshot.val() || {})
        .then(completed => Object.keys(completed).length),
      firebase
        .database()
        .ref(`/paths/${pathId}/totalActivities`)
        .once("value")
        .then(snapshot => snapshot.val())
    ]).then(data => ({ solutions: data[0], totalActivities: data[1] }));
  }

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
   *
   * @param {PathProblem} pathProblem
   * @param uid
   * @returns {Promise<boolean>}
   */
  fetchSolutionFile(pathProblem, uid) {
    return firebase
      .database()
      .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
      .once("value")
      .then(snapshot => snapshot.val())
      .then(solution => {
        switch (pathProblem.type) {
          case "jupyter":
            return solution
              ? this.fetchFile(this.getFileId(solution)).then(json => ({
                  id: solution,
                  json,
                  colabURL: PathsService.getColabURL(solution)
                }))
              : false;
          default:
            return solution;
        }
      });
  }

  pathChange(uid, pathInfo) {
    if (!(pathInfo.id || pathInfo.name)) {
      throw new Error("Missing path name");
    }

    if (pathInfo.id) {
      return firebase
        .database()
        .ref(`/paths/${pathInfo.id}`)
        .update({
          ...pathInfo,
          owner: uid
        })
        .then(() => pathInfo.id);
    }

    const key = firebase
      .database()
      .ref("/paths")
      .push().key;

    return firebase
      .database()
      .ref(`/paths/${key}`)
      .set({ ...pathInfo, totalActivities: 0, owner: uid })
      .then(() => key);
  }

  validateProblem(problemInfo) {
    const options = {};
    if (!problemInfo) throw new Error("Missing activity");
    if (problemInfo.id) return;
    if (!problemInfo.name) throw new Error("Missing activity name");
    if (!problemInfo.type) throw new Error("Missing activity type");
    switch (problemInfo.type) {
      case ACTIVITY_TYPES.text.id:
        if (!problemInfo.question) throw new Error("Missing question");
        break;
      case ACTIVITY_TYPES.multipleQuestion.id:
        if (!(problemInfo.options && problemInfo.options.length)) {
          throw new Error("Missing options");
        }
        if (problemInfo.options.length === 1) {
          throw new Error("At least 2 options required");
        }
        for (const option of problemInfo.options) {
          if (!(option.caption && option.caption.trim())) {
            throw new Error("Missing option text");
          }
          if (options[option.caption.trim()]) {
            throw new Error("Duplicate options are forbidden");
          }
          options[option.caption.trim()] = true;
        }
        break;
      case ACTIVITY_TYPES.profile.id:
        break;
      case ACTIVITY_TYPES.codeCombat.id:
        if (!problemInfo.level) throw new Error("Missing CodeCombat level");
        break;
      case ACTIVITY_TYPES.codeCombatNumber.id:
        if (!problemInfo.count) throw new Error("Missing levels count");
        break;
      case ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id:
        if(!problemInfo.team) throw new Error("Missing Multiplayer CodeCombat Team");
        else if(!problemInfo.level) throw new Error("Missing Multiplayer CodeCombat Level");
        else if(!problemInfo.requiredPercentile) throw new Error("Missing Multiplayer CodeCombat Percentile Required")
        break;
      case ACTIVITY_TYPES.jupyter.id:
      case ACTIVITY_TYPES.jupyterInline.id:
        if (!problemInfo.problemURL) throw new Error("Missing problemURL");
        if (!problemInfo.solutionURL && !problemInfo.id)
          throw new Error("Missing solutionURL");
        if (!problemInfo.frozen) throw new Error("Missing frozen field");
        if (problemInfo.type === "jupyterInline" && !problemInfo.code)
          throw new Error("Missing code field");
        if (!problemInfo.problemURL.includes(JUPYTER_NOTEBOOL_BASE_URL))
          throw new Error("Invalid Problem URL");
        if (
          problemInfo.solutionURL &&
          !problemInfo.solutionURL.includes(JUPYTER_NOTEBOOL_BASE_URL)
        )
          throw new Error("Invalid Solution URL");
        break;
      case ACTIVITY_TYPES.youtube.id:
        if (!problemInfo.youtubeURL) throw new Error("Missing youtubeURL");
        if (
          !(
            problemInfo.questionAfter ||
            problemInfo.questionAnswer ||
            problemInfo.topics ||
            (problemInfo.questionCustom && problemInfo.customText)
          )
        ) {
          throw new Error("Missing any of following questions");
        }
        break;
      case ACTIVITY_TYPES.game.id:
        break;
      case ACTIVITY_TYPES.gameTournament.id:
        break;
      case ACTIVITY_TYPES.jest.id:
        if (!problemInfo.githubURL) throw new Error("Missing GithubURL");
        if (!problemInfo.files) throw new Error("Missing Files");
        break;
      case ACTIVITY_TYPES.creator.id:
      case ACTIVITY_TYPES.educator.id:
        if (!problemInfo.targetType) throw new Error("Missing Target Type");
        break;
      default:
        throw new Error("Invalid activity type");
    }
  }

  problemChange(uid, pathId, problemInfo) {
    const isNew = !problemInfo.id;
    let next;
    let solutionURL = null;
    let problemURL = null;

    this.validateProblem(problemInfo);
    if (
      [ACTIVITY_TYPES.jupyter.id, ACTIVITY_TYPES.jupyterInline.id].includes(
        problemInfo.type
      )
    ) {
      solutionURL = problemInfo.solutionURL;
      problemURL = problemInfo.problemURL;
      delete problemInfo.solutionURL;
    }
    problemInfo.owner = uid;
    if (pathId) {
      problemInfo.path = pathId;
    }
    /*
      Jest Activity
    */
    let jestFiles = [];
    const { type, version, files } = problemInfo;
    if (ACTIVITY_TYPES.jest.id === type && version >= 1) {
      jestFiles = files;
      delete problemInfo.files;
    }

    const key =
      problemInfo.id ||
      firebase
        .database()
        .ref("/activities")
        .push().key;
    const ref = firebase.database().ref(`/activities/${key}`);
    let info = {};
    for (let infoKey in problemInfo) {
      if (
        problemInfo.hasOwnProperty(infoKey) &&
        problemInfo[infoKey] !== undefined
      ) {
        info[infoKey] = problemInfo[infoKey];
      }
    }
    if (info.id) {
      delete info.id;
      next = ref.update(info);
    } else {
      if (info.type === "jupyterInline") {
        info.version = 1;
      }
      next = ref.set(info);
    }
    return next
      .then(
        () =>
          // For new activity increase total counter by 1
          isNew &&
          firebase
            .database()
            .ref(`/paths/${pathId}/totalActivities`)
            .transaction(activities => ++activities)
      )
      .then(() => {
        if (solutionURL) {
          this.fetchFile(this.getFileId(solutionURL)).then(json => {
            this.saveGivenSkillInProblem(json, key, uid, solutionURL, pathId);
          });
        }
        if (problemURL) {
          this.fetchFile(this.getFileId(problemURL)).then(json => {
            /*
              Update to activityData if Jupyter Activity
            */
            this.saveJupyterProblemToFirebase({json, key, info})
          });
        }
        /*
          Update to activityData if Jest Activity
        */
        if (jestFiles.length && info.version >= 1) {
          const ref = firebase.database().ref(`/activityData/${key}`);
          const { path, owner } = info;
          ref.set({
            files: jestFiles,
            path,
            owner
          });
        }
        return key;
      });
  }

  saveJupyterProblemToFirebase(data) {
    if (Object.keys(data.json).length > 0 &&
        data.json.constructor === Object &&
        data.info.version >= 1) {
      const ref = firebase.database().ref(`/activityData/${data.key}`);
      const { path, owner } = data.info;
      ref.set({
        problemData: JSON.stringify(data.json),
        path,
        owner
      });
    }
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
        case ACTIVITY_TYPES.jest.id:
          return Promise.resolve();
        case ACTIVITY_TYPES.codeCombat.id:
          return coursesService.getAchievementsStatus(uid, {
            questionType: "CodeCombat",
            level: pathProblem.level
          });
        case ACTIVITY_TYPES.codeCombatNumber.id:
          return coursesService.getAchievementsStatus(uid, {
            questionType: "CodeCombat_Number",
            count: pathProblem.count
          });
        case ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id:
          return true;
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
        case "jupyterInline":
          if (json) {
            const frozenSolution = json.cells
              .filter(cell => cell.source.join("").trim())
              .slice(-pathProblem.frozen);
            const frozenProblem = pathProblem.problemJSON.cells
              .filter(cell => cell.source.join("").trim())
              .slice(-pathProblem.frozen);

            frozenProblem.forEach((cell, index) => {
              const solution = frozenSolution[index];

              if (
                !solution ||
                cell.source.join("").trim() !== solution.source.join("").trim()
              ) {
                throw new Error(SOLUTION_MODIFIED_TESTS);
              }
              return true;
            });
            return new Promise((resolve, reject) => {
              const answerPath = "/jupyterSolutionsQueue/responses/";
              const answerKey = firebase
                .database()
                .ref(answerPath)
                .push().key;

              firebase
                .database()
                .ref(`${answerPath}${answerKey}`)
                .on("value", response => {
                  if (response.val() === null) {
                    return;
                  }

                  firebase
                    .database()
                    .ref(`${answerPath}${answerKey}`)
                    .off();

                  return firebase
                    .database()
                    .ref(`${answerPath}${answerKey}`)
                    .remove()
                    .then(() =>
                      response.val()
                        ? resolve(JSON.parse(response.val().solution))
                        : reject(
                            new Error("Failing - Unable execute your solution")
                          )
                    );
                });

              return firebase
                .database()
                .ref(`/jupyterSolutionsQueue/tasks/${answerKey}`)
                .set({
                  owner: uid,
                  taskKey: answerKey,
                  problem: pathProblem.problemId,
                  solution: JSON.stringify(json),
                  open: pathProblem.openTime
                });
            });
          }
          break;
        case ACTIVITY_TYPES.creator.id:
        case ACTIVITY_TYPES.educator.id:
          return firebase
            .database()
            .ref(`/activities/${solution.activity}/type`)
            .once("value")
            .then(snap => {
              if (snap.val() !== pathProblem.targetType) {
                throw new Error("Wrong Type of provided activity");
              }
            })
            .then(
              () =>
                pathProblem.type === ACTIVITY_TYPES.educator.id &&
                firebase
                  .database()
                  .ref(`/problemSolutions/${solution.activity}`)
                  .once("value")
                  .then(snap => {
                    if (
                      Object.keys(snap.val() || {}).length < pathProblem.count
                    ) {
                      throw new Error(
                        "Provided activity contains fewer solutions"
                      );
                    }
                  })
            );
        default:
          return true;
      }
    });
  }

  /**
   * Store solution at firebase
   *
   * @param {String} uid
   * @param {PathActivity} pathProblem
   * @param {any} solution
   * @returns {Promise<any>}
   */
  submitSolution(uid, pathProblem, solution) {
    pathProblem = {
      ...pathProblem,
      problemId: pathProblem.problemId || pathProblem.id
    };
    if (typeof solution === "object") {
      solution.updatedAt = Date.now();
      solution.version = process.env.REACT_APP_VERSION;
    }
    return Promise.resolve()
      .then(() => this.validateSolution(uid, pathProblem, solution))
      .then(() => {
        switch (pathProblem.type) {
          case ACTIVITY_TYPES.codeCombat.id:
          case ACTIVITY_TYPES.codeCombatNumber.id:
          case ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id:
            return firebase
              .database()
              .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
              .set({
                completed: true,
                updatedAt: {
                  ".sv": "timestamp"
                }
              });
          case ACTIVITY_TYPES.text.id:
          case ACTIVITY_TYPES.jest.id:
          case ACTIVITY_TYPES.profile.id:
          case ACTIVITY_TYPES.youtube.id:
          case ACTIVITY_TYPES.game.id:
            return firebase
              .database()
              .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
              .set(solution);
          case ACTIVITY_TYPES.jupyter.id:
            return this.fetchFile(this.getFileId(solution))
              .then(json => {
                return this.validateSolution(uid, pathProblem, solution, json);
              })
              .then(() =>
                firebase
                  .database()
                  .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
                  .set({
                    updatedAt: {
                      ".sv": "timestamp"
                    },
                    solution
                  })
              );
          case ACTIVITY_TYPES.jupyterInline.id: {
            return firebase
              .database()
              .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
              .set({
                updatedAt: {
                  ".sv": "timestamp"
                },
                solution: JSON.stringify(solution)
              });
          }
          case ACTIVITY_TYPES.creator.id:
          case ACTIVITY_TYPES.educator.id:
            return firebase
              .database()
              .ref(`/problemSolutions/${pathProblem.problemId}/${uid}`)
              .set(solution);

          default:
            break;
        }
      })
      .then(() =>
        firebase
          .database()
          .ref(
            `/completedActivities/${uid}/${pathProblem.path}/${
              pathProblem.problemId
            }`
          )
          .set({
            ".sv": "timestamp"
          })
      );
  }

  saveGivenSkillInProblem(solution, activityId, uid, solutionURL, pathId) {
    // comment out any lines that start with !
    const editableBlockCode = solution.cells
      .map(c =>
        c.cell_type === "code"
          ? c.source.map(line => (line[0] === "!" ? `#${line}` : line)).join("")
          : ""
      )
      .join("");
    const data = {
      owner: uid,
      solution: editableBlockCode || ""
    };
    const resData = {};
    return firebaseService
      .startProcess(data, "jupyterSolutionAnalysisQueue", "Code Analysis")
      .then(res => {
        resData.skills = res.skills || {};
      })
      .catch(e => {
        resData.errorMsg = e.message || "Error occured";
      })
      .finally(() => {
        // pathId added, so solution's skills will be fetch on basis of pathId

        firebase
          .database()
          .ref(`/activityExampleSolutions/${activityId}`)
          .set({
            ...resData,
            solutionURL: solutionURL,
            owner: uid,
            pathId
          });
      });
  }

  /**
   *
   * @param uid
   * @returns {Promise<Path[]>}
   */
  fetchPaths(uid) {
    return Promise.all([
      firebase
        .database()
        .ref("/paths")
        .orderByChild("owner")
        .equalTo(uid)
        .once("value")
        .then(data => data.val()),
      firebase
        .database()
        .ref("/paths")
        .orderByChild("isPublic")
        .equalTo(true)
        .once("value")
        .then(data => data.val())
    ]).then(responses => ({
      myPaths: responses[0],
      publicPaths: responses[1]
    }));
  }

  togglePathJoinStatus(uid, pathId, status) {
    return Promise.resolve()
      .then(() => {
        const ref = firebase
          .database()
          .ref(`/studentJoinedPaths/${uid}/${pathId}`);
        if (status) {
          return ref.set(true);
        }
        return ref.remove();
      })
      .then(
        () =>
          status &&
          firebase
            .database()
            .ref(`/paths/${pathId}`)
            .once("value")
            .then(data => data.val())
            .then(path => ({ ...path, id: pathId }))
            .then(path =>
              pathsService
                .fetchPathProgress(uid, path.owner, path.id)
                .then(solutions => Object.assign(path, solutions))
            )
      );
  }

  fetchJoinedPaths(uid) {
    return firebase
      .database()
      .ref(`/studentJoinedPaths/${uid}`)
      .once("value")
      .then(snapshot => snapshot.val())
      .then(paths =>
        Promise.all(
          Object.keys(paths || {}).map(id =>
            paths[id]
              ? firebase
                  .database()
                  .ref(`/paths/${id}`)
                  .once("value")
                  .then(snapshot => ({ id, ...snapshot.val() }))
                  .then(path =>
                    this.fetchPathProgress(uid, path.owner, path.id).then(
                      solutions => Object.assign(path, solutions)
                    )
                  )
              : Promise.resolve(false)
          )
        ).then(paths =>
          Object.assign({}, ...paths.map(path => ({ [path.id]: path })))
        )
      );
  }

  /**
   *
   * @param {String} uid
   * @param {String} pathId
   * @returns {Promise<Array<Activity>>} list of problems
   */
  fetchProblems(uid, pathId) {
    return firebase
      .database()
      .ref("/activities")
      .orderByChild("path")
      .equalTo(pathId)
      .once("value")
      .then(data => data.val())
      .then(problems =>
        Object.keys(problems || {}).map(id => ({
          ...problems[id],
          id
        }))
      );
  }

  fetchProblemsSolutions(uid, problems) {
    return Promise.all(
      problems.map(problem =>
        firebase
          .database()
          .ref(`/problemSolutions/${problem.id}/${uid}`)
          .once("value")
          .then(data => ({ [problem.id]: !!data.val() }))
      )
    ).then(solutions => Object.assign({}, ...solutions));
  }

  storeMoreProblemsRequest(uid, pathId, activityCount) {
    return firebase
      .database()
      .ref("/moreProblemsRequests")
      .push({
        sender: uid,
        path: pathId,
        activityCount: activityCount,
        requestTime: {
          ".sv": "timestamp"
        }
      });
  }

  /**
   *
   * @param {Array<Activity>}activities
   */
  checkActivitiesOrder(activities) {
    let needUpdate = false;
    activities = activities.sort((a, b) => {
      if (!a.orderIndex) {
        needUpdate = true;
        return 1;
      }
      if (!b.orderIndex) {
        needUpdate = true;
        return -1;
      }
      if (a.orderIndex < b.orderIndex) {
        return -1;
      } else if (a.orderIndex > b.orderIndex) {
        return 1;
      }
      needUpdate = true;
      return 0;
    });
    if (needUpdate) {
      console.error("Path activities order was broken");
      let currentOrderIndex = 0;
      const updated = [];
      for (const activity of activities) {
        currentOrderIndex += 1;
        updated.push(activity);
        activity.orderIndex = currentOrderIndex;
      }
      return Promise.all(
        updated.map(activity =>
          firebase
            .database()
            .ref(`/activities/${activity.id}`)
            .update({ orderIndex: activity.orderIndex })
        )
      ).then(() => activities);
    }
    return Promise.resolve(activities);
  }

  /**
   *
   * @param uid
   * @param pathId
   * @param {Array<Activity>}activities
   * @param activityId
   * @param direction
   */
  moveActivity(uid, pathId, activities, activityId, direction) {
    return this.checkActivitiesOrder(activities).then(activities => {
      let siblingActivity;

      let targetActivity = activities.find(a => a.id === activityId);

      if (!targetActivity) {
        throw new Error("Unable find requested activity");
      }

      if (direction === "up") {
        siblingActivity = activities.find(
          a => a.orderIndex === targetActivity.orderIndex - 1
        );
      } else {
        siblingActivity = activities.find(
          a => a.orderIndex === targetActivity.orderIndex + 1
        );
      }

      if (!siblingActivity) {
        return Promise.resolve();
      }
      return Promise.all([
        firebase
          .database()
          .ref(`/activities/${targetActivity.id}/orderIndex`)
          .set(siblingActivity.orderIndex),

        firebase
          .database()
          .ref(`/activities/${siblingActivity.id}/orderIndex`)
          .set(targetActivity.orderIndex)
      ]);
    });
  }

  deleteActivity(activityId, pathId = null) {
    return firebase
      .database()
      .ref(`/activities/${activityId}`)
      .remove()
      .then(
        () =>
          pathId &&
          firebase
            .database()
            .ref(`/paths/${pathId}/totalActivities`)
            .transaction(activities => --activities)
      );
  }

  /**
   *
   * @param {String} pathId
   */
  fetchPathCollaborators(pathId) {
    return firebase
      .database()
      .ref(`/pathAssistants/${pathId}`)
      .once("value")
      .then(snapshot => snapshot.val() || {})
      .then(assistants =>
        Promise.all(
          Object.keys(assistants).map(id =>
            firebase
              .database()
              .ref(`/users/${id}`)
              .once("value")
              .then(snapshot => snapshot.val() || {})
              .then(user => ({ ...user, id }))
          )
        )
      );
  }

  /**
   *
   * @param {String} pathId
   * @param {String} collaboratorId empty param leads to remove that
   * assistants
   * @param {String} action - could be `add` and `remove` only
   */
  updatePathCollaborator(pathId, collaboratorId, action) {
    const ref = firebase
      .database()
      .ref(`/pathAssistants/${pathId}/${collaboratorId}`);
    if (action === "add") {
      return ref.set(true);
    }
    return ref.remove();
  }

  /**
   * @param {String} uid
   * @param {Object} pathActivities
   * @param {Object} codeCombatProfile
   */
  refreshPathSolutions(uid, pathActivities, codeCombatProfile) {
    const actions = [];
    const needUpdate = !!pathActivities.activities.find(activity =>
      [
        ACTIVITY_TYPES.codeCombat.id,
        ACTIVITY_TYPES.codeCombatNumber.id
      ].includes(activity.type)
    );

    if (!needUpdate) {
      return Promise.resolve();
    }

    if (!(codeCombatProfile && codeCombatProfile.id)) {
      throw new Error("Missing CodeCombat profile");
    }

    for (const activity of pathActivities.activities) {
      if (
        [
          ACTIVITY_TYPES.codeCombat.id,
          ACTIVITY_TYPES.codeCombatNumber.id
        ].includes(activity.type)
      ) {
        actions.push(this.submitSolution(uid, activity, "Completed"));
      }
    }
    return Promise.all(actions);
  }

  fetchGithubFiles(uid, githubURL) {
    return new Promise((resolve, reject) => {
      const githubBaseURL = "https://github.com/";
      if (githubURL.includes(githubBaseURL)) {
        const promise = firebaseService
          .startProcess(
            {
              owner: uid,
              githubURL
            },
            "fetchGithubFilesQueue",
            "Fetch files from github"
          )
          .then(data => {
            this.dispatch(fetchGithubFilesSuccess(data.githubData));
          });
        resolve(promise);
      } else {
        this.dispatch(notificationShow("Not a Valid Github URL"));
        reject();
      }
    });
  }

  /**
   *
   * @param {String} uid
   * @param {Object} [options]
   * @param {Boolean} [options.withActivities]
   *
   */
  fetchOwnPaths(uid, options = {}) {
    return firebase
      .database()
      .ref("/paths")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(snap => snap.val() || {})
      .then(paths =>
        options.withActivities
          ? Promise.all(
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
          : Object.keys(paths).map(pathKey => ({
              id: pathKey,
              name: paths[pathKey].name
            }))
      );
  }

  saveAttemptedSolution(uid, payload){
    payload.userKey = uid;
    return firebase
    .database()
    .ref('analytics/activityAttempts')
    .push(payload);
  }
}

/** @type PathsService */
export const pathsService = new PathsService();
