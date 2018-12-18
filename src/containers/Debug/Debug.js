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
          <h1>Fetched data from Firebase /analytics node</h1>
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
    return <h1>fetching from /analytics/chartData</h1>;
  }
}
const mapStateToProps = state => ({
  dummyData: state.firebase.data.dummyData
});

export default compose(
  firebaseConnect(() => {
    return [
      {
        path: "/analytics/chartData",
        storeAs: "dummyData"
      }
    ];
  }),
  connect(mapStateToProps)
)(Debug);
