const admin = require("firebase-admin");

exports.handler = (newSolution, studentId, assignmentId) => {
  return new Promise((resolve) => {
    if (typeof newSolution.userSkills === 'object') {
      Promise.all([
        admin
          .database()
          .ref(`/userCodingSkills/${studentId}`)
          .once("value"),
        admin
          .database()
          .ref(`/problemCodingSkills/${assignmentId}`)
          .once("value"),
      ]).then(data => {
        const pySkills = data[0].exists() ? data[0].val() : {};
        const problemSkills = data[1].exists() ? data[1].val() : {};

        // add new Skills
        Object.keys((newSolution.userSkills || {})).forEach(key => {
          Object.keys((newSolution.userSkills || {})[key]).forEach(subKey => {
            if (!pySkills[key]) {
              pySkills[key] = {}
            }
            if (!pySkills[key][subKey]) {
              pySkills[key][subKey] = {};
            }
            pySkills[key][subKey][assignmentId] = true;

            if (!problemSkills[key]) {
              problemSkills[key] = {}
            }
            if (!problemSkills[key][subKey]) {
              problemSkills[key][subKey] = {};
            }
            problemSkills[key][subKey][studentId] = true;
          })
        })

        // update user & problem python skill
        return Promise.all([
          admin
            .database()
            .ref(`/userCodingSkills/${studentId}`)
            .set(pySkills),
          admin
            .database()
            .ref(`/problemCodingSkills/${assignmentId}`)
            .set(problemSkills),
          updateRecommendation(studentId, pySkills)
        ])
      })
    } else {
      resolve();
    }
  })

};



function updateRecommendation(userKey, userSkills) {
  return admin
    .database()
    .ref("/paths")
    .orderByChild("isPublic")
    .equalTo(true)
    .once("value")
    .then(snapshot => snapshot.val())
    .then(paths =>
      Promise.all(
        Object.keys(paths).map(pathKey =>
          Promise.all([
            admin
              .database()
              .ref("/activities")
              .orderByChild("path")
              .equalTo(pathKey)
              .once("value")
              .then(snapshot => snapshot.val()),
            admin
              .database()
              .ref(`/completedActivities/${userKey}/${pathKey}`)
              .once("value")
              .then(snapshot => snapshot.val())
          ])
        )
      )
    )
    .then(pathActivitiesData=>
      admin
        .database()
        .ref("/activityExampleSolutions")
        .once("value")
        .then(snapshot => snapshot.val())
        .then(activityExampleSolutions=>({
            pathActivitiesData,
            activityExampleSolutions
          })
        )
    )
    .then(({ pathActivitiesData, activityExampleSolutions={} }) => {
      let problemWithUnsolvedSkills = {
        title : "Jupyter Activities With New Skills"
      };
      let problemWithSolvedSkills = {
        title : "Jupyter Activities With Solved Skills"
      };
      for (const data of pathActivitiesData) {
        const [ activities = {}, completedActivities = {} ] = data;

        Object.keys(activities).forEach(key => {
          const activity = activities[key];
          if (
            ["jupyter", "jupyterInline"].includes(activity.type)
            && (activityExampleSolutions[key] || {}).skills 
            && !completedActivities[key]
          ) {
            const problemSkills = activityExampleSolutions[key].skills;

            Object.keys(problemSkills).forEach(feature => {
              Object.keys((problemSkills[feature] || {})).forEach(featureType => {
                // set object reference
                let skillsCollection = (userSkills[feature] || {})[featureType] ? problemWithSolvedSkills : problemWithUnsolvedSkills;
                // add problem to reference
                  skillsCollection[`${feature}_${featureType}`] = {
                    feature,
                    featureType,
                    path: activity.path,
                    problem: key,
                    problemOwner: activity.owner,
                    name: activity.name,
                    description: activity.description || '',
                    type: activity.type,
                  }
              })
            })
          }
        })
      }

      return Promise.all[
        admin
        .database()
        .ref(`/userRecommendations/${userKey}/solvedPySkills`)
        .set(problemWithSolvedSkills),
        admin
        .database()
        .ref(`/userRecommendations/${userKey}/unSolvedPySkills`)
        .set(problemWithUnsolvedSkills)
      ]
    })
    .catch(err => {
      console.error(err.message, err.stack);
      throw err;
    });
}
