export const FETCH_COURSE_MEMBERS = "FETCH_COURSE_MEMBERS";
export const FETCH_COURSE_MEMBERS_SUCCESS = "FETCH_COURSE_MEMBERS_SUCCESS";
export const FETCH_COURSE_MEMBERS_FALIURE = "FETCH_COURSE_MEMBERS_FALIURE";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_FALIURE = "SEND_MESSAGE_FALIURE";

export const fetchCourseMembers = courseID => ({
  type: FETCH_COURSE_MEMBERS,
  courseID
});

export const fetchCourseMembersSuccess = members => ({
  type: FETCH_COURSE_MEMBERS_SUCCESS,
  members
});

export const fetchCourseMembersFaliure = err => ({
  type: FETCH_COURSE_MEMBERS_FALIURE,
  err
});

export const sendMessage = data => ({
  type: SEND_MESSAGE,
  data
});

export const sendMessageSuccess = res => ({
  type: SEND_MESSAGE_SUCCESS,
  res
});

export const sendMessageFaliure = err => ({
  type: SEND_MESSAGE_FALIURE,
  err
})
