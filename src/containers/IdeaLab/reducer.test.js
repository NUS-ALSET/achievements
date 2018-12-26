import { fetchDataDemo as reducer } from "./reducer";
import * as actions from "./actions";

describe("FetchDataDemo reducer", () => {
  it("should return the initial state when initialize store", () => {
    expect(reducer(undefined, {})).toEqual({
      jupyterAnalyticsPathKey: "",
      filteredAnalytics: []
    });
  });

  it("changes the JupyterSolution path key", () => {
    expect(
      reducer(undefined, {
        type: actions.CHANGE_PATH_KEY_JUPSOL,
        pathKey: "666"
      })
    ).toEqual({
      jupyterAnalyticsPathKey: "666",
      filteredAnalytics: []
    });
  });
  it("can initialize the analytics data", () => {
    expect(
      reducer(undefined, {
        type: actions.INIT_ANALYTICSDATA,
        analyticsData: {
          someID: {
            someValue: "test123"
          }
        }
      })
    ).toEqual({
      jupyterAnalyticsPathKey: "",
      filteredAnalytics: ["someID"]
    });
  });

  it("can filter analytics data based on pathkey", () => {
    expect(
      reducer(undefined, {
        type: actions.FILTER_ANALYTICSDATA,
        analyticsData: {
          "234": {
            pathKey: "123",
            name: "ito en"
          },
          "123": {
            pathKey: "123",
            name: "tay xin"
          },
          "567": {
            pathKey: "lala",
            name: "kunkka"
          }
        },
        pathKey: "123"
      })
    ).toEqual({
      jupyterAnalyticsPathKey: "",
      filteredAnalytics: ["123", "234"]
    });
  });
});
