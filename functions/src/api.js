const admin = require("firebase-admin");

exports.handler = function api(token, data) {
  return Promise.resolve().then(() => {
    let supportedDatatypes = [
      "activities",
      "completedActivities",
      "users",
      "cohorts",
      "courses",
      "assignments",
      "solutions",
      "courseMembers",
      "cohortCourses",
      "problems",
      "paths",
      "problemSolutions",
      "usage",
      "userSkills",
      "problemSkills",
      "userRecommendations",
      "featureProblemPercentiles",
      "featureRanking",
      "moreProblemsRequests"
    ];
    if (!supportedDatatypes.includes(data)) {
      return "Unsupported data type " + data;
    }
    if (data === "usage") {
      data = "apiTracking/" + token;
    }
    if (token) {
      return admin
        .database()
        .ref("api_tokens/" + token)
        .once("value")
        .then(snapshot => {
          if (snapshot.val()) {
            const ref = admin.database().ref(data);
            let promise;
            promise = ref.once("value");

            return promise.then(snapshot2 => {
              const theData = snapshot2.val();
              if (theData) {
                // Track cost against API key
                // Put a node in the apikeys cost tracking.
                const apiTrackingRef = admin
                  .database()
                  .ref("apiTracking/" + token);
                let size = JSON.stringify(theData).length;
                return apiTrackingRef
                  .child("usage")
                  .push({
                    data: data,
                    size: size,
                    createdAt: {
                      ".sv": "timestamp"
                    }
                  })
                  .then(() => {
                    // eslint-disable-next-line no-console
                    console.log("Recording api resource usage.");

                    // Update the total
                    return apiTrackingRef
                      .child("totalUsage")
                      .transaction(function(total) {
                        if (total) {
                          total += size;
                        } else {
                          total = size;
                        }
                        return total;
                      })
                      .then(() => {
                        // And finally, send back data
                        return theData;
                      });
                  });
              }
              return "No data";
            });
          }
          return "Invalid token";
        });
    }
    return "Token is missing ";
  });
};
