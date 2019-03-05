const admin = require("firebase-admin");

const handler = (dataBefore, dataAfter, cohortKey) => {
  if (
    dataBefore &&
    dataAfter &&
    (dataBefore.qualifiedConditions || {}).updatedAt ===
      (dataAfter.qualifiedConditions || {}).updatedAt
  ) {
    return null;
  }
  const cohort = dataAfter;
  return Promise.all([
    admin
      .database()
      .ref(`/cohortCourses/${cohortKey}`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/paths`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/completedActivities`)
      .once("value")
      .then(snapshot => snapshot.val())
  ])
    .then(async ([courses, paths, completedActivities]) => {
      const courseMembers = await Promise.all(
        Object.keys(courses || []).map(courseId =>
          admin
            .database()
            .ref(`/courseMembers/${courseId}`)
            .once("value")
            .then(members => Object.keys(members.val() || {}))
        )
      );
      const cohortMembers = Array.from(
        new Set(
          courseMembers.reduce((res, members) => [...res, ...members], [])
        )
      );
      const memberQualifiedStatus = {};
      const qualifiedConditions = (cohort.qualifiedConditions || {})
        .pathConditions;
      for (let memberId of cohortMembers) {
        memberQualifiedStatus[memberId] = true;
        for (let pathId in qualifiedConditions) {
          const {
            activitiesToComplete = {},
            allActivities = false,
            numOfCompletedActivities = 0
          } = qualifiedConditions[pathId];
          const totalPathActivities = paths[pathId].totalActivities || 0;
          const memberCompletedActivities =
            (completedActivities[memberId] || {})[pathId] || {};
          const memberCompletedPathActivitiesCount = Object.keys(
            memberCompletedActivities
          ).length;

          if (
            allActivities &&
            memberCompletedPathActivitiesCount < totalPathActivities
          ) {
            console.log(`Condition-1-Failed: Member ${memberId} has not completed all activities from  path ${pathId}`);
            memberQualifiedStatus[memberId] = false;
            break;
          }
          if (Object.keys(activitiesToComplete).length > 0) {
            const qualified = Object.keys(activitiesToComplete).reduce(
              (res, activityId) => res && memberCompletedActivities[activityId],
              true
            );
            if (!qualified) {
              console.log(`Condition-2-Failed: Member ${memberId} has not completed required activities from  path ${pathId}`);
              memberQualifiedStatus[memberId] = false;
              break;
            }
          }
          if (
            numOfCompletedActivities > 0 &&
            memberCompletedPathActivitiesCount < numOfCompletedActivities
          ) {
            console.log(`Condition-3-Failed: Member ${memberId} has not completed atlest ${numOfCompletedActivities} activities path ${pathId}`);
            memberQualifiedStatus[memberId] = false;
            break;
          }
        }
      }

      const cohortPaths = cohort.paths;
      const memberProgressInPaths = {};
      for(let pathId of cohortPaths){
        memberProgressInPaths[pathId]={};
        for(let memberId of cohortMembers){
          const memberCompletedActivities =
            (completedActivities[memberId] || {})[pathId] || {};
          const memberCompletedPathActivitiesCount = Object.keys(
            memberCompletedActivities
          ).length;
          memberProgressInPaths[pathId][memberId]=memberCompletedPathActivitiesCount;
        }
      }
      return Promise.all([
        admin
        .database()
        .ref(`/cohortMembersCompletedActivitiesCountOnPaths/${cohortKey}`)
        .set(memberProgressInPaths),
       admin
        .database()
        .ref(`/cohortMemberQualificationStatus/${cohortKey}`)
        .set(memberQualifiedStatus)
      ])
    })
    .catch(err => {
      console.log(err);
    });
};

exports.handler = handler;
