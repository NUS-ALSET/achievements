/* eslint-disable space-before-function-paren */
import sinon from "sinon";
import { courseNewRequestHandle, courseRemoveRequestHandle } from "../sagas";
import { coursesService } from "../../../services/courses";
import {
  COURSE_HIDE_DIALOG,
  COURSE_NEW_FAIL,
  COURSE_NEW_SUCCESS,
  courseHideDialog,
  courseNewRequest,
  courseNewSuccess,
  courseRemoveRequest,
  courseRemoveSuccess
} from "../actions";
import assert from "assert";
import { put, call } from "redux-saga/effects";
import { runSaga } from "redux-saga";
import { NOTIFICATION_SHOW } from "../../Root/actions";

describe("courses sagas tests", () => {
  beforeEach(() =>
    sinon.stub(coursesService, "createNewCourse").callsFake(() => "someKey")
  );
  afterEach(() => coursesService.createNewCourse.restore());

  it("should test new course requests sagas", () => {
    const newCourseData = { name: "testName", password: "testPassword" };

    const generator = courseNewRequestHandle(courseNewRequest(newCourseData));
    let next;

    next = generator.next();
    assert.deepStrictEqual(
      next.value,
      call(coursesService.validateNewCourse, newCourseData)
    );

    next = generator.next();
    assert.deepStrictEqual(next.value, put(courseHideDialog()));

    next = generator.next();
    assert.deepStrictEqual(
      next.value,
      call([coursesService, coursesService.createNewCourse], newCourseData)
    );

    next = generator.next();
    assert.deepStrictEqual(next.value, put(courseNewSuccess("testName")));
  });

  it("should test remove course request sagas", () => {
    const generator = courseRemoveRequestHandle(
      courseRemoveRequest("testCourseId")
    );
    let next;

    next = generator.next();
    assert.deepStrictEqual(next.value, put(courseHideDialog()));

    next = generator.next();
    assert.deepStrictEqual(
      next.value,
      call([coursesService, coursesService.deleteCourse], "testCourseId")
    );

    next = generator.next();
    assert.deepStrictEqual(
      next.value,
      put(courseRemoveSuccess("testCourseId"))
    );

    next = generator.next();
    assert.strictEqual(next.value, undefined);
  });

  it("should process course creation saga", async () => {
    const dispatched = [];
    const courseData = {
      name: "testName",
      password: "testPassword",
      description: ""
    };

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({})
      },
      courseNewRequestHandle,
      courseNewRequest(courseData)
    ).done;

    assert(coursesService.createNewCourse.called);

    assert.deepStrictEqual(dispatched, [
      {
        type: COURSE_HIDE_DIALOG
      },
      {
        type: COURSE_NEW_SUCCESS,
        name: courseData.name,
        key: "someKey"
      }
    ]);
  });

  it("should fail course creation", async () => {
    const dispatched = [];
    const courseData = {
      name: "",
      password: "testPassword"
    };

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({})
      },
      courseNewRequestHandle,
      courseNewRequest(courseData)
    ).done;

    assert(!coursesService.createNewCourse.called);

    assert.deepStrictEqual(dispatched, [
      {
        type: COURSE_NEW_FAIL,
        name: "",
        error: "Missing name or password"
      },
      {
        type: NOTIFICATION_SHOW,
        message: "Missing name or password"
      }
    ]);
  });
});
