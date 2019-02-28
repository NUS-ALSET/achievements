import LinearProgress from "@material-ui/core/LinearProgress";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import {
  getCourseProps,
  getCurrentUserProps
} from "../Assignments/selectors";
import { sagaInjector } from "../../services/saga";

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "../../components/Breadcrumbs";
import { courseInfo } from "../../types/index";
import sagas from "./sagas";

class Message extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    course: courseInfo,
    currentUser: PropTypes.object.isRequired,
    // Required only for password setting. Probably should be changed
    firebase: PropTypes.any
  };
  state = {
    password: ""
  };

  render() {
    console.log(this.props)
    const {
      auth,
      course,
      currentUser
    } = this.props;

    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    } else if (!course) {
      if (course === null) {
        return <p>Something wrong!</p>
      }
      return <LinearProgress />;
    }
  
    return (
      <Fragment>
        <Breadcrumbs
          action={
            (currentUser.isAssistant && [
              
            ]) ||
            null
          }
          paths={[
            {
              label: "Courses",
              link: "/courses"
            },
            {
              label: course.name
            }
          ]}
        />
        <Typography
          gutterBottom
          style={{
            marginLeft: 30
          }}
        >
          Course Description: {course.description || "None provided"}
        </Typography>
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

/**
 *
 * @param {AchievementsAppState} state
 * @param ownProps
 * @returns {*} props
 */
const mapStateToProps = (state, ownProps) => ({
  auth: state.firebase.auth,
  assistants: state.assignments.assistants,
  readOnly: state.problem && state.problem.readOnly,
  fieldAutoUpdated: state.assignments.fieldAutoUpdated,
  course: getCourseProps(state, ownProps),
  currentUser: getCurrentUserProps(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
  
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const courseId = ownProps.match.params.courseId;
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [];
    }

    return [
      `/courses/${courseId}`,
      `/courseAssistants/${courseId}`,
      `/solutions/${courseId}`,
      `/solutions/${courseId}/${uid}`,
      `/visibleSolutions/${courseId}`,
      `/assignments/${courseId}`
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Message);
