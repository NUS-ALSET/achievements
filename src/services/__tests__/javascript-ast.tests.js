/* eslint-disable no-magic-numbers */
import { getJSSkillsDifference } from "../javascript-ast";

describe("Javascript-ast service tests", () => {
  it("should get JS skill difference", () => {
    expect(
      getJSSkillsDifference(
        [{ code: "JSON.stringfy({data:12})" }],
        [{ code: "testing" }]
      )
    ).toEqual({
      CallExpression: true,
      Literal: true,
      MemberExpression: true,
      ObjectExpression: true,
      Property: true
    });
    expect(getJSSkillsDifference([], [])).toEqual({});
    expect(getJSSkillsDifference([{ code: "*" }], [{ code: "test" }])).toEqual(
      {}
    );
    expect(
      getJSSkillsDifference(
        [{ code: "*", path: "testPath" }],
        [{ code: "test", path: "testAnotherPath" }]
      )
    ).toEqual({});
    expect(
      getJSSkillsDifference([{ code: undefined }], [{ code: undefined }])
    ).toEqual({});
  });
});
