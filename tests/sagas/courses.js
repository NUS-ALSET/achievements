/* eslint-disable space-before-function-paren */
import sinon from "sinon";
import {
  courseNewRequestHandle,
  courseRemoveRequestHandle
} from "../../src/containers/Courses/sagas";
import { coursesService } from "../../src/services/courses";
import {
  COURSE_HIDE_DIALOG,
  COURSE_NEW_FAIL,
  COURSE_NEW_SUCCESS,
  courseHideDialog,
  courseNewRequest,
  courseNewSuccess,
  courseRemoveRequest,
  courseRemoveSuccess
} from "../../src/containers/Courses/actions";
import assert from "assert";
import { put, call } from "redux-saga/effects";
import { runSaga } from "redux-saga";
import { NOTIFICATION_SHOW } from "../../src/containers/Root/actions";

describe("courses sagas tests", () => {
  beforeEach(() =>
    sinon.stub(coursesService, "createNewCourse").callsFake(() => "someKey")
  );
  afterEach(() => coursesService.createNewCourse.restore());

  it("should test new course requests sagas", () => {
    const generator = courseNewRequestHandle(
      courseNewRequest("testName", "testPassword")
    );
    let next;

    next = generator.next();
    assert.deepEqual(
      next.value,
      call(coursesService.validateNewCourse, "testName", "testPassword")
    );

    next = generator.next();
    assert.deepEqual(next.value, put(courseHideDialog()));

    next = generator.next();
    assert.deepEqual(
      next.value,
      call(
        [coursesService, coursesService.createNewCourse],
        "testName",
        "testPassword"
      )
    );

    next = generator.next();
    assert.deepEqual(next.value, put(courseNewSuccess("testName")));
  });

  it("should test remove course request sagas", () => {
    const generator = courseRemoveRequestHandle(
      courseRemoveRequest("testCourseId")
    );
    let next;

    next = generator.next();
    assert.deepEqual(next.value, put(courseHideDialog()));

    next = generator.next();
    assert.deepEqual(
      next.value,
      call([coursesService, coursesService.deleteCourse], "testCourseId")
    );

    next = generator.next();
    assert.deepEqual(next.value, put(courseRemoveSuccess("testCourseId")));

    next = generator.next();
    assert.equal(next.value, undefined);
  });

  it("should process course creation saga", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({})
      },
      courseNewRequestHandle,
      courseNewRequest("testName", "testPassword")
    ).done;

    assert(coursesService.createNewCourse.called);

    assert.deepEqual(dispatched, [
      {
        type: COURSE_HIDE_DIALOG
      },
      {
        type: COURSE_NEW_SUCCESS,
        name: "testName",
        key: "someKey"
      }
    ]);
  });

  it("should fail course creation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({})
      },
      courseNewRequestHandle,
      courseNewRequest("", "testPassword")
    ).done;

    assert(!coursesService.createNewCourse.called);

    assert.deepEqual(dispatched, [
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
