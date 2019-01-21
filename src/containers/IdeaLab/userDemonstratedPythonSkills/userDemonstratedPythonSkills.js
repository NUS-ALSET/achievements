import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";

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


class userDemonstratedPythonSkills extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    isAdmin: PropTypes.bool,
    userDemonstratedPythonSkills: PropTypes.object,
    totalSkillsSet: PropTypes.object
  }

  reducedTotalSkillsList = () => {
    const {
      userDemonstratedPythonSkills,
      totalSkillsSet
    } = this.props

    const UsedSkillsList = Object.keys(userDemonstratedPythonSkills)
    const AllSkillsList = Object.keys(totalSkillsSet)
      .reduce((accumulator, curr) => {
        return accumulator.concat(totalSkillsSet[curr])
      }, []) // array of the skills

    return {AllSkillsList, UsedSkillsList}
  }

  render() {
    const {
      auth,
      isAdmin,
      userDemonstratedPythonSkills,
      totalSkillsSet
    } = this.props;

    if (auth.uid !== this.props.match.params.accountId && !isAdmin) {
      return (
        <div>
          Only admins can view other userDemonstratedPythonSkills
        </div>
      );
    }
    const { classes } = this.props;

    return (
      <Fragment>
        <h1>User-ID: {this.props.match.params.accountId}</h1>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Grid container className={classes.demo} justify="center" spacing={16}>
              <Grid item>
                <Paper className={classes.paper}>
                  <b>Python Skills You have used:</b>
                  <hr />
                  <p>Python Skill : Num of Times used</p>
                  {userDemonstratedPythonSkills
                    ? (
                      Object.keys(userDemonstratedPythonSkills).map(item => (
                        <li key={item}>
                          {item}: {userDemonstratedPythonSkills[item]}
                        </li>
                      ))
                    )
                    : (
                      "loading..."
                    )
                  }
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <b>Available Python Skills:</b>
                  <hr />
                  <p>this list is not exhaustive</p>
                  {totalSkillsSet && userDemonstratedPythonSkills
                      ? (
                        Object.keys(totalSkillsSet).map(item => (
                          <li
                            key={item}
                            style={
                              Object.keys(userDemonstratedPythonSkills)
                                .includes(totalSkillsSet[item])
                              ? ({
                              textDecoration: "line-through"
                              })
                              : ({
                                textDecoration: "none"
                              })
                            }
                          >
                            {item}: {totalSkillsSet[item]}
                          </li>
                        ))
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
  isAdmin: state.firebase.data.isAdmin,
  userDemonstratedPythonSkills: state.firebase.data.userDemonstratedPythonSkills,
  totalSkillsSet: state.firebase.data.totalSkillsSet
});

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const accountId = ownProps.match.params.accountId
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [];
    }
    return [
      {
        path: `/admins/${uid}`,
        storeAs: "isAdmin"
      },
      {
        path: `/analytics/prototyping/userDemonstratedPythonSkills/${accountId}`,
        storeAs: "userDemonstratedPythonSkills"
      },
      {
        path: "/analytics/prototyping/userDemonstratedPythonSkills/totalSkillsSet",
        storeAs: "totalSkillsSet"
      }
    ]
  }),
  connect(
    mapStateToProps
  )
)(userDemonstratedPythonSkills);
