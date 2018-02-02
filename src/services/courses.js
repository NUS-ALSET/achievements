/**
 * @file Courses service
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */

import firebase from "firebase";
import { courseNewFail, courseNewSuccess } from "../containers/Courses/actions";
import { riseErrorMessage } from "../containers/AuthCheck/actions";
import {
  coursePasswordEnterFail,
  coursePasswordEnterRequest,
  coursePasswordEnterSuccess
} from "../containers/Assignments/actions";

const ERROR_TIMEOUT = 6000;

export class CoursesService {
  errorTimeout = false;
  setStore(store) {
    this.store = store;
  }
  dispatch(action) {
    this.store.dispatch(action);
  }
  dispatchErrorMessage(action) {
    this.store.dispatch(action);
    this.store.dispatch(riseErrorMessage(action.error));
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.dispatch(riseErrorMessage(""));
      this.errorTimeout = false;
    }, ERROR_TIMEOUT);
  }
  // noinspection JSMethodCanBeStatic
  getUser(field) {
    const user = firebase.auth().currentUser;
    if (field) {
      return user[field];
    }
    return user;
  }
  createNewCourse(name, password) {
    return firebase
      .push("/courses", {
        name,

        // Temporary, replace for `populate` and `users`
        instructorName: this.getUser("displayName"),
        owner: this.getUser("uid")
      })
      .then(ref => {
        return firebase.set(`/coursePasswords/${ref.getKey()}`, password);
      })
      .then(() => this.dispatch(courseNewSuccess(name)))
      .catch(err =>
        this.dispatchErrorMessage(courseNewFail(name, err.message))
      );
  }
  tryCoursePassword(courseId, password) {
    coursePasswordEnterRequest(courseId);

    return firebase
      .set(
        `/studentCoursePasswords/${courseId}/${this.getUser("uid")}`,
        password
      )
      .then(() =>
        firebase.set(`/courseMembers/${courseId}/${this.getUser("uid")}`, true)
      )
      .then(() => this.dispatch(coursePasswordEnterSuccess()))
      .catch(err =>
        this.dispatchErrorMessage(coursePasswordEnterFail(err.message))
      );
  }

  addAssignment(courseId, assignment) {
    return firebase
      .ref(`/assignments/${courseId}`)
      .push(assignment)
      .catch(err =>
        this.dispatchErrorMessage(coursePasswordEnterFail(err.message))
      );
  }
}

export const coursesService = new CoursesService();
