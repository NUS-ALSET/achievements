/* eslint-disable space-before-function-paren */
import * as pathsSagas from "../sagas";
import { runSaga } from "redux-saga";
import {
  pathsOpen
} from "../actions";

describe("assignemnts sagas tests", () => {

  it("should process assignment creation", () => {
    const dispatched = [];

    runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { paths: {} } } })
      },
      pathsSagas.pathsOpenHandler,
      pathsOpen()
    ).done;
  });
});
