import firebase from "firebase";

export class AdminService {
  /**
   *
   * @param {Object} data
   * @returns {Object}
   */
  sliggify(str) {
    return str.toLowerCase().trim().replace(/\s/g,"");
  }
  createService = data => {
    const id = this.sliggify(data.name);
    data.id = id;
    data["createdAt"] = {".sv": "timestamp"};
    return firebase
      .database()
      .ref(`/thirdPartyServices/${id}`)
      .set(data)
      .then(() => data)
  }

  fetchServiceDetails = id => {
    return firebase
      .database()
      .ref(`/thirdPartyServices/${id}`)
      .once("value")
      .then(snap => snap.val())
  }
}

export const adminService = new AdminService();
