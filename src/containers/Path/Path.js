/**
 * @file Path container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 17.03.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";

import ProblemsTable from "../../components/tables/ProblemsTable";

import { firebaseConnect } from "react-redux-firebase";

import withRouter from "react-router-dom/withRouter";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  pathStatusSelector,
  pathProblemsSelector,
  PATH_STATUS_JOINED,
  PATH_STATUS_OWNER,
  PATH_STATUS_NOT_JOINED
} from "./selectors";
import { pathToggleJoinStatusRequest } from "./actions";
import { pathProblemDialogShow } from "../Paths/actions";
import ProblemDialog from "../../components/dialogs/ProblemDialog";

class Path extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblems: PropTypes.object,
    pathStatus: PropTypes.string,
    ui: PropTypes.any,
    uid: PropTypes.string
  };

  changeJoinStatus = () =>
    this.props.dispatch(
      pathToggleJoinStatusRequest(
        this.props.uid,
        this.props.pathProblems.path.id,
        this.props.pathStatus === PATH_STATUS_NOT_JOINED
      )
    );

  onAddProblemClick = () => this.props.dispatch(pathProblemDialogShow());

  render() {
    const { dispatch, match, pathProblems, pathStatus, ui } = this.props;

    let pathName;

    if (match.params.pathId[0] !== "-") {
      pathName = "Default";
    }

    pathName = pathName || (pathProblems.path && pathProblems.path.name) || "";

    return (
      <Fragment>
        <Breadcrumbs
          action={
            pathStatus === PATH_STATUS_OWNER
              ? null
              : {
                  label: pathStatus === PATH_STATUS_JOINED ? "Leave" : "Join",
                  handler: this.changeJoinStatus.bind(this)
                }
          }
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
        {pathStatus === PATH_STATUS_OWNER && (
          <Toolbar>
            <Button
              color="primary"
              onClick={this.onAddProblemClick}
              variant="raised"
            >
              Add Problem
            </Button>
          </Toolbar>
        )}
        <ProblemsTable
          dispatch={dispatch}
          pathOwnerId={pathProblems.owner}
          problems={pathProblems.problems || []}
          selectedPathId={(pathProblems.path && pathProblems.path.id) || ""}
        />
        <ProblemDialog
          dispatch={dispatch}
          open={ui.dialog.type === "ProblemChange"}
          pathId={pathProblems.path && pathProblems.path.id}
          problem={ui.dialog.value}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  pathProblems: pathProblemsSelector(state, ownProps),
  pathStatus: pathStatusSelector(state, ownProps),
  ui: state.paths.ui,
  uid: state.firebase.auth.uid
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

    return [
      `/paths/${pathId}`,
      "/problems",
      `/studentJoinedPaths/${uid}/${pathId}`
    ];
  }),
  connect(mapStateToProps)
)(Path);
