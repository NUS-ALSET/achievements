/* eslint-disable no-continue */
// Tab with instructor view

import { ASSIGNMENTS_TYPES } from "../../services/courses";

const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

/**
 * Get Solutions for student. It compares `/solutions` and `/visibleSolutions` refs and returns solution data with
 * flags - is concrete solution published, validated and/or rejected by instructor
 *
 * @param {AchievementsAppState} state
 * @param {String} courseId
 * @param {String} student
 * @param {Object} [options]
 * @param {Boolean} [options.onlyVisible]
 * @returns {*}
 */
const getStudentSolutions = (state, courseId, student, options = {}) => {
  const achievements = student.achievements || {};
  const assignments = getFrom(state.firebase.data.assignments, courseId);

  // If we need only visible(published) results then we ignore real ones
  // It could be used at `assignments` tab viewed by course instructor,
  // since real solutions will be shown only at `instructor view` tab
  const solutions = options.onlyVisible
    ? {}
    : getFrom(getFrom(state.firebase.data.solutions, courseId), student.id);
  // Published (visible) results should be fetched in any case, to get info - was that solution published
  const publishedSolutions = getFrom(
    getFrom(state.firebase.data.visibleSolutions, courseId),
    student.id
  );
  const pathsData = state.assignments.pathsData || {};
  const result = Object.assign({}, publishedSolutions, solutions);
  
  Object.keys(Object.assign({}, solutions, publishedSolutions)).forEach(
    assignmentId => {
      const assignment = assignments[assignmentId] || {};
      let solution =
        solutions[assignmentId] || publishedSolutions[assignmentId];
      const userAchievements = achievements.CodeCombat || {};
      const published = !!publishedSolutions[assignmentId];
      const createdAt = solution && solution.createdAt;
      const pathActivities = pathsData[assignmentId];

      solution = solution && solution.value;


      if (!solution) {
        return true;
      }

      if (options.onlyVisible && !assignment.solutionVisible) {
        solution = "Completed";
      }

      switch (assignment.questionType) {
        case ASSIGNMENTS_TYPES.Text.id:
          result[assignmentId] = {
            createdAt,
            value: solution,
            validated: true,
            published,
            solution
          };
          return true;
        case ASSIGNMENTS_TYPES.Profile.id:
          result[assignmentId] = {
            createdAt,
            published,
            validated: userAchievements.id === solution,
            orderValue: userAchievements.totalAchievements,
            value: userAchievements.id
              ? `${userAchievements.id} (${userAchievements.totalAchievements})`
              : "",
            solution
          };
          return true;
        case ASSIGNMENTS_TYPES.CodeCombat.id:
        case ASSIGNMENTS_TYPES.CodeCombat_Number.id:
          result[assignmentId] = {
            createdAt,
            published,
            validated: userAchievements.id === solution,
            value: "Completed",
            solution
          };
          return true;
        // Backward compatibility
        case "PathProblem":
        case ASSIGNMENTS_TYPES.PathActivity.id:
          result[assignmentId] = {
            createdAt,
            published,
            validated: userAchievements.id === solution,
            originalSolution: result[assignmentId],
            value:
              (result[assignmentId] || {}).status ||
              ((result[assignmentId] || {}).value || {}).status ||
              "COMPLETED",
            solution
          };
          return true;
        case ASSIGNMENTS_TYPES.PathProgress.id:
          if (pathActivities) {
            solution = solution.replace(/\d+$/, pathActivities);
          }
          result[assignmentId] = {
            createdAt,
            published,
            validated: userAchievements.id === solution,
            originalSolution: result[assignmentId],
            value: solution,
            solution
          };
          return true;
        case ASSIGNMENTS_TYPES.TeamFormation.id:
          result[assignmentId] = {
            createdAt,
            published,
            validated: userAchievements.id === solution,
            originalSolution: result[assignmentId],
            value: solution,
            solution
          };
          return true;
        default:
          return true;
      }
    }
  );
  return result;
};

/**
 *
 * @param {ICourseAssignmentsMap}assignments hash map with assignments
 * @param {ICourseMembersMap} members hash map with members
 */
