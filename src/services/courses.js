/**
 * @file Courses service
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */

import firebase from "firebase";
import { dispatch } from "redux";
import { courseNewFail, courseNewSuccess } from "../containers/Courses/actions";

export class CoursesService {
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
        owner: this.getUser("uid")
      })
      .then(ref => {
        return firebase.push(`/coursePasswords/${ref.getKey()}`, password);
      })
      .then(() => courseNewSuccess(name))
      .catch(err => courseNewFail(name, err.message));
  }
}

export const coursesService = new CoursesService();
