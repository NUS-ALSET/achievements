import {
  COHORT_CLOSE_DIALOG,
  COHORT_FETCH_SUCCESS,
  COHORT_OPEN_ASSISTANTS_DIALOG,
  COHORT_UPDATE_ASSISTANTS_SUCCESS
} from "./actions";
import { ASSIGNMENT_ASSISTANT_FOUND } from "../Assignments/actions";

export const cohort = (state = { ui: {} }, action) => {
  switch (action.type) {
    case ASSIGNMENT_ASSISTANT_FOUND:
      return {
        ...state,
        ui: {
          ...state.ui,
          newAssistant: action.assistant
        }
      };
    case COHORT_OPEN_ASSISTANTS_DIALOG:
      return {
        ...state,
        ui: {
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
      return { ...state, ui: {} };
    case COHORT_FETCH_SUCCESS:
      return {
        ...state,
        cohort: action.cohortData
      };
    default:
      return state;
  }
};
