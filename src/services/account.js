/**
 * Service for actions with account
 */

import firebase from "firebase";
import data from "./data/singpath-cboesch-export";

/**
 * @typedef {Object} ExternalProfile external profile definition
 *
 * @property {String} url url of external profile ( e.g. https://codecombat.com)
 * @property {String} id id of external profile ( e.g. CodeCombat)
 * @property {String} name name of external profile ( e.g. Code Combat)
 * @property {String} description description of external profile ( e.g. learn to code )
 */

export class AccountService {
  setStore(store) {
    this.store = store;
  }

  /**
   *
   * @param {ExternalProfile} externalProfile
   * @param {String} uid
   * @param {String} login
   */
  addExternalProfile(externalProfile, uid, login) {
    return firebase.ref(`/userAchievements/${uid}/${externalProfile.id}`).set({
      id: login,
      lastUpdate: 0,
      totalAchievements: 0,
      achievements: {}
    });
  }

  /**
   *
   * @param {ExternalProfile} externalProfile
   * @param {String} uid
   */
  refreshAchievements(externalProfile, uid) {
    return firebase
      .ref(`/userAchievements/${uid}/${externalProfile.id}`)
      .update({
        achievements: data.achievements,
        totalAchievements: data.totalAchievements,
        lastUpdate: new Date().getTime()
      });
  }

  /**
   *
   * @param {ExternalProfile} externalProfile
   * @param {String} uid
   */
  removeExternalProfile(externalProfile, uid) {
    return firebase
      .ref(`/userAchievements/${uid}/${externalProfile.id}`)
      .remove();
  }

  fetchExternalProfiles() {
    // This should be in firebase, I guess
    return {
      CodeCombat: {
        url: "https://codecombat.com",
        id: "CodeCombat",
        name: "Code Combat",
        description: "learn to Code JavaScript by Playing a Game"
      }
      /* Unnecessary for now
      FreeCodeCamp: {
        url: "https://fetch-free-code-ca.mp",
        description:
          "<a href='https://www.freecodecamp.org'>Free Code Camp</a>, " +
          "Learn to code with free online courses, programming projects, " +
          "and interview preparation for developer jobs."
      },
      PivotalExpert: {
        url: "https://fetch-pivotal-expe.rt",
        description: "Some description"
      } */
    };
  }
}

export const accountService = new AccountService();
