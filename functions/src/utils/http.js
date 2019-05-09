// const uuid = require("uuid");
// const admin = require("firebase-admin");
// const functions = require("firebase-functions");
// const profilesRefreshApproach =
//   (functions.config().profiles &&
//     functions.config().profiles["refresh-approach"]) ||
//   "none";
const axios = require("axios");

class HTTPUtil {
  /**
   * Call HTTP resource
   *
   * @param {String} url HTTP url for request
   * @param {String} [method=get] HTTP method
   * @param {any} [data] data for request
   * @returns {Promise<any>} promise with request processing result
   */
  call(url, method, data) {
    // const taskKey = uuid();

    if (!url) {
      throw new Error("Missing required `url` parameter");
    }

    // if (profilesRefreshApproach !== "trigger") {
      return axios({
        method,
        headers: { "content-type": "text/plain" },
        url,
        data
      }).then(response => response.data);
    // }

    // return new Promise((resolve, reject) => {
    //   try {
    //     admin
    //       .database()
    //       .ref("/outgoingRequestsQueue/tasks")
    //       .push({
    //         url,
    //         method: method || "get",
    //         data: data || null,
    //         taskKey
    //       })
    //       .then(() => {
    //         const answerRef = admin
    //           .database()
    //           .ref(`/outgoingRequestsQueue/answers/${taskKey}`);
    //         let skipFirst;
    //         return answerRef.on("value", response => {
    //           if (!skipFirst) {
    //             return (skipFirst = true);
    //           }
    //           answerRef.off();
    //           answerRef.remove();
    //           resolve(response.val());
    //         });
    //       });
    //   } catch (err) {
    //     reject(err);
    //   }
    // });
  }
  /**
   * Call HTTP resource with GET method
   *
   * @param {String} url HTTP url for request
   * @param {any} [data] data for request
   * @returns {Promise<any>} promise with request processing result
   */
  get(url, data) {
    return this.call(url, "get", data);
  }
  /**
   * Call HTTP resource with POST method
   *
   * @param {String} url HTTP url for request
   * @param {any} [data] data for request
   * @returns {Promise<any>} promise with request processing result
   */
  post(url, data) {
    return this.call(url, "post", data);
  }
}

exports.HTTPUtil = HTTPUtil;
exports.httpUtil = new HTTPUtil();
