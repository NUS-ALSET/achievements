const admin = require("firebase-admin");
const DEFAULT_MAX_COUNT = 100;

function getByPath(data, path) {
  data = data || {};
  let result = data;

  if (path.indexOf(".") === -1) {
    return data[path];
  }
  path = path.split(".");
  for (let i = 0; i < path.length; i += 1) {
    result = (result || {})[path[i]];
  }
  return String(result)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"");
}

/**
 *
 * @param {Object} request download config
 * @param {String} request.node firebase node to fetch
 * @param {String} [request.filterChild] optional filter node (orderByChild)
 * @param {String} [request.filterValue] optional filter value (equalTo)
 * @param {Number} request.limit limit to fetch
 * @param {Array<String>} request.fields fields to fetch
 * @param {Boolean} request.skipHeader flag suppress headers in restuls
 *
 * @returns {Promise<string | never>}
 */
exports.handler = request => {
  let ref = admin.database().ref(request.node);
  if (request.filterChild && request.filterValue) {
    ref = ref.orderByChild(request.filterChild).equalTo(request.filterValue);
  }
  return ref
    .limitToLast(Number(request.limit || DEFAULT_MAX_COUNT))
    .once("value")
    .then(snap => snap.val() || {})
    .then(
      data =>
        (request.skipHeader ? "" : `"${request.fields.join("\",\"")}"\n`) +
        Object.keys(data)
          .map(key => {
            let result = "";
            for (const field of request.fields) {
              if (result) result += ",";
              result += `"${getByPath(data[key], field)}"`;
            }
            return result;
          })
          .join("\n")
    );
};
