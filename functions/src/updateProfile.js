/**
 * This module processes profile refreshment requests
 */
const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

function updateProfile(data, resolve) {
     let logged_data = Object.assign({}, data);     
     logged_data["triggerType"] = "updateProfile";     
     return  Promise.all([
        admin
        .database()
        .ref("/config/services")
        .once("value")
        .then(snapshot => snapshot.val()),
        admin
          .database()
          .ref(`/userAchievements/${data.uid}/${data.service}/achievements`)
          .once("value")
          .then(existing => existing.val() || {}),          
        admin
          .firestore()
          .collection("/logged_events")
          .add({
            createdAt: Date.now(),
            type: "FIREBASE_TRIGGERS",
            uid: data.uid,
            sGen: true,
            otherActionData: logged_data
          })            
      ])
      .then(([services]) =>{
        const serviceId = services[data.service] ? data.service : "CodeCombat"
          return axios
          .get(
            `${services[serviceId].profileUrl}?username=` +
              data.serviceId
                .toLowerCase()
                .replace(/[ _]/g, "-")
                .replace(/[!@#$%^&*()]/g, "")
          )
          .then(response => {
            if(response.data.totalAchievements === -1){
              return admin
              .database()
              .ref(`/userAchievements/${data.uid}/${data.service}`)
              .remove()
            }
            
            return admin
              .database()
              .ref(`/userAchievements/${data.uid}/${data.service}`)
              .set(
                Object.assign(
                  {
                    lastUpdate: new Date().getTime()
                  },
                  response.data
                )
              );
          })
      })
      .catch(err => console.error(data.uid, err.message))
      .then(() => resolve());
}

exports.handler = updateProfile;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/updateProfileQueue"),
    (data, progress, resolve) => {
      return updateProfile(data, resolve);
    }
  );

  queue.addWorker();
};