export const processTeamSolutions = (assignments, members) => {
  const teamFormations = {};
  let firstTeamFormation = "";
  const teamFormationKeys = [];

  if (Array.isArray(members)) {
    members = Object.assign(
      {},
      ...members.map(member => ({ [member.id]: member }))
    );
  }

  // Collect team formations
  for (const key of Object.keys(assignments)) {
    if (assignments[key].questionType === ASSIGNMENTS_TYPES.TeamFormation.id) {
      firstTeamFormation = firstTeamFormation || key;
      teamFormations[key] = {
        teams: {},
        tasks: []
      };
      teamFormationKeys.push(key);
    }
  }

  if (!firstTeamFormation) {
    return Promise.resolve();
  }

  // Distributive team tasks by team formations
  for (const key of Object.keys(assignments)) {
    /** @type {ICourseAssignmentBase} */
    const assignment = assignments[key];
    let team;

    if (
      assignment.useTeams ||
      assignment.questionType === ASSIGNMENTS_TYPES.TeamText.id
    ) {
      if (!assignment.teamFormation) {
        team = teamFormations[firstTeamFormation];
      } else {
        team = teamFormations[assignment.teamFormation];
      }
      if (team) {
        team.tasks.push(key);
      }
    }
  }

  // Fill team members and last teams solutions
  for (const memberKey of Object.keys(members)) {
    for (const teamFormationKey of teamFormationKeys) {
      const solutions = members[memberKey].solutions;
      const teamFormation = teamFormations[teamFormationKey];
      const teamName =
        (solutions &&
          solutions[teamFormationKey] &&
          solutions[teamFormationKey].value) ||
        "";

      if (!(teamName && solutions)) {
        continue;
      }

      let team = teamFormation.teams[teamName];
      if (!team) {
        team = { members: [], answers: {} };
        teamFormation.teams[teamName] = team;
      }
      team.members.push(memberKey);
      for (const taskKey of teamFormation.tasks) {
        const taskSolution = solutions[taskKey] || { createdAt: 0 };
        team.answers[taskKey] = team.answers[taskKey] || { createdAt: 0 };
        if (team.answers[taskKey].createdAt < taskSolution.createdAt) {
          team.answers[taskKey] = taskSolution;
        }
      }
    }
  }

  // Update solutions for team members
  for (const teamFormationKey of Object.keys(teamFormations)) {
    const teamFormation = teamFormations[teamFormationKey];
    for (const teamName of Object.keys(teamFormation.teams)) {
      const team = teamFormation.teams[teamName];
      for (const memberKey of team.members) {
        const member = members[memberKey];
        member.solutions[teamFormationKey].value = `${teamName} (${
          team.members.length
        })`;
        for (const taskKey of Object.keys(team.answers)) {
          if (team.answers[taskKey] && team.answers[taskKey].createdAt) {
            member.solutions[taskKey] = team.answers[taskKey];
          }
        }
      }
    }
  }
};

/**
 * Returns value from source object or empty object if no value exists
 * @param {Object} source
 * @param {String} field
 * @returns {*} value
 */
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

/**
 *
 * @param {AchievementsAppState} state
 * @returns {Object} ui props
 */
export const getAssignmentsUIProps = state => ({
  showHiddenAssignments: state.assignments.showHiddenAssignments,
  sortState: state.assignments.sort,
  currentTab: state.assignments.currentTab,
  dialog: state.assignments.dialog,
  currentAssignment: state.assignments.currentAssignment
});

const isOwner = (state, ownProps) =>
  state.firebase.auth.uid &&
  getFrom(
    getFrom(state.firebase.data.courses, ownProps.match.params.courseId),
    "owner"
  ) === state.firebase.auth.uid;
const isAssistant = (state, ownProps) =>
  getFrom(state.firebase.data.courseAssistants, ownProps.match.params.courseId)[
    state.firebase.auth.uid
  ];

