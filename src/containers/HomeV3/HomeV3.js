import React from "react";
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

class HomeV2 extends React.PureComponent {
  constructor(){
    super();
    this.state={
      isActivitiesFetched : false
    }
  }
  componentWillReceiveProps(nextProps){
    if(!this.state.isActivitiesFetched && isLoaded(nextProps.publicPaths) && isLoaded(nextProps.completedActivities)){
      this.setState({ isActivitiesFetched : true });
      this.props.fetchPublicPathActivies();
    }
  }
  render() {
    const { publicActivitiesFetched, classes } = this.props;
    const unsolvedPublicActivities=this.props.unsolvedPublicActivities.map(a=>({ actualProblem : a.key, ...a.value}))
    const unsolovedJupyterInlineActivities = unsolvedPublicActivities.filter(a=>a.type==='jupyterInline');
    const unsolovedYouTubeActivities = unsolvedPublicActivities.filter(a=>a.type==='youtube');
    const unsolovedTextActivities = unsolvedPublicActivities.filter(a=>a.type==='text');
    const unsolovedCodeCombatActivities = unsolvedPublicActivities.filter(a=>a.type==='codeCombat');
    if(!publicActivitiesFetched){
      return <div className={classes.loader}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
    }
    return (
      <div>
        {
          unsolovedJupyterInlineActivities.length>0 &&
            <RecommendationListCard
              recomType="jupyterInline"
              logoText="</>"
              title="Here are Jest activities you might like"
              subtitle="Unsolved Jest Activities"
              footerText="Your next activities for jest learning."
              recommendationList={unsolovedJupyterInlineActivities}
          />
        }
        {
          unsolovedYouTubeActivities.length>0 && 
          <RecommendationListCard
            recomType="youtube"
            logoText="Y"
            title="Here are Video activities you might like"
            subtitle="Unsolved YouTube Activities"
            footerText="Discover more YouTube educational content."
            recommendationList={unsolovedYouTubeActivities}
        />
        }
        {
          unsolovedCodeCombatActivities.length>0 && 
          <RecommendationListCard
            recomType="codeCombat"
            logoText="C"
            title="Here are Code Combat activities you might like"
            subtitle="Unsolved Code Combat Activities"
            footerText="Your next level at Code Combat."
            recommendationList={unsolovedCodeCombatActivities}
        />
        }
        {
          unsolovedTextActivities.length>0 && 
          <RecommendationListCard
            recomType="text"
            logoText="T"
            title="Here are Text activities you might like"
            subtitle="Unsolved Text Activities"
            footerText="Your next text activity."
            recommendationList={unsolovedTextActivities}
        />
        }
        
        {/*
        <RecommendationListCard
          recomType="python"
          recommendationList={DummyReduxState.pythonSmallList}
        /> */}
      </div>
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
)(HomeV2);


