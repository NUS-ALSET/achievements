import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";



class userDemonstratedPythonSkills extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    userDemonstratedPythonSkills: PropTypes.object,
    totalSkillsSet: PropTypes.object
  }

  render() {
    const {
      userDemonstratedPythonSkills,
      totalSkillsSet
    } = this.props;

    return (
      <Fragment>
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
          {totalSkillsSet
            ? (
              Object.keys(totalSkillsSet).map(item => (
                <li key={item}>
                  {item}: {totalSkillsSet[item]}
                </li>
              ))
            )
            : (
              "loading..."
            )
          }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  userDemonstratedPythonSkills: state.firebase.data.userDemonstratedPythonSkills,
  totalSkillsSet: state.firebase.data.totalSkillsSet
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    const uid = firebaseAuth.uid

    return [
      {
        path: `/analytics/prototyping/userDemonstratedPythonSkills/${uid}`,
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
