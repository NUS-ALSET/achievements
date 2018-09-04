import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";

import RecommendationsListCard from "../../components/cards/RecommendationsListCard";
import ContentLoader from "./ContentLoader";
import { homeOpenRecommendation } from "./actions";

const temporaryRecommendationsKinds = [
  "codeCombat",
  "jupyter",
  "jupyterInline",
  "youtube",
  "game",
  "unSolvedPySkills",
  "solvedPySkills"
];

const recommendationTypes = {
  codeCombat: "game",
  game: "game",
  jupyter: "code",
  jupyterInline: "code",
  unSolvedPySkills: "code",
  solvedPySkills: "code",
  youtube: "youtube"
};

export class HomeV2 extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    userRecommendations: PropTypes.any,
    uid: PropTypes.string,
    auth: PropTypes.object
  };

  reformatRecommendation = (recommendations, recommendationKey = "") => {
    return Object.keys(recommendations)
      .filter(key => key !== "title")
      .map(key => ({
        ...recommendations[key],
        activityId: ["unSolvedPySkills", "solvedPySkills"].includes(
          recommendationKey
        )
          ? recommendations[key].activity || recommendations[key].problem
          : key,
        subHeading: ["unSolvedPySkills", "solvedPySkills"].includes(
          recommendationKey
        )
          ? `Complete this activity to use the ${
              recommendations[key].feature
            } ${recommendations[key].featureType}`
          : ""
      }));
  };

  onRecommendationClick = (recommendationType, recommendations) => (
    activityId,
    pathId
  ) =>
    this.props.dispatch(
      homeOpenRecommendation(
        recommendationType,
        JSON.stringify(recommendations),
        activityId,
        pathId
      )
    );

  render() {
    const { auth, userRecommendations } = this.props;
    if (auth.isEmpty) {
      return <div>Login required to display this page</div>;
    }

    if (!isLoaded(userRecommendations)) {
      return <ContentLoader />;
    }
    return (
      <Fragment>
        {Object.keys(userRecommendations || {})
          .filter(key => temporaryRecommendationsKinds.includes(key))
          .map(recommendationKey => {
            let recommendedData = this.reformatRecommendation(
              userRecommendations[recommendationKey],
              recommendationKey
            );
            if (
              ["unSolvedPySkills", "solvedPySkills"].includes(recommendationKey)
            ) {
              let uniqueActivities = {};
              recommendedData.forEach(data => {
                if (uniqueActivities[data.actualProblem]) {
                  uniqueActivities[data.actualProblem].push(
                    `${data.feature} ${data.featureType}`
                  );
                } else {
                  uniqueActivities[data.actualProblem] = [
                    `${data.feature} ${data.featureType}`
                  ];
                  uniqueActivities[data.actualProblem].data = { ...data };
                }
              });
              recommendedData = Object.keys(uniqueActivities).map(key => {
                return {
                  ...uniqueActivities[key].data,
                  subHeading:
                    "Complete this activity to use the " +
                    uniqueActivities[key].join(", ")
                };
              });
            }

            return recommendedData.length > 0 ? (
              <RecommendationsListCard
                data={recommendedData}
                key={recommendationKey}
                onRecommendationClick={this.onRecommendationClick(
                  recommendationTypes[recommendedData[0].type],
                  recommendedData
                )}
                title={userRecommendations[recommendationKey].title}
                type={recommendationTypes[recommendedData[0].type]}
              />
            ) : (
              ""
            );
          })}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  userRecommendations:
    state.firebase.data.userRecommendations &&
    state.firebase.data.userRecommendations[state.firebase.auth.uid],
  auth: state.firebase.auth
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
