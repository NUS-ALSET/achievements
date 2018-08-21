import firebase from "firebase";
import {
  notificationShow,
  notificationHide
} from "../containers//Root/actions";

class CodeAnalysisService {
  constructor() {
    this.stopAfter = 5000;
    this.timer = null;
    this.store = null;
    this.collectionName='jupyterSolutionAnalysisQueue';
  }
  setStore(store) {
    this.store = store;
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  stopAnalysisAfterTimeOut(taskKey, cb) {
    this.timer = setTimeout(
      () => {
        firebase
          .database()
          .ref(`/${this.collectionName}/responses/${taskKey}`)
          .remove()
        this.offFirebaseChangeListen(taskKey);
        this.dispatch(notificationShow("Analysis timeout"));
        setTimeout(() => {
          cb();
        }, 1000)
      }, this.stopAfter);
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
      .remove()
  }

  deleteTask(taskKey) {
    return firebase
      .database()
      .ref(`/${this.collectionName}/tasks/${taskKey}`)
      .remove()
  }

  addTask(taskKey, uid, editableBlockCode) {
    return firebase
      .ref(`/${this.collectionName}/tasks/${taskKey}`).set({
        taskKey,
        owner: uid,
        solution: editableBlockCode || "",
      });
  }
  analyseCode(uid, solution, frozenBlockNum) {
    return new Promise((resolve, reject) => {
      this.dispatch(notificationHide());
      this.dispatch(notificationShow("Analysing your code..."));
      const editableBlockCode = 
      solution.cells
        .slice(0, solution.cells.length - frozenBlockNum)
        .map(c => c.cell_type === 'code' ? c.source.join("") : "")
        .join("");
      const taskKey = firebase
        .ref(`/${this.collectionName}/tasks`)
        .push().key;
      firebase
        .database()
        .ref(`/${this.collectionName}/responses/${taskKey}`)
        .on("value", response => {
          if (response.val() === null) {
            return;
          }
          this.clearTimer();
          this.offFirebaseChangeListen(taskKey);
          this.deleteResponse(taskKey)
            .then(
              () => {
                if (response.val()) {
                  this.dispatch(notificationShow("Analysis complete"));
                  resolve(
                    response.val().userSkills || {}
                  )
                } else {
                  this.dispatch(notificationShow("Failing - Unable to analysis your Editable block code"));
                  setTimeout(() => {
                    this.deleteTask(taskKey);
                    reject();
                  }, 1000)
                }
              }
            );
        });
      this.addTask(taskKey, uid, editableBlockCode);
      this.stopAnalysisAfterTimeOut(taskKey, () => reject());
    });
  }
}

export const codeAnalysisService = new CodeAnalysisService();