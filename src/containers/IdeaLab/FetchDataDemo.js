import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

import { firebaseConnect } from "react-redux-firebase";

class FetchDataDemo extends React.PureComponent {
  static propTypes = {
    dummyData: PropTypes.object,
    moreProbRequestsData: PropTypes.object
  };

  render() {
    const { dummyData, moreProbRequestsData } = this.props;
    return (
      <Fragment>
        {dummyData ? (
          <Fragment>
            <h1>Fetched data from Firebase /analytics node</h1>
            <ul>
              {Object.keys(dummyData).map(item => (
                <li key={item}>
                  {item}: {dummyData[item]}
                </li>
              ))}
            </ul>
          </Fragment>
        ) : (
          <Fragment>
            <h1>fetching from /analytics/chartData</h1>
            <h2>...</h2>
          </Fragment>
        )}
        {moreProbRequestsData ? (
          <Fragment>
            <h1>Fetched data from Firebase /moreProblemsRequests node</h1>
            <ul>
              {Object.keys(moreProbRequestsData).map(item => (
                <li key={item}>
                  {moreProbRequestsData[item].path}:{" "}
                  {moreProbRequestsData[item].activityCount}
                </li>
              ))}
            </ul>
          </Fragment>
        ) : (
          <Fragment>
            <h1>fetching from /moreProblemsRequests</h1>
            <h2>...</h2>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  dummyData: state.firebase.data.dummyData,
  moreProbRequestsData: state.firebase.data.moreProbRequestsData
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;

    return [
      {
        path: "/analytics/chartData",
        storeAs: "dummyData"
      }
    ].concat(
      firebaseAuth.isEmpty
        ? []
        : [
            {
              path: "/moreProblemsRequests",
              storeAs: "moreProbRequestsData",
              queryParams: ["orderByChild=requestTime"]
            }
          ]
    );
  }),
  connect(mapStateToProps)
)(FetchDataDemo);
