import firebase from "firebase/app";

export class AdminCustomAnalysisService {
  /**
   * This method returns true or false based on whether the given user
   * is an admin or not
   *
   * @param {String} uid user id of creator
   *
   * @returns {Boolean} returns true or false
   */

  async checkAdminStatus(uid) {
    return await firebase
      .database()
      .ref(`/admins/${uid}`)
      .once("value")
      .then(response => response.val());
  }
}
export const adminCustomAnalysisService = new AdminCustomAnalysisService();
