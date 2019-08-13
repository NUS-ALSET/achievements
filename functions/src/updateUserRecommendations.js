/**
 *
 */

const admin = require("firebase-admin");

const MAX_ACTIVITIES_COUNT = 12;
const ACTIVITY_TYPES = {
  codeCombat: "CodeCombat Activities",
  jupyter: "Colaboratory Notebook Activities",
  jupyterInline: "Jupyter Notebook Activities",
  youtube: "YouTube Video Activities"
 // game: "Game Activities"
};

exports.handler = userKey =>
  Promise.all([
    admin
      .database()
      .ref("/config/recommendations")
      .once("value")
      .then(snapshot => snapshot.val()),
    admin
      .database()
      .ref("/activityExampleSolutions")
      .once("value")
      .then(snapshot => snapshot.val()),
    admin
      .database()
      .ref(`/userCodingSkills/${userKey}`)
      .once("value")
      .then(snapshot => snapshot.val()),
    admin
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
  ])
    .then(
      ([
        allowedRecommendations,
        activityExampleSolutions = {},
        userSkills = {},
        pathActivitiesData
      ]) => {
        const result = {};
        const updated = {};
        const problemWithUnsolvedSkills = {
          title: "Jupyter Notebook Activities With New Skills"
        };
        const problemWithSolvedSkills = {
          title: "Jupyter Notebook Activities With Solved Skills"
        };

        allowedRecommendations = allowedRecommendations || {
          NotebookWithNewSkills: true,
          NotebookWithUsedSkills: true,
          codeCombat: true,
          jupyter: true,
          jupyterInline: true,
          youtube: true
          //game: true
        };

        for (const data of pathActivitiesData) {
          const activities = data[0] || {};
          const solutions = data[1] || {};

          for (const activityKey of Object.keys(activities)) {
            const activity = activities[activityKey];
            if (
              ACTIVITY_TYPES[activity.type] &&
              !solutions[activityKey] &&
              (!updated[activity.type] ||
                updated[activity.type].length < MAX_ACTIVITIES_COUNT)
            ) {
              updated[activity.type] = updated[activity.type] || [];
              updated[activity.type].push(activity.id);
              result[activity.type] = result[activity.type] || {
                title: ACTIVITY_TYPES[activity.type]
              };
              result[activity.type][activityKey] = Object.assign(
                {
                  activity: activityKey,
                  name: activity.name || "",
                  feature: "activity",
                  featureType: activity.type || "",
                  problem: activityKey
                },
                activity
              );
            }

            // update solved & unsolved activities
            if (
              ["jupyter", "jupyterInline"].includes(activity.type) &&
              !solutions[activityKey]
            ) {
              const problemSkills =
                (activityExampleSolutions[activityKey] || {}).skills || {};

              Object.keys(problemSkills).forEach(feature => {
                Object.keys(problemSkills[feature] || {}).forEach(
                  featureType => {
                    // set object reference
                    let skillsCollection = ((userSkills || {})[feature] || {})[
                      featureType
                    ]
                      ? problemWithSolvedSkills
                      : problemWithUnsolvedSkills;
                    // add problem to reference
                    skillsCollection[`${feature}_${featureType}`] = {
                      feature,
                      featureType,
                      path: activity.path || "",
                      problem: activityKey || "",
                      problemOwner: activity.owner || "",
                      name: activity.name || "",
                      description: activity.description || "",
                      type: activity.type || ""
                    };
                  }
                );
              });
            }
          }
        }
        if (allowedRecommendations.NotebookWithUsedSkills) {
          result.NotebookWithUsedSkills = problemWithSolvedSkills;
        }
        if (allowedRecommendations.NotebookWithNewSkills) {
          result.NotebookWithNewSkills = problemWithUnsolvedSkills;
        }

        return Promise.all(
          Object.keys(ACTIVITY_TYPES).map(key => {
            const ref = admin
              .database()
              .ref(`/userRecommendations/${userKey}/${key}`);

            // Debug
            if (result[key]) {
              for (const subKey of Object.keys(result[key])) {
                if (result[key][subKey] === undefined) {
                  console.error(`Missing ${subKey} at `);
                }
              }
            }

            return result[key] && allowedRecommendations[key]
              ? ref.set(result[key])
              : ref.remove();
          })
        ).then(() => result);
      }
    )
    .catch(err => {
      console.error(err.message, err.stack);
      throw err;
    });
