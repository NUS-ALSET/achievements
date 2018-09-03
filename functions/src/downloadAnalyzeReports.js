const admin = require("firebase-admin");
const DEFAULT_MAX_COUNT = 100;

/**
 *
 * @param {Object} request download config
 * @param {String} request.node firebase node to fetch
 * @param {Number} request.limit limit to fetch
 * @param {Array<String>} request.fields fields to fetch
 * @param {Boolean} request.skipHeader flag suppress headers in restuls
 *
 * @returns {Promise<string | never>}
 */
exports.handler = request =>
  admin
    .database()
    .ref(request.node)
    .limitToLast(request.limit || DEFAULT_MAX_COUNT)
    .once("value")
    .then(snap => snap.val())
    .then(
      data =>
        (request.skipHeader ? "" : `"${request.fields.join("\",\"")}"`) +
        Object.keys(data)
          .map(key => {
            let result = "";
            for (const field of request.fields) {
              if (result) result += ",";
              result += `"${data[key][field]}"`;
            }
            return result;
          })
          .join("\n")
    );
