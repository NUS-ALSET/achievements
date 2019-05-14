const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const axios = require("axios");

const requestHandler = request => {
  return axios({
    method: request.method,
    url: request.url,
    data: request.data
  }).then(response =>
    admin
      .database()
      .ref(`/outgoingRequestsQueue/answers/${request.taskKey}`)
      .set(response.data)
  );
};

exports.handler = requestHandler;
exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/outgoingRequestsQueue"),
    (data, progress, resolve) =>
      requestHandler(data)
        .then(() => resolve())
        .catch(() => resolve())
  );
  queue.addWorker();
};
