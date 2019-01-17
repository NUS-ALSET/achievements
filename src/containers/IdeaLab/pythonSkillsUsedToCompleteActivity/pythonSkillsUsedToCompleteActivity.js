import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


const styles = () => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 240,
    width: 400,
    padding: 20
  }
});


class pythonSkillsUsedToCompleteActivity extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    pythonSkills: PropTypes.object
  }

  render() {
    const {
      auth,
      classes,
      pythonSkills
    } = this.props;

    if (!auth.uid) {
      return (
        <div>
          Please Log in to view the content of this page
        </div>
      );
    }

    return (
      <Fragment>
        <h1>Activity Id: {this.props.match.params.problemId}</h1>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Grid container className={classes.demo} justify="center" spacing={16}>
              <Grid item>
                <Paper className={classes.paper}>
                  {pythonSkills
                    ? (
                      <Fragment>
                        <b>Python Skills Used to Complete This Activity:</b>
                        <hr />
                        <Link to={`/paths/${pythonSkills.path}/activities/${this.props.match.params.problemId}`}>
                          Link to the Activity
                        </Link>
                        <p>Number of Users Completed: {pythonSkills.NumUserCompleted}</p>
                        {console.log(pythonSkills)}
                        <b>Python Skills Used: frequency</b>
                        {Object.keys(pythonSkills.UsedPythonSkills).map(item => (
                          <li key={item}>
                            {item}: {pythonSkills.UsedPythonSkills[item]}
                          </li>
                        ))}
                      </Fragment>
                    )
                    : (
                      "loading..."
                    )
                  }
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  pythonSkills: state.firebase.data.pythonSkillsUsedToCompleteActivityX
});

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const activityKey = ownProps.match.params.problemId
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [];
    }
    return [
      {
        path: `/analytics/prototyping/pythonSkillsUsedToCompleteActivity/${activityKey}`,
        storeAs: "pythonSkillsUsedToCompleteActivityX"
      }
    ]
  }),
  connect(
    mapStateToProps
  )
)(pythonSkillsUsedToCompleteActivity);
