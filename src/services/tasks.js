import firebase from "firebase/app";

const BASIC_PRESET = {
  blocksCount: 4,
  id: "basic",
  json: JSON.stringify({
    nbformat: 4,
    nbformat_minor: 0,
    metadata: {},
    cells: [
      { cell_type: "markdown", source: ["Hi\\n"] },
      { cell_type: "code", source: ["test", "f()"], outputs: [] },
      { cell_type: "markdown", source: ["Cool\\n"] },
      { cell_type: "code", source: ["assert(True)\\n"], outputs: [] }
    ]
  }),
  owner: "no-one"
};

export class TasksService {
  fetchPresets() {
    return firebase
      .database()
      .ref("/config/taskPresets")
      .once("value")
      .then(snap => snap.val() || {})
      .then(presets =>
        Promise.all(
          Object.keys({ ...presets, basic: presets.basic || BASIC_PRESET }).map(
            presetId =>
              firebase
                .database()
                .ref(`/tasks/${presetId}`)
                .once("value")
                .then(snap => ({ id: presetId, ...(snap.val() || {}) }))
          )
        )
      );
  }

  fetchTask(taskId) {
    return firebase
      .database()
      .ref(`/tasks/${taskId}`)
      .once("value")
      .then(snap => snap.val());
  }

  fetchTasks(uid) {
    return firebase
      .database()
      .ref("/tasks")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(data => data.val() || {})
      .then(tasks => Object.keys(tasks).map(field => tasks[field]));
  }

  runTask(uid, taskInfo) {
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
                : reject(new Error("Failing - Unable execute your solution"))
            );
        });

      return firebase
        .database()
        .ref(`/jupyterSolutionsQueue/tasks/${answerKey}`)
        .set({
          owner: uid,
          taskKey: answerKey,
          solution: taskInfo,
          open: new Date().getTime()
        });
    });
  }

  validateTask(taskInfo) {
    switch (taskInfo.type) {
      case "jupyter":
        if (taskInfo.editable === undefined)
          throw new Error("Missing required `editable` field");
        break;
      default:
        return true;
    }
  }

  saveTask(uid, taskId, taskInfo) {
    this.validateTask(taskInfo);
    if (taskId === "new") {
      taskId = firebase
        .database()
        .ref("/tasks")
        .push().key;
    }
    const request = {
      ...taskInfo,
      id: taskId,
      owner: uid,
      updatedAt: {
        ".sv": "timestamp"
      }
    };

    return firebase
      .database()
      .ref(`/tasks/${taskId}`)
      .update(request)
      .then(() => taskId);
  }
}

export const tasksService = new TasksService();
