const admin = require("firebase-admin");

/**
 * Only users existing at `/admins/$uid` allowed to create tokens
 */
exports.handler = (data, context) => {
  if (!context.auth.uid) {
    return Promise.resolve();
  }
  return admin
    .database()
    .ref(`/admins/${context.auth.uid}`)
    .once("value")
    .then(snap => snap.val())
    .then(isAdmin => isAdmin && admin.auth().createCustomToken(data.uid, {}));
};
