import {
  COHORT_CLOSE_DIALOG,
  COHORT_COURSE_UPDATE_SUCCESS,
  COHORT_FETCH_SUCCESS,
  COHORT_OPEN_ASSISTANTS_DIALOG,
  COHORT_UPDATE_ASSISTANTS_SUCCESS,
  COHORT_SORT_CHANGE,
  COHORT_ANALYTICS_DATA_REQUEST_SUCCESS,
  SET_COHORT_QUALIFICATION_CONDITION_SUCCESS
} from "./actions";
import { ASSIGNMENT_ASSISTANT_FOUND } from "../Assignments/actions";

export const cohort = (
  state = { ui: { sortState: { field: "rank", direction: "asc" } } },
  action
) => {
  switch (action.type) {
    case ASSIGNMENT_ASSISTANT_FOUND:
      return {
        ...state,
        ui: {
          ...state.ui,
          newAssistant: action.assistant
        }
      };
    case COHORT_COURSE_UPDATE_SUCCESS:
      return action.kind === "remove"
        ? {
            ...state,
            cohort: {
              ...state.cohort,
              courses: state.cohort.courses.filter(
                course => course.id !== action.courseId
              )
            }
          }
        : state;
    case COHORT_SORT_CHANGE:
      return {
        ...state,
        ui: {
          ...state.ui,
          sortState: {
            field: action.sortField,
            direction: state.ui.sortState.direction === "asc" ? "desc" : "asc"
          }
        }
      };
    case COHORT_OPEN_ASSISTANTS_DIALOG:
      return {
        ...state,
        ui: {
          sortState: state.ui.sortState,
          dialog: "Assistants"
        }
      };
    case COHORT_UPDATE_ASSISTANTS_SUCCESS:
      return {
        ...state,
        cohort: {
          ...state.cohort,
          assistants:
            action.action === "add"
              ? state.cohort.assistants.concat([state.ui.newAssistant])
              : state.cohort.assistants.filter(
                  assistant => assistant.id !== action.assistantId
                )
        },
        ui: {
          ...state.ui
        }
      };
    case COHORT_CLOSE_DIALOG:
      return { ...state, ui: { sortState: state.ui.sortState } };
    case COHORT_FETCH_SUCCESS:
      return {
        ...state,
        cohort: action.cohortData
      };
    case COHORT_ANALYTICS_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        cohortsAnalytics :{
          ...(state.cohortsAnalytics || {}),
          [action.cohortId] : action.data
        }
      }
    case SET_COHORT_QUALIFICATION_CONDITION_SUCCESS:
      return {
        ...state,
        cohort: {
          ...state.cohort,
          qualifiedConditions: {
            pathConditions: action.conditionData,
            updatedAt : Date.now()
          }
        }
      };
    default:
      return state;
  }
};
