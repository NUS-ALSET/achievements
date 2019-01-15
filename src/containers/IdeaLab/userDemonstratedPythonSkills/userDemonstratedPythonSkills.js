import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";



class userDemonstratedPythonSkills extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    isAdmin: PropTypes.bool,
    userDemonstratedPythonSkills: PropTypes.object,
    totalSkillsSet: PropTypes.object
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

    return (
      <Fragment>
        User-ID: {this.props.match.params.accountId}
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
  isAdmin: state.firebase.data.isAdmin,
  userDemonstratedPythonSkills: state.firebase.data.userDemonstratedPythonSkills,
  totalSkillsSet: state.firebase.data.totalSkillsSet
});

export default compose(
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
