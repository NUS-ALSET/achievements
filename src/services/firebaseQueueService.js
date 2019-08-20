import firebase from "firebase/app";
import { notificationShow, notificationHide } from "../containers/Root/actions";

const PROCESS_STOP_TIME = 5000;

class FirebaseService {
  constructor() {
    // In sec
    this.stopAfter = 10;
    this.timer = null;
    this.store = null;
    this.collectionName = "";
    this.processName = "";
  }

  setStore(store) {
    this.store = store;
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  stopProcessAfterTimeOut(taskKey, cb) {
    this.timer = setTimeout(() => {
      firebase
        .database()
        .ref(`/${this.collectionName}/responses/${taskKey}`)
        .remove();
      this.offFirebaseChangeListen(taskKey);
      this.dispatch(notificationShow(`${this.processName} Timeout`));
      setTimeout(() => {
        cb();
      }, PROCESS_STOP_TIME);
    }, this.stopAfter * PROCESS_STOP_TIME);
  }

  clearTimer() {
    window.clearTimeout(this.timer);
    this.timer = null;
  }

  offFirebaseChangeListen(taskKey) {
    firebase
      .database()
      .ref(`/${this.collectionName}/responses/${taskKey}`)
      .off();
  }

  deleteResponse(taskKey) {
    return firebase
      .database()
      .ref(`/${this.collectionName}/responses/${taskKey}`)
      .remove();
  }

  deleteTask(taskKey) {
    return firebase
      .database()
      .ref(`/${this.collectionName}/tasks/${taskKey}`)
      .remove();
  }

  addTask(taskKey, data) {
    return firebase
      .database()
      .ref(`/${this.collectionName}/tasks/${taskKey}`)
      .set({
        taskKey,
        ...data
      });
  }

  showNotification(message) {
    if (this.processName && this.processName.length > 0) {
      this.dispatch(notificationHide());
      this.dispatch(notificationShow(`${this.processName} : ${message}`));
    }
  }

  startProcess(data, collection, process = "") {
    this.collectionName = collection;
    this.processName = process;
    this.dispatch(notificationHide());
    return new Promise((resolve, reject) => {
      this.showNotification("Start");
      const taskKey = firebase
        .database()
        .ref(`/${this.collectionName}/tasks`)
        .push().key;
      firebase
        .database()
        .ref(`/${this.collectionName}/responses/${taskKey}`)
        .on("value", response => {
          if (
            typeof response.val() !== "object" ||
            Object.keys(response.val() || {}).length === 0
          ) {
            return;
          }
          this.clearTimer();
          this.offFirebaseChangeListen(taskKey);
          this.deleteResponse(taskKey).then(() => {
            const value = response.val() || {};
            if (!value.error) {
              this.showNotification("Completed");
              resolve(value);
            } else {
              this.showNotification(`Failded (${value.error.message})`);
              setTimeout(() => {
                this.deleteTask(taskKey);
                reject(value.error);
              }, PROCESS_STOP_TIME);
            }
          });
        });
      this.addTask(taskKey, data);
      this.stopProcessAfterTimeOut(taskKey, () =>
        reject({ message: "Processing Timeout" })
      );
    });
  }
}

export const firebaseService = new FirebaseService();
