export const COHORT_COURSES_RECALCULATE_REQUEST =
  "COHORT_COURSES_RECALCULATE_REQUEST";
export const cohortCoursesRecalculateRequest = cohortId => ({
  type: COHORT_COURSES_RECALCULATE_REQUEST,
  cohortId
});

export const COHORT_COURSES_RECALCULATE_FAIL =
  "COHORT_COURSES_RECALCULATE_FAIL";
export const cohortCoursesRecalculateFail = cohortId => ({
  type: COHORT_COURSES_RECALCULATE_FAIL,
  cohortId
});

export const COHORT_COURSES_RECALCULATE_SUCCESS =
  "COHORT_COURSES_RECALCULATE_SUCCESS";
export const cohortCoursesRecalculateSuccess = cohortId => ({
  type: COHORT_COURSES_RECALCULATE_SUCCESS,
  cohortId
});

export const COHORT_COURSE_RECALCULATE_REQUEST =
  "COHORT_COURSE_RECALCULATE_REQUEST";
export const cohortCourseRecalculateRequest = (cohortId, courseId) => ({
  type: COHORT_COURSE_RECALCULATE_REQUEST,
  cohortId,
  courseId
});

export const COHORT_COURSE_RECALCULATE_SUCCESS =
  "COHORT_COURSE_RECALCULATE_SUCCESS";
export const cohortCourseRecalculateSuccess = (cohortId, courseId) => ({
  type: COHORT_COURSE_RECALCULATE_SUCCESS,
  cohortId,
  courseId
});

export const COHORT_COURSE_RECALCULATE_FAIL = "COHORT_COURSE_RECALCULATE_FAIL";
export const cohortCourseRecalculateFail = (cohortId, courseId) => ({
  type: COHORT_COURSE_RECALCULATE_FAIL,
  cohortId,
  courseId
});
