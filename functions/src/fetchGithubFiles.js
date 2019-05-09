const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

class GithubCodeHandler {

  constructor(config = {}) {
    this.state = {};
    this.config = config;
  }
  setState(updatedData) {
    this.state=Object.assign(this.state,updatedData);
  }

  fetchCode(githubURL, successCallback, errorCallback) {
    this.setState({
      githubURL,
    });
    this.successCallback = successCallback || (() => { })
    this.errorCallback = errorCallback || (() => { })
    this.initProcess();
  }

  initProcess() {
    const { githubURL } = this.state;
    this.fetchedGithubURL = "";
    this.setState({ files: [] });
    if (!githubURL.includes(this.config.GITHUB_BASE_URL)) {
      this.handleError("Not a Valid Github URL");
      return;
    }
    const params = githubURL
      .replace(this.config.GITHUB_BASE_URL, "")
      .split("/");
    let repoOwner = params[0];
    let repoName = params[1];
    let branch = params[3] || "master";
    let subPath = "";
    if (params.length > 4) {
      for (let i = 4; i < params.length; i++) {
        subPath = `${subPath}/${params[i]}`;
      }
    }
    this.fetchDirectoryStructureFromGitub(
      `${
      this.config.GITHUB_SERVER_URL
      }/repos/${repoOwner}/${repoName}/contents${subPath}`,
      branch
    )
      .then(files => {
        if (files && files.length) {
          this.fetchedGithubURL = githubURL;
          this.setState({
            repoDetails: {
              owner: repoOwner,
              name: repoName,
              folderPath: subPath,
              branch
            },
            githubURL,
            files: files.map(f => ({
              path: f.path,
              readOnly: true,
              type: f.type
            })),
          });
          this.fetchWholeTree(-1);
        } else {
          // eslint-disable-next-line no-console
          // console.log(files);
          this.handleError((files || {}).message || 'init error');
        }
      })
      .catch(err => {
        this.handleError(err);
      });
  };
  fetchWholeTree(fileIndex = -1) {
    let folderToFetch = null;
    let index = 0;
    for (index = fileIndex + 1; index < this.state.files.length; index++) {
      const file = this.state.files[index];
      if (file.type === "dir") {
        folderToFetch = file;
        break;
      }
    }
    if (folderToFetch) {
      this.fetchDirectoryStructureFromGitub(
        `${this.config.GITHUB_SERVER_URL}/repos/${
        this.state.repoDetails.owner
        }/${this.state.repoDetails.name}/contents${folderToFetch.path}`,
        this.state.repoDetails.branch
      )
        .then(tree => {
          if (tree && tree.length) {
            this.setState({
              files: 
                this.state.files.concat(
                  tree.map(f => ({
                    path: f.path,
                    readOnly: true,
                    type: f.type
                  })
                ))
              })
            this.fetchWholeTree(index);
          } else {
            this.handleError();
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    } else {
      this.fetchWholeCode();
    }
  };

  fetchWholeCode(fileIndex = -1) {
    let fileToFetch = null;

    // eslint-disable-next-line guard-for-in
    for (let index in this.state.files) {
      const file = this.state.files[index];
      if (
        file.type === "file" &&
        parseInt(index, 10) > parseInt(fileIndex, 10)
      ) {
        fileToFetch = Object.assign(file, { index });
        break;
      }
    }
    if (fileToFetch) {
      axios({
        url: `${this.config.RAW_GIT_URL}/${this.state.repoDetails.owner}/${
          this.state.repoDetails.name
          }/${this.state.repoDetails.branch}/${fileToFetch.path}`,
        method: 'GET',
        responseType: 'text'
      })
        .then(response => response.data)
        .then(code => {
          this.setState({
            files: this.state.files.map(
              (f, i) =>
                parseInt(i, 10) === parseInt(fileToFetch.index, 10)
                  ? Object.assign(f, { code })
                  : f
            )
          });
          this.fetchWholeCode(fileToFetch.index);
        })
        .catch(err => {
          this.handleError(err);
        });
    } else {
      this.setState({
        files: this.state.files
          .map(f => ({
            path: this.state.repoDetails.folderPath ? f.path.replace(
              `${this.state.repoDetails.folderPath.slice(1)}/`,
              ""
            ) : f.path,
            readOnly: true,
            type: f.type,
            code: typeof f.code === 'string' ? f.code : JSON.stringify(f.code, null, '\t')
          }))
          .filter(f => f.type === "file")
      });
      this.successCallback(this.state);
    }
  };

  fetchDirectoryStructureFromGitub(url, branch = "master") {
    return axios.get(
      `${url}?access_token=${this.config.GITHUB_ACCESS_TOKEN}&&ref=${branch}`
    ).then(res => res.data);
  };

  handleError(err) {
    if (typeof err === "string") {
      this.errorCallback({
        message: err
      });
    } else if (typeof err === "object") {
      this.errorCallback(err);
    } else {
      this.errorCallback({
        message: "Error occurs"
      });
    }
  };
}


const fetchGithubFiles = (data, taskKey, owner) => {
  data['triggerType']='handleGithubFilesFetchRequest'
  admin.firestore().collection("/logged_events").add({          
    createdAt: Date.now(),
    type: "FIREBASE_TRIGGERS",
    uid: owner,
    sGen: true,
    otherActionData:data
  });  
  
  return admin
    .database()
    .ref("/config/jestRunnerConfig")
    .once("value")
    .then(jestRunnerConfig => {
      const data = jestRunnerConfig.val();
      return new GithubCodeHandler({
        GITHUB_BASE_URL: data.githubBaseURL,
        GITHUB_SERVER_URL: data.githubServerURL,
        RAW_GIT_URL: data.rawGitURL,
        AWS_SERVER_URL: data.awsJestRunnerServerURL,
        GITHUB_ACCESS_TOKEN: data.githubAccessToken,
      })
    })
    .then(githubCodeHandler => {
      return new Promise((resolve, reject) => {
        githubCodeHandler.fetchCode(
          data.githubURL,
          (data) => {
            resolve(
              admin
                .database()
                .ref(`/fetchGithubFilesQueue/responses/${taskKey}`)
                .set({
                  owner: owner,
                  githubData: data,
                })
            )
          },
          (err) => {
            reject(err)
          }
        )
      })
    }
    )
    .catch(err => {
      return (
        console.error(err.message) ||
        admin
          .database()
          .ref(`/fetchGithubFilesQueue/responses/${taskKey}`)
          .set(false)
      );
    })
    .then(() =>
      admin
        .database()
        .ref(`/fetchGithubFilesQueue/answers/${taskKey}`)
        .remove()
    );
};

exports.handler = fetchGithubFiles;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/fetchGithubFilesQueue"),
    (data, progress, resolve) =>
      fetchGithubFiles(data, data.taskKey, data.owner).then(() =>
        resolve()
      )
  );
  queue.addWorker();
};

