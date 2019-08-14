/* eslint-disable no-magic-numbers */
import firebase from "firebase/app";
import sinon from "sinon";
import Promise from "bluebird";
import { AdminCustomAnalysisService } from "../adminCustomAnalysis";

describe("Admin Custom Analysis service tests", () => {
  /** @type {AdminCustomAnalysisService} */
  let adminCustomAnalysisService;
  beforeEach(() => {
    firebase.restore();
    adminCustomAnalysisService = new AdminCustomAnalysisService();
    sinon
      .stub(adminCustomAnalysisService, "fetchFile")
      .callsFake(() => Promise.resolve({ foo: "bar" }));
  });

  afterEach(() => firebase.restore());

  it("should fetch file contents", async () => {
    expect(await adminCustomAnalysisService.fetchFile("THE_FILE_ID")).toEqual({
      foo: "bar"
    });
  });

  it("should form analysis contents", async () => {
    expect(
      await adminCustomAnalysisService.formAnalysisContents(
        "https://colab.research.google.com/drive/THE_FILE_ID"
      )
    ).toEqual({
      analysisNotebook: '{"foo":"bar"}',
      type: "jupyter"
    });
    expect(
      await adminCustomAnalysisService.formAnalysisContents(
        "https://colab.research.google.com/drive/THE_FILE_ID#scrollTo=ID"
      )
    ).toEqual({
      analysisNotebook: '{"foo":"bar"}',
      type: "jupyter"
    });
    expect(
      await adminCustomAnalysisService.formAnalysisContents(
        "CLOUD_FUNCTION_URL"
      )
    ).toEqual({ type: "cloudFunction" });
  });

  it("should get admin status", async () => {
    firebase.refStub.withArgs("/admins/-admintestUser").returns({
      once: () =>
        Promise.resolve({
          val() {
            return true;
          }
        })
    });

    firebase.refStub.withArgs("/admins/-nonadmintestUser").returns({
      once: () =>
        Promise.resolve({
          val() {
            return false;
          }
        })
    });

    return await (adminCustomAnalysisService
      .checkAdminStatus("-admintestUser")
      .then(result => expect(result).toBe(true)) &&
      adminCustomAnalysisService
        .checkAdminStatus("-nonadmintestUser")
        .then(result => expect(result).toBe(false)));
  });

  it("should check query options", () => {
    expect(
      adminCustomAnalysisService.checkOptions(
        ["option1", "option2"],
        ["option1"]
      )
    ).toBe(true);
    expect(
      adminCustomAnalysisService.checkOptions(
        ["option1", "option2"],
        ["option3"]
      )
    ).toBe(false);
    expect(
      adminCustomAnalysisService.checkOptions(
        ["option1", "option2", "option3"],
        ["option1", "option2"]
      )
    ).toBe(true);
    expect(
      adminCustomAnalysisService.checkOptions(
        ["option1", "option2", "option3"],
        ["option1", "option4"]
      )
    ).toBe(false);
  });
});
