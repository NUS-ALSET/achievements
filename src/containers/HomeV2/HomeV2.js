import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import RecommendationListCard from "./RecommendationListCard";

const temporaryRecommendationsKinds = [
  "codeCombat",
  "jupyter",
  "jupyterInline",
  "youtube",
  "game",
  "unSolvedPySkills",
  "solvedPySkills"
];

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  loader : {
    display : 'flex',
    flexDirection  : 'column',
    width : '50px',
    height : 'calc(100vh - 200px)',
    justifyContent : 'center',
    margin : '0 auto'
  }

});



export class HomeV2 extends React.Component {
  static propTypes = {
    userRecommendations: PropTypes.any,
    uid: PropTypes.string
  };

  reformatRecommendation = (recommendations, recommendationKey='') => {
    return Object.keys(recommendations)
      .filter(key => key !== "title")
      .map(key => ({ 
        ...recommendations[key],
        actualProblem: ["unSolvedPySkills", "solvedPySkills"].includes(recommendationKey) ? recommendations[key].problem : key,
        subHeading : ["unSolvedPySkills", "solvedPySkills"].includes(recommendationKey) 
        ? `Complete this activity to use the ${recommendations[key].feature} ${recommendations[key].featureType}` 
        : '' })
      );
  };

  render() {
    const { userRecommendations, classes } = this.props;
    if (!isLoaded(userRecommendations)) {
      return (
        <div className={classes.loader}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      );
    }
    return (
      <Fragment>
        {Object.keys(userRecommendations || {})
          .filter(key => temporaryRecommendationsKinds.includes(key))
          .map(recommendationKey => {
            let recommendedData = this.reformatRecommendation(
              userRecommendations[recommendationKey] , recommendationKey
            );
            if(["unSolvedPySkills", "solvedPySkills"].includes(recommendationKey)){
              let uniqueProblems = {};
              recommendedData.forEach(data=>{
                if(uniqueProblems[data.actualProblem]){
                  uniqueProblems[data.actualProblem].push(`${data.feature} ${ data.featureType}`);
                }else{
                  uniqueProblems[data.actualProblem] = [`${data.feature} ${ data.featureType}`];
                  uniqueProblems[data.actualProblem].data = {...data};
                }
              })
            console.log('uniqueProblems',uniqueProblems)
            recommendedData=Object.keys(uniqueProblems).map(key=>{
              return {
                ...uniqueProblems[key].data,
                subHeading : `Complete this activity to use the ${uniqueProblems[key].join(', ')}`
              }
            })
            }

            return recommendedData.length>0 ? (
              <RecommendationListCard
                key={recommendationKey}
                dummyData={ recommendedData }
                RecomType={
                  recommendationKey === "youtube" ? "youtube" : "python"
                }
                title={userRecommendations[recommendationKey].title}
              />
            ) : 
            ''
          }
          )}
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
  withStyles(styles),
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
