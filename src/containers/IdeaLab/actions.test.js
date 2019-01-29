import * as actions from "./actions";

describe("CRUDdemo container", () => {
  it("has an action to change pathKey", () => {
    const pathKey = "123";
    const expectedAction = {
      type: actions.CHANGE_PATH_KEY_JUPSOL,
      pathKey
    };
    expect(actions.changePathKeyJupSol(pathKey)).toEqual(expectedAction);
  });

  it("has an action to initialize Analytics Data", () => {
    const analyticsData = {
      "-LRI6ZCPw5enJUlUhSq_": {
        activityKey: "-LENuWIIWsQnx7E7mvZ8",
        completed: 1,
        open: 1542213990076,
        time: 1542214009202,
        userKey: "UZmKsBKXhddzyHuXXhgreT1AmXt2"
      }
    };
    const expectedAction = {
      type: actions.INIT_ANALYTICSDATA,
      analyticsData
    };
    expect(actions.initAnalyticsData(analyticsData)).toEqual(expectedAction);
  });
  it("has an action to filter Analytics Data", () => {
    const pathKey = "123";
    const analyticsData = {
      "-LTa1BPeOSiqJXUko2Fr": {
        activityKey: "-LOWNrIGDzzKEOFi66o2",
        completed: 1,
        open: 1544678831836,
        pathKey: "123",
        time: 1544678852383,
        userKey: "UiRPOpGJ4iNnVpbny7WjVWQpdAh2"
      }
    };
    const expectedAction = {
      type: actions.FILTER_ANALYTICSDATA,
      analyticsData,
      pathKey
    };
    expect(actions.filterAnalyticsData(analyticsData, pathKey)).toEqual(
      expectedAction
    );
  });
});
