/**
 * @file AltHome container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.06.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

//
import { firebaseConnect } from "react-redux-firebase";

// Import com
import Recommendations from "../../components/Recommendations";
import { userRecommendationsSelector } from "./selectors";

class AltHome extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    userRecommendations: PropTypes.array
  };

  render() {
    const { userRecommendations } = this.props;

    return (
      <Fragment>
        {userRecommendations.map(
          userRecs =>
            userRecs.items &&
            userRecs.items.length && (
              <Recommendations
                key={userRecs.title}
                recs={userRecs.items}
                title={userRecs.title}
              />
            )
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  userRecommendations: userRecommendationsSelector(state)
});

export default compose(
  connect(mapStateToProps),
  firebaseConnect((ownProps, store) => {
    const uid = store.getState().firebase.auth.uid;
    if (!uid) {
      return [];
    }
    return [`/userRecommendations/${uid}`];
  })
)(AltHome);
