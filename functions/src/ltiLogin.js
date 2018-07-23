/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const lti = require("@dinoboff/ims-lti");

let canCreateTokens = false;
let serviceAccount = null;

// If service account deployed, then use it.
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().firebase.databaseURL
  });
  // Otherwise, initialize with the default config.
}

function redirectToLogin(message, res) {
  res.redirect(`${message}`);
}

// Tests to see if /users/<userId> has any data.
function checkIfUserExists(data, res) {
  let uid = data["user_id"] + "@" + data["oauth_consumer_key"];
  var newString = uid.split(".").join("---");
  admin
    .database()
    .ref(`/users/` + newString)
    .once("value", function(snapshot) {
      var exists = snapshot.val() !== null;
      get_token(data, res, exists);
      // res.send(exists);
    });
}

function get_token(data, res, exists) {
  //Create a new user.
  let uid = data["user_id"] + "@" + data["oauth_consumer_key"];
  admin
    .auth()
    .createCustomToken(uid)
    .then(function(customToken) {
      console.log("Custom token here: ", customToken);
      let message = "user_id -> " + data["user_id"] + "\n";
      message += "oauth_consumer_key -> " + data["oauth_consumer_key"] + "\n";
      message += "create user -> " + uid + "\n";
      message += "redirect to\n\n ";
      message += data["APP_REDIRECT_URL"] + customToken;
      var link = data["APP_REDIRECT_URL"] + customToken;

      var newString = uid.split(".").join("---");
      // data['oauth_consumer_key'] = newString;

      if (exists) {
        admin
          .database()
          .ref(`/users/` + newString)
          .update({})
          .then(function(snap) {
            redirectToLogin(link, res);
          })
          .catch(function(error) {
            console.log("Error creating user:", error);
          });
      } else {
        admin
          .database()
          .ref(`/users/` + newString)
          .update({
            isLTI: true,
            displayName: data["user_id"],
            consumerKey: data["oauth_consumer_key"]
          })
          .then(function(snap) {
            redirectToLogin(link, res);
          })
          .catch(function(error) {
            console.log("Error creating user:", error);
          });
      }
    })
    .catch(function(error) {
      console.log("Error creating custom token:", error);
    });
}

function ltiLogin(req, res) {
  console.log("we are here");
  let data = req.body;
  let oauth_consumer_key = data["oauth_consumer_key"];
  let user_id = data["user_id"];

  // Hardcoding secret until starts being pulled form database.
  let consumerSecret = "secret";

  // let provider = new lti.Provider(oauth_consumer_key , consumerSecret);
  const provider = new lti.Provider(oauth_consumer_key, consumerSecret, {
    trustProxy: true
  });
  if (!req.path) {
    req.url = "/ltiLogin";
  }

  if (req.headers["x-appengine-https"] === "on") {
    req.headers["x-forwarded-proto"] = "https";
  }
  req.protocol = "https";
  provider.valid_request(req, req.body, function(err, isValid) {
    /*
    To work around the lti library issue, but continue on with development, we will automatically login
    specific test users attempting to use a specifc consumer key.
    */
    let testUser = false;
    if (
      oauth_consumer_key === "AWESOME_CONSUMER_KEY" &&
      user_id === "AWESOME_USER_1"
    ) {
      testUser = true;
    }

    // if isValid or testUser, continue to login.
    if (isValid || testUser) {
      // Get the redirectURL and other lti details from the database.
      admin
        .database()
        .ref("lti")
        .once("value")
        .then(snapshot => {
          const ltiData = snapshot.val();
          data["APP_REDIRECT_URL"] =
            ltiData["redirectUrl"] +
            "?pause=" +
            ltiData["pauseRedirect"] +
            "&token=";
          if (canCreateTokens) {
            checkIfUserExists(data, res);
          } else {
            res.send(
              "Cannot create tokens. Service account file may not have been deployed."
            );
          }
        });
    } else {
      let message =
        "LTI login request was invalid. protocol -> " +
        req.protocol +
        " error-> " +
        err;
      message +=
        "oauth_consumer_key -> " +
        oauth_consumer_key +
        " user_id -> " +
        user_id;
      message += "\nisValid ->" + isValid;
      message += "\n\n" + JSON.stringify(data);
      res.send(message);
    }
  });
}

exports.handler = ltiLogin;
/* eslint-enable */