export const getCurrentUserProps = (state, ownProps) => ({
  id: state.firebase.auth.uid,
  name: getFrom(state.firebase.data.users, state.firebase.auth.uid),
  isOwner: isOwner(state, ownProps),
  isAssistant: isOwner(state, ownProps) || isAssistant(state, ownProps),
  achievements: getFrom(
    state.firebase.data.userAchievements,
    state.firebase.auth.uid
  )
});

function getValueToSort(solutions, sortField) {
  let aValue = solutions[sortField];

  if (!aValue) {
    return aValue;
  }
  if (aValue.orderValue !== undefined) {
    return aValue.orderValue;
  }
  return aValue.value;
}

function checkVisibilitySolution(assignments, key, options) {
  const now = new Date().getTime();
  const assignment = assignments[key] || {};

  if (options.showHiddenAssignments) {
    return true;
  }

  return (
    assignment.visible &&
    new Date(assignment.open).getTime() < now &&
    new Date(assignment.deadline).getTime() > now
  );
}

/**
 *
 * @param {Object} assignments hash map with assignments
 */
function getPathProgressAssignments(assignments) {
  return Object.keys(assignments || {}).filter(
    key => assignments[key].questionType === ASSIGNMENTS_TYPES.PathProgress.id
  );
}

function getStudentPathProgress(member, targetAssignments, pathsData) {
    const result = {
    totalActivities: 0,
    totalSolutions: 0,
    lastSolutionTime: 0
  };
  for (const pathId of Object.keys(pathsData || {})) {
    result.totalActivities += pathsData[pathId];
  }
  try {
    for (const key of targetAssignments) {
      const solution = member.solutions[key];      
      if (solution && solution.value && solution.createdAt) {
        
        let newSol = solution.value.split(" ");        
        if(parseInt(newSol[0])>parseInt(newSol[2]))
        {
          newSol[0]=newSol[2]
          solution.value=newSol.join(" ")       
        }
       
        let value = /^(\d+) of (\d+)$/.exec(solution.value || "");
        value =
          value ||
          /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(solution.value || "") ||
          [];

        solution.value = (solution.value || "").replace(" /", " of ");
        result.totalSolutions += Number(value[1] || 0);   
        result.lastSolutionTime = Math.max(
          result.lastSolutionTime,
          solution.createdAt
        );
      }
    }
    // Temporary solution
  } catch (err) {
    console.error(err);
  }
  return result;
}

/**
 *
 * @param {AchievementsAppState} state
 * @param {Object} ownProps
 * @returns {AssignmentCourse} course props
 */
