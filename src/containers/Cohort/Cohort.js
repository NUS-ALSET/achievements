/**
 * @file Cohort container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/Menu/MenuItem";

import { firebaseConnect } from "react-redux-firebase";

import CohortCoursesTable from "../../components/tables/CohortCoursesTable";
import { cohortsService } from "../../services/cohorts";
import { selectCohort } from "./selectors";

const TEXTFIELD_STYLE_TOP = 14;

class Cohort extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    cohort: PropTypes.object,
    cohortCourses: PropTypes.object,
    courses: PropTypes.object,
    currentUser: PropTypes.object,
    match: PropTypes.object
  };

  state = {
    selectedCourse: ""
  };

  selectCourse = e => this.setState({ selectedCourse: e.target.value });

  addCourse = () => {
    const { cohort } = this.props;
    cohortsService.addCourse(cohort.id, this.state.selectedCourse);
  };

  render() {
    const { currentUser, cohort, courses } = this.props;
    const isOwner = currentUser.id && currentUser.id === cohort.owner;

    return (
      <Fragment>
        {isOwner && (
          <TextField
            select
            value={this.state.selectedCourse}
            onChange={this.selectCourse}
            label="Course"
            style={{
              width: 320,
              top: this.state.selectedCourse ? 0 : TEXTFIELD_STYLE_TOP,
              margin: 4
            }}
          >
            {Object.keys(courses || {})
              .map(id => ({ ...courses[id], id }))
              .map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
          </TextField>
        )}
        {isOwner && (
          <Button raised onClick={this.addCourse}>
            Add
          </Button>
        )}
        <CohortCoursesTable isOwner={isOwner} courses={cohort.courses} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: {
    uid: state.firebase.auth.uid,
    name: state.firebase.auth.displayName
  },
  courses: Object.assign(
    {},
    state.firebase.data.myCourses,
    state.firebase.data.publicCourses
  ),
  cohort: selectCohort(state, ownProps),
  cohortCourses: state.firebase.data.cohortCourses
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const cohortId = ownProps.match.params.cohortId;
    const firebaseAuth = store.getState().firebase.auth;

    return [
      `/cohorts/${cohortId}`,
      `/cohortCourses/${cohortId}`,
      "/courses",
      {
        path: "/courses",
        storeAs: "myCourses",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
      },
      {
        path: "/courses",
        storeAs: "publicCourses",
        queryParams: ["orderByChild=isPublic", "equalTo=true"]
      }
    ];
  }),
  connect(mapStateToProps)
)(Cohort);
