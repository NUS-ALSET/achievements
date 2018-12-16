import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";

class Shun extends React.PureComponent {
  render() {
    return (
      <article>
        <header>Hi I am Shun</header>
        <section>Here is some content...</section>
      </article>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  uid: state.firebase.auth.uid,
  completedActivities: state.firebase.ordered.completedActivities,
  publicPaths: state.firebase.ordered.publicPaths,
  unsolvedPublicActivities: state.problem.unsolvedPublicActivities || [],
  publicActivitiesFetched: state.problem.publicActivitiesFetched
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
        path: "/shun",
        storeAs: "shun",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
      }
    ];
  }),
  connect(mapStateToProps)
)(Shun);
