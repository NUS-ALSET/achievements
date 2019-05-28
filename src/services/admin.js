import firebase from "firebase/app";

export class AdminService {
  /**
   *
   * @param {Object} data
   * @returns {Object}
   */
  sliggify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s/g, "");
  }

  getData = data => {
    data.id =
      data.id ||
      String(data.name)
        .replace(/\s/g, "")
        .trim();
    const createdAtOrUpdatedAt =
      "createdAt" in data ? "updatedAt" : "createdAt";
    data[createdAtOrUpdatedAt] = { ".sv": "timestamp" };
    data["enable"] = "enable" in data ? data.enable : false;
    let publicData = {
      description: data.description,
      url: data.url,
      name: data.name,
      id: data.id,
      enable: data.enable,
      createdAt: data.createdAt || { ".sv": "timestamp" }
    };
    if ("updatedAt" in data) publicData["updatedAt"] = { ".sv": "timestamp" };

    return { service: data, thirdPartyServices: publicData };
  };

  saveService = finalData => {
    return firebase
      .database()
      .ref(`/config/services/${finalData.service.id}`)
      .set(finalData.service)
      .then(() => {
        return firebase
          .database()
          .ref(`/thirdPartyServices/${finalData.service.id}`)
          .set(finalData.thirdPartyServices);
      })
      .then(() => finalData.service)
      .catch(err => console.log(err));
  };
  createService = data => {
    const finalData = this.getData(data);
    return this.saveService(finalData);
  };

  updateService = data => {
    const finalData = this.getData(data);
    return this.saveService(finalData);
  };

  deleteService = id => {
    return firebase
      .database()
      .ref(`/thirdPartyServices/${id}`)
      .remove();
  };

  toggleService = service => {
    return firebase
      .database()
      .ref(`/config/services/${service.id}`)
      .update({
        enable: !service.enable
      })
      .then(() => {
        return firebase
          .database()
          .ref(`/thirdPartyServices/${service.id}`)
          .update({
            enable: !service.enable
          });
      })
      .catch(err => console.log(err));
  };

  fetchServiceDetails = id => {
    return firebase
      .database()
      .ref(`/config/services/${id}`)
      .once("value")
      .then(snap => snap.val());
  };
}

export const adminService = new AdminService();
