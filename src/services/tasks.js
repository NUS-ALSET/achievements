import firebase from "firebase/app";

export class TasksService {
  fetchPresets() {
    return firebase
      .database()
      .ref("/config/taskPresets")
      .once("value")
      .then(snap => snap.val() || {})
      .then(presets =>
        Promise.all(
          Object.keys(presets).map(presetId =>
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

  saveTask(uid, taskId, taskInfo) {
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
