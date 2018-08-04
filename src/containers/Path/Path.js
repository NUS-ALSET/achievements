/**
 * @file Path container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 17.03.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import { APP_SETTING } from "../../achievementsApp/config";

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";

import ActivitiesTable from "../../components/tables/ActivitiesTable";

import { firebaseConnect } from "react-redux-firebase";

import withRouter from "react-router-dom/withRouter";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  pathStatusSelector,
  pathActivitiesSelector,
  PATH_STATUS_JOINED,
  PATH_STATUS_OWNER,
  PATH_STATUS_NOT_JOINED
} from "./selectors";
import {
  pathCloseDialog,
  pathMoreProblemsRequest,
  pathOpen,
  pathOpenSolutionDialog,
  pathToggleJoinStatusRequest
} from "./actions";
import {
  pathProblemChangeRequest,
  pathProblemDialogShow,
  pathActivityMoveRequest
} from "../Paths/actions";
import ActivityDialog from "../../components/dialogs/ActivityDialog";

import AddIcon from "@material-ui/icons/Add";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import AddTextSolutionDialog from "../../components/dialogs/AddTextSolutionDialog";
import AddJestSolutionDialog from "../../components/dialogs/AddJestSolutionDialog";
import { PROBLEMS_TYPES } from "../../services/paths";
import { notificationShow } from "../Root/actions";
import { problemSolutionSubmitRequest } from "../Activity/actions";
import AddProfileDialog from "../../components/dialogs/AddProfileDialog";
import { externalProfileUpdateRequest } from "../Account/actions";
import { pathActivities } from "../../types";

export class Path extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    onCloseDialog: PropTypes.func.isRequired,
    onNotification: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    onOpenSolution: PropTypes.func.isRequired,
    onProblemChangeRequest: PropTypes.func.isRequired,
    onProblemDialogShow: PropTypes.func.isRequired,
    onProblemMoveRequest: PropTypes.func.isRequired,
    onProblemSolutionSubmit: PropTypes.func.isRequired,
    onProfileUpdate: PropTypes.func.isRequired,
    onPushPath: PropTypes.func.isRequired,
    onRequestMoreProblems: PropTypes.func.isRequired,
    onToggleJoinStatus: PropTypes.func.isRequired,
    pathActivities: pathActivities,
    pathStatus: PropTypes.string,
    ui: PropTypes.any,
    uid: PropTypes.string
  };

  componentDidMount() {
    this.props.onOpen(this.props.match.params.pathId);
  }

  onMoveProblem = (problem, direction) => {
    const { pathActivities, onProblemMoveRequest } = this.props;

    onProblemMoveRequest(pathActivities.path.id, problem.id, direction);
  };

  onOpenProblem = problem => {
    const {
      onOpenSolution,
      onProblemSolutionSubmit,
      onPushPath,
      pathActivities
    } = this.props;
    switch (problem.type) {
      case PROBLEMS_TYPES.codeCombat.id:
      case PROBLEMS_TYPES.codeCombatNumber.id:
        onProblemSolutionSubmit(
          pathActivities.path.id,
          { problemId: problem.id, ...problem },
          "Completed"
        );
        break;
      case PROBLEMS_TYPES.jupyterInline.id:
      case PROBLEMS_TYPES.jupyter.id:
      case PROBLEMS_TYPES.youtube.id:
        onPushPath(`/paths/${pathActivities.path.id}/activities/${problem.id}`);
        break;
      default:
        onOpenSolution(pathActivities.path.id, problem);
    }
  };

  requestMoreProblems = () =>
    this.props.onRequestMoreProblems(
      this.props.uid,
      this.props.pathActivities.path.id,
      this.props.pathActivities.activities.length
    );

  refreshSolutions = () => this.props.onNotification("test");

  changeJoinStatus = () =>
    this.props.onToggleJoinStatus(
      this.props.uid,
      this.props.pathActivities.path.id,
      this.props.pathStatus === PATH_STATUS_NOT_JOINED
    );

  onAddActivityClick = () => this.props.onProblemDialogShow();
  onTextSolutionSubmit = (activityId, solution) => {
    const { onCloseDialog, onProblemSolutionSubmit, pathProblems } = this.props;
    const activity = pathProblems.problems.find(
      activity => activity.id === activityId
    );

    onProblemSolutionSubmit(
      pathActivities.path.id,
      { ...activity, problemId: activity.id },
      solution
    );
    onCloseDialog();
  };
  onProfileUpdate = profile =>
    this.props.onProfileUpdate(profile, "CodeCombat");

  render() {
    const {
      match,
      onCloseDialog,
      onProblemChangeRequest,
      onProblemDialogShow,
      pathActivities,
      pathStatus,
      ui,
      uid
    } = this.props;

    const allFinished =
      (pathActivities.activities || []).filter(problem => problem.solved)
        .length === (pathActivities.activities || []).length;
    let pathName;

    if (match.params.pathId[0] !== "-") {
      pathName = "Default";
    }

    pathName =
      pathName || (pathActivities.path && pathActivities.path.name) || "";

    return (
      <Fragment>
        <Breadcrumbs
          action={
            pathStatus !== PATH_STATUS_OWNER && [
              allFinished && {
                label: "Request more",
                handler: this.requestMoreProblems.bind(this)
              },
              !allFinished && {
                label: "Refresh",
                handler: this.refreshSolutions.bind(this)
              },
              {
                label: pathStatus === PATH_STATUS_JOINED ? "Leave" : "Join",
                handler: this.changeJoinStatus.bind(this)
              }
            ]
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
        {pathStatus === PATH_STATUS_OWNER &&
          (!APP_SETTING.isSuggesting ? (
            <Toolbar>
              <Button
                color="primary"
                onClick={this.onAddActivityClick}
                variant="raised"
              >
                Add Activity
              </Button>
              <Button>Collaborators</Button>
            </Toolbar>
          ) : (
            <Button
              aria-label="Add"
              color="primary"
              onClick={this.onAddActivityClick}
              style={{
                position: "fixed",
                bottom: 20,
                right: 20
              }}
              variant="fab"
            >
              <AddIcon />
            </Button>
          ))}
        <AddTextSolutionDialog
          onClose={onCloseDialog}
          onCommit={this.onTextSolutionSubmit}
          open={ui.dialog.type === `${PROBLEMS_TYPES.text.id}Solution`}
          solution={ui.dialog.solution}
          taskId={ui.dialog.value && ui.dialog.value.id}
        />
        <AddJestSolutionDialog
          open={ui.dialog.type === `${PROBLEMS_TYPES.jest.id}Solution`}
          onClose={onCloseDialog}
          problem={ui.dialog.value}
          onCommit={this.onTextSolutionSubmit}
          taskId={ui.dialog.value && ui.dialog.value.id}
          />
        <AddProfileDialog
          externalProfile={{
            url: "https://codecombat.com",
            id: "CodeCombat",
            name: "Code Combat",
            description: "learn to Code JavaScript by Playing a Game"
          }}
          onClose={onCloseDialog}
          onCommit={this.onProfileUpdate}
          open={ui.dialog.type === `${PROBLEMS_TYPES.profile.id}Solution`}
        />
        <ActivitiesTable
          activities={pathActivities.activities || []}
          currentUserId={uid || "Anonymous"}
          onEditProblem={onProblemDialogShow}
          onMoveProblem={this.onMoveProblem}
          onOpenProblem={this.onOpenProblem}
          pathOwnerId={pathActivities.path && pathActivities.path.owner}
          selectedPathId={(pathActivities.path && pathActivities.path.id) || ""}
        />
        <ActivityDialog
          onClose={onCloseDialog}
          onCommit={onProblemChangeRequest}
          open={ui.dialog.type === "ProblemChange"}
          pathId={(pathActivities.path && pathActivities.path.id) || ""}
          problem={ui.dialog.value}
          uid={uid || "Anonymous"}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  pathActivities: pathActivitiesSelector(state, ownProps),
  pathStatus: pathStatusSelector(state, ownProps),
  ui: state.path.ui,
  uid: state.firebase.auth.uid
});

const mapDispatchToProps = {
  onCloseDialog: pathCloseDialog,
  onNotification: notificationShow,
  onOpen: pathOpen,
  onProfileUpdate: externalProfileUpdateRequest,
  onOpenSolution: pathOpenSolutionDialog,
  onProblemChangeRequest: pathProblemChangeRequest,
  onProblemDialogShow: pathProblemDialogShow,
  onProblemMoveRequest: pathActivityMoveRequest,
  onProblemSolutionSubmit: problemSolutionSubmitRequest,
  onPushPath: push,
  onRequestMoreProblems: pathMoreProblemsRequest,
  onToggleJoinStatus: pathToggleJoinStatusRequest
};

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
      {
        path: "/activities",
        queryParams: ["orderByChild=path", `equalTo=${pathId}`]
      },
      `/studentJoinedPaths/${uid}/${pathId}`
    ];
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Path);
