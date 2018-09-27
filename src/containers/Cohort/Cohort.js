/**
 * @file Cohort container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";

import { firebaseConnect } from "react-redux-firebase";

import CohortCoursesTable from "../../components/tables/CohortCoursesTable";
import { cohortsService } from "../../services/cohorts";
import { cohortCoursesRecalculateRequest, cohortOpen } from "./actions";
import { sagaInjector } from "../../services/saga";

import withStyles from "@material-ui/core/styles/withStyles";

import sagas from "./sagas";
import { cohort } from "../../types";

import Breadcrumbs from "../../components/Breadcrumbs";

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  },
  toolbarItem: {
    margin: theme.spacing.unit
  }
});

class Cohort extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    classes: PropTypes.object,
    cohort: cohort,
    courses: PropTypes.object,
    currentUser: PropTypes.object,
    match: PropTypes.object
  };

  state = {
    selectedCourse: "",
    mounted: false
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    if (!this.state.mounted) {
      dispatch(cohortOpen(match.params.cohortId));
    }
    this.setState({ mounted: true });
  }

  selectCourse = e => this.setState({ selectedCourse: e.target.value });

  addCourse = () => {
    const { cohort } = this.props;

    cohortsService.addCourse(cohort.id, this.state.selectedCourse);
  };

  recalculate = () => {
    const { cohort, dispatch } = this.props;
    dispatch(cohortCoursesRecalculateRequest(cohort.id));
  };

  render() {
    const { dispatch, currentUser, cohort, courses, classes } = this.props;

    if (!cohort) {
      return <div>Loading</div>;
    }

    const isOwner = currentUser.uid && currentUser.uid === cohort.owner;

    return (
      <Fragment>
        <Breadcrumbs
          paths={[
            {
              label: "Cohorts",
              link: "/cohorts"
            },
            {
              label: cohort.name
            }
          ]}
        />
        <Typography
          gutterBottom
          style={{
            marginLeft: 30
          }}
        >
          Cohort Description: {cohort.description || "None provided"}
        </Typography>
        {isOwner && (
          <Toolbar>
            <TextField
              className={classes.toolbarItem}
              label="Course"
              onChange={this.selectCourse}
              select
              style={{
                width: 320,
                marginTop: 0
              }}
              value={this.state.selectedCourse}
            >
              {Object.keys(courses || {})
                .map(id => ({ ...courses[id], id }))
                .map(course => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
            </TextField>
            <Button
              className={classes.toolbarItem}
              onClick={this.addCourse}
              variant="raised"
            >
              Add
            </Button>
            <Button
              className={classes.toolbarItem}
              onClick={this.recalculate}
              variant="raised"
            >
              Recalculate
            </Button>
          </Toolbar>
        )}
        <CohortCoursesTable
          cohort={cohort}
          courses={cohort.courses}
          dispatch={dispatch}
          isOwner={isOwner}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  currentUser: {
    uid: state.firebase.auth.uid,
    name: state.firebase.auth.displayName
  },
  courses: Object.assign(
    {},
    state.firebase.data.myCourses,
    state.firebase.data.publicCourses
  ),
  cohort: state.cohort.cohort
});

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const firebaseAuth = state.firebase.auth;

    return [
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
