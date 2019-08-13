/* eslint-disable no-magic-numbers */
import firebase from "firebase/app";
import sinon from "sinon";
import assert from "assert";
import Promise from "bluebird";
import { CustomAnalysisService } from "../customAnalysis";

describe("Custom Analysis service tests", () => {
  /** @type {CustomAnalysisService} */
  let customAnalysisService;
  beforeEach(() => {
    firebase.restore();
    customAnalysisService = new CustomAnalysisService();
    sinon
      .stub(customAnalysisService, "fetchFile")
      .callsFake(() => Promise.resolve({ foo: "bar" }));
  });

  afterEach(() => firebase.restore());

  it("should fetch file contents", async () => {
    expect(await customAnalysisService.fetchFile("THE_FILE_ID")).toEqual({
      foo: "bar"
    });
  });

  it("should form analysis contents", async () => {
    expect(
      await customAnalysisService.formAnalysisContents(
        "https://colab.research.google.com/drive/THE_FILE_ID"
      )
    ).toEqual({
      analysisNotebook: '{"foo":"bar"}',
      type: "jupyter"
    });
    expect(
      await customAnalysisService.formAnalysisContents(
        "https://colab.research.google.com/drive/THE_FILE_ID#scrollTo=ID"
      )
    ).toEqual({
      analysisNotebook: '{"foo":"bar"}',
      type: "jupyter"
    });
    expect(
      await customAnalysisService.formAnalysisContents("CLOUD_FUNCTION_URL")
    ).toEqual({ type: "cloudFunction" });
  });

  it("should fetch assignments owned/collaborated by user", () => {
    firebase.refStub.withArgs("/assignments/-testCourseID").returns({
      once: () =>
        firebase.snap({
          "-testAssignmentID": {
            count: 1,
            createdAt: 1561368668239,
            deadline: "2019-12-13T17:30",
            details: "",
            id: "-testCourseID",
            level: "",
            name: "assignmentName",
            open: "2019-06-24T17:30",
            orderIndex: 1,
            progress: "0/0",
            questionType: "Text",
            solutionVisible: true,
            visible: true
          }
        })
    });
    return (
      customAnalysisService
        .fetchMyAssignments({ "-testCourseID": { name: "testCourse" } })
        .then(myAssignments =>
          assert.deepStrictEqual(myAssignments, [
            {
              assignments: [
                {
                  id: "-testAssignmentID",
                  name: "assignmentName",
                  type: "Text"
                }
              ],
              id: "-testCourseID",
              name: "testCourse"
            }
          ])
        ) &&
      customAnalysisService
        .fetchMyAssignments({})
        .then(myAssignments => assert.deepStrictEqual(myAssignments, []))
    );
  });
});
