import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { sagaInjector } from "../../services/saga";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { courseInfo } from "../../types/index";
import sagas from "./sagas";
import UsersList from "./UserList";
import { fetchCourseMembers, sendMessage } from "./actions";
import MessageForm from "./MessageForm";
import Grid from "@material-ui/core/Grid";
import { distanceInWordsToNow} from "date-fns";
import { withStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  root: {
    height: "calc(100vh - 64px)",
    overflowY: "scroll"
  },
  inbox: {
    height: "calc(100vh - 138px)",
    overflowY: "scroll",
    backgroundColor: "#ccc"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  message: {
    borderRadius: "10px 10px 10px 0px",
    backgroundColor: "white",
    width: "fit-content",
    margin: "10px 3px"
  }
});

class Message extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func,
    course: courseInfo,
    firebase: PropTypes.any,
    fetchCourseMembers: PropTypes.func,
    courseMembers: PropTypes.array,
    sendMessage: PropTypes.func,
    messages: PropTypes.object,
    type: PropTypes.string,
    cohort: PropTypes.object,
    authUser: PropTypes.object,
    classes: PropTypes.object,
    isInstructor: PropTypes.bool,
    showStudents: PropTypes.bool
  };



  componentDidMount() {
    const hasCourse = !!this.props.course;
    // const hasCohort = !!this.props.cohort;
    if (hasCourse) {
      this.props.fetchCourseMembers(this.props.course.id);
    }
  }

  sendMessage = text => {
    const chatType = this.props.type;
    const data = {
      text,
      time: new Date(),
      senderID: this.props.auth.uid,
      groupID: chatType === "course" ? this.props.course.id : this.props.cohort.id,
      collectionName: chatType === "course" ? "courseMessages" : "cohortMessages"
    }
    this.props.sendMessage(data);
  }

  renderMessages = (classes) => {
    const messagess = this.props.messages || {};
    const messagesCopy = JSON.parse(JSON.stringify(messagess))
    const computedMessages = Object.keys(messagesCopy).map(key => {
      const newMessage = (this.props.courseMembers || []).reduce((acc, member) => {
          acc = messagesCopy[key];
          if (messagesCopy[key].senderId === member.uid) {
            acc["senderName"] = member.displayName
          }
          return acc;
      }, {})
      if (Object.keys(newMessage).length === 0) {
        return messagesCopy[key]
      }
      return newMessage;
    })
    return Object.keys(computedMessages).map((key, i) => (
      <ListItem alignItems="flex-start" className={classes.message} key={i}>
        <ListItemText
          primary={computedMessages[key].text}
          secondary={
            <Fragment>
                From: {computedMessages[key].senderName} 
                <br/>
                <span style={{fontSize : "10px"}}>{distanceInWordsToNow(new Date(computedMessages[key].timestamp))}</span>
            </Fragment>
          }
          style={{ fontSize: "12px", wordBreak: "break-all"}}
        />
      </ListItem>
    ));
  };

  render() {
    const {
      classes,
      courseMembers,
      isInstructor,
      showStudents
    } = this.props;
    return (
      <Fragment>
        <Grid container spacing={24}>
          <Grid item xs={showStudents ? 9 : 12} >
            <List className={classes.inbox} >
              {this.renderMessages(classes)}
            </List>
            <MessageForm isInstructor={isInstructor} sendMessage={this.sendMessage} />
          </Grid>
          {showStudents && <Grid className={classes.root} item xs={3}>
            <UsersList members={courseMembers} />
          </Grid>}
          
        </Grid>
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const getState = (state, ownProps) => {
  const type = ownProps.type;
  const dynamicState = {
    auth: state.firebase.auth,
    [type === "course" ? "courseMembers" : "cohortMembers"]:
      type === "course" && state.message.courseMembers,
    messages: state.firebase.data.messages,
    authUser: state.firebase.auth
  }
  return dynamicState;
}
/**
 *
 * @param {Message} state
 * @param ownProps
 * @returns {*} props
 */
const mapStateToProps = (state, ownProps) => (getState(state, ownProps));

const mapDispatchToProps = dispatch => ({
  fetchCourseMembers: courseId => dispatch(fetchCourseMembers(courseId)),
  sendMessage: data => dispatch(sendMessage(data))
});

export default compose(
  withRouter,
  firebaseConnect(ownProps => {
    const groupID = ownProps.type === "course"
    ? ownProps.match.params.courseId
    : ownProps.cohort.id;
    const ref = ownProps.type === "course"
    ? "courseMessages"
    : "cohortMessages";
    return [
      {
        path: `/${ref}/${groupID}`,
        storeAs: "messages"
      }
    ]
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Message);