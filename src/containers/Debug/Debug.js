import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

import { firebaseConnect } from "react-redux-firebase";

class Debug extends React.PureComponent {
  static propTypes = {
    dummyData: PropTypes.object
  };

  render() {
    const { dummyData } = this.props;
    if (dummyData) {
      return (
        <Fragment>
          <h1>Fetched data from Firebase "/analytics" node</h1>
          <ul>
            {Object.keys(dummyData)
              .map(item => (
                <li key={item}>
                  {item}: {dummyData[item]}
                </li>
            ))}
          </ul>
        </Fragment>
      );
    }
    return <h1>fetching from "/analytics/chartData</h1>;
  }
}
const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  // completedActivities: state.firebase.ordered.completedActivities,
  // publicPaths: state.firebase.ordered.publicPaths,
  // unsolvedPublicActivities: state.problem.unsolvedPublicActivities || [],
  // publicActivitiesFetched: state.problem.publicActivitiesFetched,
  dummyData: state.firebase.data.dummyData
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const firebaseAuth = state.firebase.auth;

    if (!firebaseAuth.uid) {
      return [];
    }

    return [
      {
        path: "/analytics/chartData",
        storeAs: "dummyData"
      }
    ];
  }),
  connect(mapStateToProps)
)(Debug);
