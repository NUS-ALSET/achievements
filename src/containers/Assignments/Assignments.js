import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import withStyles from "material-ui/styles/withStyles";
import { LinearProgress } from "material-ui/Progress";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";

import { Link } from "react-router-dom";
import TextField from "material-ui/TextField";
import AssignementsTable from "../../components/AssignementsTable";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import Typography from "material-ui/Typography";

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  }
});

class Assignments extends React.Component {
  static propTypes = {
    classes: PropTypes.any,
    course: PropTypes.any,
    match: PropTypes.any,
    courseId: PropTypes.string,
    courseLoaded: PropTypes.any,
    firebase: PropTypes.any,
    userId: PropTypes.string
  };

  // Force show assignments (when become participant)
  state = {
    showAssignments: false
  };

  handlePasswordChange = event =>
    this.setState({
      value: event.currentTarget.value
    });

  submitPassword = () => {
    const { courseId, firebase, userId, course } = this.props;
    if (this.state.value === course.password) {
      firebase.update(
        `/courses/${courseId}/participants`,
        {
          [userId]: new Date()
        },

        // Force show assignments
        () => this.setState({ showAssignments: true })
      );
    }
  };
  render() {
    const { courseLoaded, classes } = this.props;
    if (!courseLoaded) {
      return <LinearProgress />;
    }
    return (
      <Fragment>
        <Toolbar>
          <Link to="/Courses" className={classes.breadcrumbLink}>
            <Typography className={classes.breadcrumbText}>Courses</Typography>
          </Link>
          <ChevronRightIcon />
          <Typography className={classes.breadcrumbText}>
            Course name
          </Typography>
        </Toolbar>
        {this.props.course.ownerId === this.props.userId ||
        (this.props.course.participants &&
          this.props.course.participants[this.props.userId]) ||
        this.state.showAssignments ? (
          <Fragment>
            <Toolbar>
              <Button raised>Create assignment</Button>
            </Toolbar>
            <AssignementsTable assignements={{}} />
          </Fragment>
        ) : (
          <Fragment>
            <TextField
              onChange={this.handlePasswordChange}
              type="password"
              autoFocus
              fullWidth={true}
              label="Enter password"
            />
            <Grid container>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  alignItems="center"
                  direction="column"
                >
                  <Grid item />
                  <Grid>
                    <Button
                      raised
                      color="primary"
                      onClick={this.submitPassword}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userId: state.firebase.auth.uid,
    courseLoaded: isLoaded(state.firebase.data.courses),
    courseId: ownProps.match.params.courseId,
    course:
      isLoaded(state.firebase.data.courses) &&
      state.firebase.data.courses[ownProps.match.params.courseId]
  };
};

export default compose(
  withStyles(styles),
  firebaseConnect(),
  connect(mapStateToProps)
)(Assignments);
