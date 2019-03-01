import LinearProgress from "@material-ui/core/LinearProgress";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
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
import Grid from "@material-ui/core/Grid";
import { format , distanceInWordsToNow} from "date-fns";
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
    cohort: PropTypes.object
  };



  componentDidMount() {
    const hasCourse = !!this.props.course;
    const hasCohort = !!this.props.cohort;
    if (hasCourse) {
      this.props.fetchCourseMembers(this.props.course.id);
    } else if (hasCohort) {
      console.log("fetch cohort members");
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
    // console.log(this.props);
    this.props.sendMessage(data);
  }

  renderMessages = (classes) => {
    const messages = this.props.messages || {};
    return Object.keys(messages).map((key, i) => (
      <ListItem alignItems="flex-start" key={i} className={classes.message}>
        <ListItemText
          style={{ fontSize: "12px"}}
          primary={messages[key].text}
          secondary={distanceInWordsToNow(new Date(messages[key].timestamp))}
        />
      </ListItem>
    ));


  };

  render() {
    const {
      auth,
      course,
      cohort,
      type,
      classes
    } = this.props;

    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    } else if (!course && !cohort) {
      if (course === null) {
        return <p>Something wrong!</p>
      }
      return <LinearProgress />;
    }
    return (
      <Fragment>
        {/* <Breadcrumbs
          paths={[
            {
              label: type === "course" ? "Courses" : "Cohort",
              link: "/courses"
            },
            {
              label: type === "course" ? course.name : cohort.name
            }
          ]}
        /> */}
        {/* <Typography
          gutterBottom
          style={{
            marginLeft: 30
          }}
        >
          {type === "course" ? "Course Description" : "Cohort Description"} :
          {type === "course" ?course.description || "None provided" : cohort.description}
        </Typography> */}
        <Grid container spacing={24}>
          <Grid item xs={9} >
            <List className={classes.inbox} >
              {this.renderMessages(classes)}
            </List>
            <MessageForm sendMessage={this.sendMessage} />
          </Grid>
          <Grid item xs={3} className={classes.root}>
            <UsersList members={this.props.courseMembers} />
          </Grid>
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
      type === "course" ? state.message.courseMembers : console.log("need to fetch cohort members"),
    messages: state.firebase.data.messages
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
    const groupID = ownProps.type === "course" ? ownProps.match.params.courseId : ownProps.cohort.id;
    const ref = ownProps.type === "course" ? "courseMessages" : "cohortMessages";
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