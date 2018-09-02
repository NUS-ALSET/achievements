import firebase from "firebase";
import {
  notificationShow,
  notificationHide
} from "../containers//Root/actions";

class FirebaseService {
  constructor() {
    this.stopAfter = 10;//in sec
    this.timer = null;
    this.store = null;
    this.collectionName = '';
    this.processName = ''
  }

  setStore(store) {
    this.store = store;
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  stopProcessAfterTimeOut(taskKey, cb) {
    this.timer = setTimeout(
      () => {
        firebase
          .database()
          .ref(`/${this.collectionName}/responses/${taskKey}`)
          .remove()
        this.offFirebaseChangeListen(taskKey);
        this.dispatch(notificationShow(`${this.processName} Timeout`));
        setTimeout(() => {
          cb();
        }, 1000)
      }, this.stopAfter*1000);
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

  addTask(taskKey,data) {
    return firebase
      .ref(`/${this.collectionName}/tasks/${taskKey}`).set({
        taskKey,
        ...data
      });
  }

  showNotification(message){
    if(this.processName && this.processName.length>0){
      this.dispatch(notificationHide());
      this.dispatch(
        notificationShow(`${this.processName} : ${message}`)
      )
    }
  }

  startProcess( data, collection, process='') {
    this.collectionName = collection;
    this.processName = process;
    this.dispatch(notificationHide());
    return new Promise((resolve, reject) => {
      this.showNotification('Start');
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
                const value = response.val() || {};
                if (!value.error) {
                  this.showNotification('Completed');
                  resolve( 
                    value
                  )
                } else {
                  this.showNotification(`Failded (${value.error.message})`);
                  setTimeout(() => {
                    this.deleteTask(taskKey);
                    reject(value.error);
                  }, 1000)
                }
              }
            );
        });
      this.addTask(taskKey, data);
      this.stopProcessAfterTimeOut(taskKey, () => reject({ message : 'Processing Timeout'}));
    });
  }
}

export const firebaseService = new FirebaseService();