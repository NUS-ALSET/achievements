import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";

import RecommendationsListCard from "../../components/cards/RecommendationsListCard";
import ContentLoader from "./ContentLoader";
import sagas from "./sagas";
import { homeOpenRecommendation, updateRecommendation } from "./actions";
import { sagaInjector } from "../../services/saga";

const temporaryRecommendationsKinds = [
  "codeCombat",
  "jupyter",
  "jupyterInline",
  "youtube",
  "game",
  "NotebookWithNewSkills",
  "NotebookWithUsedSkills"
];

const recommendationTypes = {
  codeCombat: "game",
  game: "game",
  jupyter: "code",
  jupyterInline: "code",
  NotebookWithNewSkills: "code",
  NotebookWithUsedSkills: "code",
  youtube: "youtube"
};

export class HomeV2 extends React.Component {
  static propTypes = {
    // dispatch: PropTypes.func,
    userRecommendations: PropTypes.any,
    // uid: PropTypes.string,
    // auth: PropTypes.object,
    homeOpenRecommendation: PropTypes.func,
    updateRecommendation: PropTypes.func
  };

  reformatRecommendation = (recommendations, recommendationKey = "") => {
    return Object.keys(recommendations)
      .filter(key => key !== "title")
      .map(key => ({
        ...recommendations[key],
        activityId: [
          "NotebookWithNewSkills",
          "NotebookWithUsedSkills"
        ].includes(recommendationKey)
          ? recommendations[key].activity || recommendations[key].problem
          : key,
        subHeading: [
          "NotebookWithNewSkills",
          "NotebookWithUsedSkills"
        ].includes(recommendationKey)
          ? `Complete this activity to use the ${
              recommendations[key].feature
            } ${recommendations[key].featureType}`
          : ""
      }));
  };

  onRecommendationClick = recommendationType => (activityId, pathId) =>
    this.props.homeOpenRecommendation(
      recommendationType,

      /* Reduce userRecommendations to format
        ```
        {
          <recommendationsKey1>: [<activityKey1>, <activityKey2>, ...],
          <recommendationsKey2>: [<activityKey1>, <activityKey2>, ...],
          ...
        }
        ```
        */
      JSON.stringify(
        Object.assign(
          {},
          ...Object.keys(this.props.userRecommendations || {}).map(key => ({
            [key]: Object.keys(this.props.userRecommendations[key])
          }))
        )
      ),
      activityId,
      pathId
    );
  componentDidMount() {
    this.props.updateRecommendation();
  }
  render() {
    const { userRecommendations } = this.props;

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
              ["NotebookWithNewSkills", "NotebookWithUsedSkills"].includes(
                recommendationKey
              )
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
                  recommendationTypes[recommendedData[0].type]
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

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  userRecommendations: state.firebase.data.recommendations,
  auth: state.firebase.auth
});

const mapDispatchToProps = {
  homeOpenRecommendation,
  updateRecommendation
};

export default compose(
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [
        {
          path: "/config/defaultRecommendations",
          storeAs: "recommendations"
        }
      ];
    }

    return [
      {
        path: `/userRecommendations/${uid}`,
        storeAs: "recommendations"
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomeV2);
