import LinearProgress from "@material-ui/core/LinearProgress";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import {
  getCourseProps
} from "../Assignments/selectors";
import { sagaInjector } from "../../services/saga";

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "../../components/Breadcrumbs";
import { courseInfo } from "../../types/index";
import sagas from "./sagas";
import UsersList from "./UserList";
import { fetchCourseMembers, sendMessage } from "./actions";
import MessageForm from "./MessageForm";

class Message extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    course: courseInfo,
    firebase: PropTypes.any,
    fetchCourseMembers: PropTypes.func,
    courseMembers: PropTypes.object,
    sendMessage: PropTypes.func,
    messages: PropTypes.object
  };

  componentDidMount() {
    console.log(window.location.href);
  }

  componentDidUpdate(prevProps) {
    const hasCourse = !!this.props.course;
    if (hasCourse ) {
      if (this.props.course.id !== (prevProps.course || {}).id)
        this.props.fetchCourseMembers(this.props.course.id);
    }
  }

  renderUsersList = users => {
    return Object.keys(users).map(userkey => (
      <p key={userkey}>{userkey}</p>
    ));
  }

  sendMessage = text => {
    const data = {
      text,
      time: new Date(),
      senderID: this.props.auth.uid,
      courseID: this.props.course.id
    }
    // console.log(this.props);
    this.props.sendMessage(data);
  }

  renderMessages = () => {
    const messages = this.props.messages || {};
    return Object.keys(messages).map((key, i) => (
      <p key={i}>{messages[key].text}</p>
    ));
  };

  render() {
    const {
      auth,
      course
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
        <div>
          <UsersList members={this.props.courseMembers} />
        </div>
        <div>
          {this.renderMessages()}
        </div>
        <div>
          <MessageForm sendMessage={this.sendMessage} />
        </div>
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
  course: getCourseProps(state, ownProps),
  courseMembers: state.message.courseMembers,
  messages: state.firebase.data.messages
});

const mapDispatchToProps = dispatch => ({
  fetchCourseMembers : courseId => dispatch(fetchCourseMembers(courseId)),
  sendMessage : data => dispatch(sendMessage(data))
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const courseId = ownProps.match.params.courseId;
    const firebaseAuth = store.getState().firebase.auth;
    return firebaseAuth.isEmpty ? [] : [
        `/courses/${courseId}`,
        {
          path: `/courseMessages/${courseId}`,
          storeAs: "messages"
        }
    ]
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Message);
