const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const axios = require("axios");

const fetchNotebookFromGit = (taskKey, uid, url) => {
  const isValidUrl =
    url.includes("https://github.com") && url.endsWith(".ipynb");
  if (isValidUrl) {
    const newUrl = url
      .replace("https://github.com", "https://cdn.jsdelivr.net/gh")
      .replace("/blob/", "@");
    return axios
      .get(newUrl)
      .then(res => {
        return admin
          .database()
          .ref(`/notebookFromGitQueue/responses/${taskKey}`)
          .set({
            owner: uid,
            data: JSON.stringify(res.data)
          });
      })
      .catch(err => console.log(err));
  } else {
    return admin
      .database()
      .ref(`/notebookFromGitQueue/responses/${taskKey}`)
      .set({
        owner: uid,
        error: {
          message: "Not a valid URL"
        },
        data: null
      });
  }
};

exports.handler = fetchNotebookFromGit;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/notebookFromGitQueue"),
    (data, progress, resolve) =>
      fetchNotebookFromGit(data.taskKey, data.owner, data.url).then(() =>
        resolve()
      )
  );
  queue.addWorker();
};
