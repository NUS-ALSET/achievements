/* eslint-disable space-before-function-paren */
import sinon from "sinon";
import * as adminSagas from "../sagas";
import { coursesService } from "../../../services/courses";
import { runSaga } from "redux-saga";
import {
  adminUpdateConfigRequest,
  adminUpdateConfigSuccess,
  adminUpdateConfigFail,
  adminCustomAuthRequest,
  createNewService,
  createNewServiceSuccess,
  createNewServiceFaliure,
  fetchServiceDetails,
  fetchServiceDetailsSuccess,
  fetchServiceDetailsFaliure,
  updateServiceDetails,
  updateServiceDetailsSuccess
} from "../actions";

describe("assignemnts sagas tests", () => {
  beforeEach(() =>
    sinon.stub(coursesService, "addAssignment").callsFake(() => {})
  );

  afterEach(() => coursesService.addAssignment.restore());

  it("should process admin config", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      adminUpdateConfigRequest("config")
    ).done;
  });
  it("should process admin config succesfully", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      adminUpdateConfigSuccess("config")
    ).done;
  });

  it("should process admin authentication request", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      adminCustomAuthRequest("config")
    ).done;
  });

  it("should process new service", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      createNewService("data")
    ).done;
  });

  it("should process new service successfully", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      createNewServiceSuccess()
    ).done;
  });

  it("should process new service failure", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      createNewServiceFaliure({})
    ).done;
  });

  it("should process fetch service details", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      fetchServiceDetails(0)
    ).done;
  });

  it("should process fetch service details success", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      fetchServiceDetailsSuccess({})
    ).done;
  });

  it("should process fetch service details fail", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      fetchServiceDetailsFaliure({})
    ).done;
  });

  it("should process update service details", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      updateServiceDetails({})
    ).done;
  });

  it("should process update service details success", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      updateServiceDetailsSuccess({})
    ).done;
  });

  it("should fail admin config", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      adminUpdateConfigFail()
    ).done;
  });
});
