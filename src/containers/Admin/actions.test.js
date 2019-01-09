import * as actions from "./actions";

describe("Admin actions", () => {
  let config;

  beforeEach(() => {
    config = {
      recommendations: {
        newSkills: false
      }
    };
  });

  it("creates an action to request for admin config update", () => {
    const expectedAction = {
      type: actions.ADMIN_UPDATE_CONFIG_REQUEST,
      config
    };

    expect(actions.adminUpdateConfigRequest(config)).toEqual(expectedAction);
  });

  it("creates an action to notify the successful update of config", () => {
    const expectedAction = {
      type: actions.ADMIN_UPDATE_CONFIG_SUCCESS,
      config
    };

    expect(actions.adminUpdateConfigSuccess(config)).toEqual(expectedAction);
  });

  it("creates an action to notify the failed update of config", () => {
    const expectedAction = {
      type: actions.ADMIN_UPDATE_CONFIG_FAIL,
      config,
      reason: "someReason..."
    };

    expect(actions.adminUpdateConfigFail(config, "someReason...")).toEqual(
      expectedAction
    );
  });
});
