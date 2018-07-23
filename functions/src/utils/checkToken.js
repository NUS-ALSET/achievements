const admin = require("firebase-admin");

module.exports = req => {
  const { token } = req.query;

  if (!token) {
    const error = new Error("Missing token");

    error.code = 401;
    throw error;
  }

  return admin
    .database()
    .ref("api_tokens/" + token)
    .once("value")
    .then(snapshot => {
      if (!snapshot.val()) {
        const error = new Error("Invalid token");

        error.code = 401;
        throw error;
      }
    });
};