export const getCourseProps = (state, ownProps) => {
  const courseId = ownProps.match.params.courseId;
  const assignments = getFrom(state.firebase.data.assignments, courseId);
  const sortedMembers = {};
  const instructorView = state.assignments.currentTab === INSTRUCTOR_TAB_VIEW;
  const assignmentsEdit = state.assignments.currentTab === INSTRUCTOR_TAB_EDIT;
  const now = new Date().getTime();
  const pathsData = state.assignments.pathsData;
  const options = {
    showHiddenAssignments: state.assignments.showHiddenAssignments
  };
  const pathProgressAssignments = getPathProgressAssignments(assignments);
  const courseData = getFrom(state.firebase.data, "courses")[courseId];

  if (!courseData) {
    return null;
  }

  let members = state.assignments.courseMembers.map(courseMember => ({
    ...courseMember,
    solutions: getStudentSolutions(state, courseId, courseMember, {
      onlyVisible: !(
        instructorView || courseMember.id === state.firebase.auth.uid
      )
    })
  }));

  processTeamSolutions(assignments, members);

  members = members
    .map(member => ({
      ...member,
      pathProgress:
        pathProgressAssignments.length > 1 &&
        getStudentPathProgress(member, pathProgressAssignments, pathsData),
      progress: {
        totalSolutions: Object.keys(member.solutions).filter(key =>
          checkVisibilitySolution(assignments, key, options)
        ).length,
        lastSolutionTime: Object.keys(member.solutions)
          .filter(key => checkVisibilitySolution(assignments, key, options))
          .map(
            id =>
              member.solutions[id].createdAt ||
              (member.solutions[id].originalSolution &&
                member.solutions[id].originalSolution.createdAt)
          )
          .sort()
          .slice(-1)
          .pop()
      }
    }))
    .sort((a, b) => {
      const sortAssignment = assignments[state.assignments.sort.field];
      let aValue = a.name;
      let bValue = b.name;
      let result = 0;

      if (state.assignments.sort.field === "progress") {
        aValue = a.progress.totalSolutions;
        bValue = b.progress.totalSolutions;
        if (aValue === bValue) {
          aValue = -a.progress.lastSolutionTime;
          bValue = -b.progress.lastSolutionTime;
        }
      }

      if (state.assignments.sort.field === "pathProgress") {
        aValue = a.pathProgress.totalSolutions;
        bValue = b.pathProgress.totalSolutions;
        if (aValue === bValue) {
          aValue = -a.pathProgress.lastSolutionTime;
          bValue = -b.pathProgress.lastSolutionTime;
        }
      }

      if (
        !["studentName", "pathProgress", "progress"].includes(
          state.assignments.sort.field
        )
      ) {
        aValue = getValueToSort(a.solutions, state.assignments.sort.field);
        bValue = getValueToSort(b.solutions, state.assignments.sort.field);
        if (aValue === bValue) {
          aValue =
            a.solutions[state.assignments.sort.field] &&
            a.solutions[state.assignments.sort.field].createdAt;
          bValue =
            b.solutions[state.assignments.sort.field] &&
            b.solutions[state.assignments.sort.field].createdAt;
        }
      }
      aValue = aValue || "";
      bValue = bValue || "";

      // Sorting PathProgress for completed activities count
      if (
        sortAssignment &&
        sortAssignment.questionType === ASSIGNMENTS_TYPES.PathProgress.id &&
        typeof aValue === "string" &&
        typeof bValue === "string"
      ) {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        const aCountData = (aValue.match(/^\s*\d+/) || [])[0] || "";
        const bCountData = (bValue.match(/^\s*\d+/) || [])[0] || "";
        if (aCountData !== bCountData) {
          aValue = Number(aCountData);
          bValue = Number(bCountData);
        }
      }

      // Sorting TeamFormation for members count
      if (
        sortAssignment &&
        sortAssignment.questionType === ASSIGNMENTS_TYPES.TeamFormation.id &&
        typeof aValue === "string" &&
        typeof bValue === "string"
      ) {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        const aCountData = (aValue.match(/\(\d+\)$/) || [])[0] || "";
        const bCountData = (bValue.match(/\(\d+\)$/) || [])[0] || "";
        if (aCountData !== bCountData) {
          aValue = aCountData;
          bValue = bCountData;
        }
      }

      if (aValue > bValue) {
        result = 1;
      } else if (aValue < bValue) {
        result = -1;
      } else {
        result = 0;
      }
      return state.assignments.sort.direction === "asc" ? result : -result;
    });

  members.forEach(member => {
    sortedMembers[member.id] = member;
    sortedMembers[member.id].name = sortedMembers[member.id].name || "";
    return true;
  });
  
  return {
    id: courseId,
    ...courseData,
    members: sortedMembers,
    totalAssignments: Object.keys(assignments).filter(key =>
      checkVisibilitySolution(assignments, key, options)
    ).length,
    watchSeveralPaths: pathProgressAssignments.length > 1,
    assignments: Object.keys(assignments)
      .map(id => ({
        ...assignments[id],
        id,
        progress: `${members.filter(member => !!member.solutions[id]).length}/${
          members.length
        }`
      }))
      .filter(
        assignment =>
          assignmentsEdit ||
          (options.showHiddenAssignments ||
            (assignment.visible &&
              new Date(assignment.open).getTime() < now &&
              new Date(assignment.deadline).getTime() > now))
      )
      .sort((a, b) => {
        if (a.orderIndex > b.orderIndex) {
          return 1;
        } else if (a.orderIndex === b.orderIndex) {
          return 0;
        }
        return -1;
      })
  };
};
