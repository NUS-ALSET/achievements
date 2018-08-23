import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";

import RecommendationListCard from "./RecommendationListCard";

const temporaryRecommendationsKinds = [
  "codeCombat",
  "jupyter",
  "jupyterInline",
  "youtube",
  "game"
];

export class HomeV2 extends React.Component {
  static propTypes = {
    userRecommendations: PropTypes.any,
    uid: PropTypes.string
  };

  reformatRecommendation = recommendations => {
    return Object.keys(recommendations)
      .filter(key => key !== "title")
      .map(key => ({ ...recommendations[key], actualProblem: key }));
  };

  render() {
    const { userRecommendations } = this.props;
    return (
      <Fragment>
        {Object.keys(userRecommendations || {})
          .filter(key => temporaryRecommendationsKinds.includes(key))
          .map(recommendationKey => (
            <Fragment key={recommendationKey}>
              <RecommendationListCard
                dummyData={this.reformatRecommendation(
                  userRecommendations[recommendationKey]
                )}
                RecomType={
                  recommendationKey === "youtube" ? "youtube" : "python"
                }
                title={userRecommendations[recommendationKey].title}
              />
              <br />
            </Fragment>
          ))}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  userRecommendations:
    state.firebase.data.userRecommendations &&
    state.firebase.data.userRecommendations[state.firebase.auth.uid]
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [];
    }

    return [`/userRecommendations/${uid}`];
  }),
  connect(mapStateToProps)
)(HomeV2);
