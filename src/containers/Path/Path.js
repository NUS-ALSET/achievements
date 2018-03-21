/**
 * @file Path container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 17.03.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import ProblemsTable from "../../components/tables/ProblemsTable";

import { firebaseConnect } from "react-redux-firebase";

import withRouter from "react-router-dom/withRouter";
import Breadcrumbs from "../../components/Breadcrumbs";
import { pathProblemsSelector } from "./selectors";

class Path extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.object
  };

  render() {
    const { dispatch, match, pathProblem } = this.props;

    let pathName;

    if (match.params.pathId[0] !== "-") {
      pathName = "Default";
    }

    pathName = pathName || (pathProblem.path && pathProblem.path.name) || "";

    return (
      <Fragment>
        <Breadcrumbs
          paths={[
            {
              label: "Paths",
              link: "/paths"
            },
            {
              label: pathName
            }
          ]}
        />
        <ProblemsTable
          dispatch={dispatch}
          pathOwnerId={pathProblem.owner}
          problems={pathProblem.problems || []}
          selectedPathId={(pathProblem.path && pathProblem.path.id) || ""}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  pathProblem: pathProblemsSelector(state, ownProps)
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const uid = state.firebase.auth.uid;
    const pathId = ownProps.match.params.pathId;

    if (!uid) {
      return false;
    }

    return [`/paths/${pathId}`, "/problems"];
  }),
  connect(mapStateToProps)
)(Path);
