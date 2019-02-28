import {

} from "./actions";

export const assignments = (
  state = {
    currentTab: 0,
    dialog: false,
    courseMembers: [],
    showHiddenAssignments: false,
    sort: {
      field: "studentName",
      direction: "asc"
    },
    fieldAutoUpdated: false
  },
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};
