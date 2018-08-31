// HomeV3 is combined into HomeV2 Aug 30 2018. This folder is archived.

import React, { Fragment } from "react";
import RecommendationListCard from "./RecommendationListCard";

import { compose } from "redux";
import { connect } from "react-redux";

import { firebaseConnect, isLoaded } from "react-redux-firebase";
import withRouter from "react-router-dom/withRouter";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchPublicPathActivies } from '../Activity/actions'


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

class HomeV3 extends React.PureComponent {
  constructor(){
    super();
    this.state={
      isActivitiesFetched : false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isActivitiesFetched
      && isLoaded(nextProps.publicPaths)
      && isLoaded(nextProps.completedActivities)
    ) {
      this.setState({ isActivitiesFetched : true });
      this.props.fetchPublicPathActivies();
    }
  }

  render() {
    const {
      publicActivitiesFetched,
      classes,
      unsolvedPublicActivities
    } = this.props;

    const fromUnsolved = unsolvedPublicActivities.map(a => (
      {actualProblem: a.key,
        ...a.value
      })
    );

    const unsolovedJupyterInlineActivities = fromUnsolved.filter(a =>
      a.type==='jupyterInline'
    );

    const unsolovedYouTubeActivities = fromUnsolved.filter(a =>
      a.type==='youtube'
    );

    // const unsolovedTextActivities = fromUnsolved.filter(a =>
      // a.type==='text'
    // );

    // const unsolovedCodeCombatActivities = fromUnsolved.filter(a =>
      // a.type==='codeCombat'
    // );

    if (!publicActivitiesFetched) {
      return (
        <div className={classes.loader}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      );
    }

    return (
      <Fragment>
        {
          unsolovedJupyterInlineActivities.length>0 &&
            <RecommendationListCard
              recomType="jupyterInline"
              logoText="</>"
              title="Jupyter Notebook Activities"
              subtitle="Recommended for you"
              recommendationList={unsolovedJupyterInlineActivities}
          />
        }
        {
          unsolovedYouTubeActivities.length>0 &&
            <RecommendationListCard
              recomType="youtube"
              logoText="Y"
              title="YouTube Video Activities"
              subtitle="Recommended for you"
              recommendationList={unsolovedYouTubeActivities}
          />
        }
      </Fragment>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  uid: state.firebase.auth.uid,
  completedActivities : state.firebase.ordered.completedActivities,
  publicPaths : state.firebase.ordered.publicPaths,
  unsolvedPublicActivities : state.problem.unsolvedPublicActivities || [],
  publicActivitiesFetched : state.problem.publicActivitiesFetched
});

const mapDispatchToProps = {
  fetchPublicPathActivies : fetchPublicPathActivies
};

export default compose(
  withStyles(styles),
  withRouter,
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return false;
    }
    return [
      `/completedActivities/${uid}`,
      {
        path: "/paths",
        queryParams: ["orderByChild=isPublic", `equalTo=${true}`],
        storeAs : 'publicPaths'
      },
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomeV3);
