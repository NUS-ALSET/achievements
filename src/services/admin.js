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

  getData = data => {
    data.id = data.id || this.sliggify(data.name);
    const createdAtOrUpdatedAt = "createdAt" in data ? "updatedAt" : "createdAt";
    data[createdAtOrUpdatedAt] = {".sv": "timestamp"}
    data["enabled"] = "enabled" in data ? data.enabled : false;
    let publicData = {
      description : data.description,
      url : data.url,
      name : data.name,
      id : data.id,
      enabled : data.enabled,
      createdAt : data.createdAt || {".sv": "timestamp"}
    };
    if ("updatedAt" in data) publicData["updatedAt"] = {".sv": "timestamp"}

    return {service: data, thirdPartyServices: publicData};
  }

  saveService = finalData => {
    return firebase
        .database()
        .ref(`/config/services/${finalData.service.id}`)
        .set(finalData.service)
        .then(() => {
          return firebase
            .database()
            .ref(`/thirdPartyServices/${finalData.service.id}`)
            .set(finalData.thirdPartyServices)
        })
        .then(() => finalData.service)
        .catch(err => console.log(err))
  }
  createService = data => {
      const finalData = this.getData(data)
      return this.saveService(finalData);
  }

  updateService = data => {
    const finalData = this.getData(data);
    return this.saveService(finalData);
  }

  deleteService = id => {
    return firebase
      .database()
      .ref(`/thirdPartyServices/${id}`)
      .remove()
  }

  toggleService = service => {
    return firebase
      .database()
      .ref(`/config/services/${service.id}`)
      .update({
        enabled: !service.enabled
      })
      .then(() => {
        return firebase
            .database()
            .ref(`/thirdPartyServices/${service.id}`)
            .update({
              enabled: !service.enabled
            })
      })
      .catch(err => console.log(err))
  }

  fetchServiceDetails = id => {
    return firebase
      .database()
      .ref(`/config/services/${id}`)
      .once("value")
      .then(snap => snap.val())
  }
}

export const adminService = new AdminService();
