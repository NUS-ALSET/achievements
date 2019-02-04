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

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";

import Toolbar from "@material-ui/core/Toolbar";
import LinearProgress from "@material-ui/core/LinearProgress";

import ActivitiesTable from "../../components/tables/ActivitiesTable";

import { firebaseConnect } from "react-redux-firebase";

import withRouter from "react-router-dom/withRouter";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  pathStatusSelector,
  pathActivitiesSelector,
  PATH_STATUS_JOINED,
  PATH_STATUS_OWNER,
  PATH_STATUS_NOT_JOINED,
  codeCombatProfileSelector,
  PATH_STATUS_COLLABORATOR
} from "./selectors";
import {
  pathAddCollaboratorRequest,
  closeActivityDialog,
  pathMoreProblemsRequest,
  pathOpen,
  pathOpenSolutionDialog,
  pathRefreshSolutionsRequest,
  pathRemoveCollaboratorRequest,
  pathShowCollaboratorsDialog,
  pathToggleJoinStatusRequest,
  fetchGithubFiles,
  pathActivityCodeCombatOpen,
  pathOpenJestSolutionDialog
} from "./actions";
import {
  pathActivityChangeRequest,
  pathActivityDeleteRequest,
  pathActivityDialogShow,
  pathActivityMoveRequest
} from "../Paths/actions";
import AddActivityDialog from "../../components/dialogs/AddActivityDialog";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import AddTextSolutionDialog from "../../components/dialogs/AddTextSolutionDialog";
import AddJestSolutionDialog from "../../components/dialogs/AddJestSolutionDialog";
import AddGameSolutionDialog from "../../components/dialogs/AddGameSolutionDialog";
import AddGameTournamentSolutionDialog from "../../components/dialogs/AddGameTournamentSolutionDialog";
import { ACTIVITY_TYPES } from "../../services/paths";
import { notificationShow } from "../Root/actions";
import { problemSolutionSubmitRequest } from "../Activity/actions";
import FetchCodeCombatDialog from "../../components/dialogs/FetchCodeCombatDialog";
import { externalProfileUpdateRequest } from "../Account/actions";
import { pathActivities } from "../../types/index";
import ControlAssistantsDialog from "../../components/dialogs/ControlAssistantsDialog";
import { assignmentAssistantKeyChange } from "../Assignments/actions";
import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";
import { Typography } from "@material-ui/core";
import RequestMorePathContentDialog from "../../components/dialogs/RequestMorePathContentDialog";
import FetchCodeCombatLevelDialog from "../../components/dialogs/FetchCodeCombatLevelDialog";
import AddProfileDialog from "../../components/dialogs/AddProfileDialog";
import AddCreatorSolutionDialog from "../../components/dialogs/AddCreatorSolutionDialog";

const styles = theme => ({
  toolbarButton: {
    marginLeft: theme.spacing.unit
  }
});

export class Path extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    codeCombatProfile: PropTypes.any,
    match: PropTypes.object,
    onAddAssistant: PropTypes.func,
    onAssistantKeyChange: PropTypes.func,
    onCloseDialog: PropTypes.func,
    onNotification: PropTypes.func,
    onOpen: PropTypes.func,
    onOpenSolution: PropTypes.func,
    onActivityChangeRequest: PropTypes.func,
    onActivityCodeCombatOpen: PropTypes.func,
    onActivityDeleteRequest: PropTypes.func,
    onActivityDialogShow: PropTypes.func,
    onActivityMoveRequest: PropTypes.func,
    onActivitySolutionSubmit: PropTypes.func,
    onProfileUpdate: PropTypes.func,
    onPushPath: PropTypes.func,
    onRefreshSolutions: PropTypes.func,
    onRemoveAssistant: PropTypes.func,
    onRequestMoreProblems: PropTypes.func,
    onShowCollaboratorsClick: PropTypes.func,
    onToggleJoinStatus: PropTypes.func,
    fetchGithubFiles: PropTypes.func,
    pathActivities: pathActivities,
    pathStatus: PropTypes.string,
    pendingActivityId: PropTypes.string,
    pendingProfileUpdate: PropTypes.bool,
    ui: PropTypes.any,
    uid: PropTypes.string,
    openJestActivity: PropTypes.func
  };

  state = {
    selectedActivityId: "",
    botsQuantity: 0,
    requestMoreDialogShow: false
  };

  componentDidMount() {
    this.props.onOpen(this.props.match.params.pathId);
  }

  onMoveActivity = (problem, direction) => {
    const { pathActivities, onActivityMoveRequest } = this.props;

    onActivityMoveRequest(pathActivities.path.id, problem.id, direction);
  };

  onOpenActivity = activity => {
    const {
      codeCombatProfile,
      onOpenSolution,
      onActivityCodeCombatOpen,
      onPushPath,
      pathActivities,
      openJestActivity
    } = this.props;
    this.setState(() => ({
      botsQuantity: activity.unitsPerSide
    }));
    switch (activity.type) {
      case ACTIVITY_TYPES.profile.id:
      case ACTIVITY_TYPES.codeCombat.id:
      case ACTIVITY_TYPES.codeCombatNumber.id:
      case ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id:
        onActivityCodeCombatOpen(
          pathActivities.path.id,
          activity.id,
          codeCombatProfile && codeCombatProfile.id,
          activity
        );
        break;
      case ACTIVITY_TYPES.jupyterInline.id:
      case ACTIVITY_TYPES.jupyter.id:
      case ACTIVITY_TYPES.youtube.id:
        onPushPath(
          `/paths/${pathActivities.path.id}/activities/${activity.id}`
        );
        break;
      case ACTIVITY_TYPES.jest.id:
        if (activity.version >= 1) {
          openJestActivity(pathActivities.path.id, activity);
        } else {
          onOpenSolution(pathActivities.path.id, activity);
        }
        break;
      default:
        onOpenSolution(pathActivities.path.id, activity);
    }
  };

  requestMoreDialogHide = () => this.setState({ requestMoreDialogShow: false });
  requestMoreDialogShow = () => this.setState({ requestMoreDialogShow: true });

  requestMoreProblems = () =>
    this.props.onRequestMoreProblems(
      this.props.uid,
      this.props.pathActivities.path.id,
      this.props.pathActivities.activities.length
    );

  refreshSolutions = () =>
    this.props.onRefreshSolutions(this.props.pathActivities.path.id);

  changeJoinStatus = () =>
    this.props.onToggleJoinStatus(
      this.props.uid,
      this.props.pathActivities.path.id,
      this.props.pathStatus === PATH_STATUS_NOT_JOINED
    );

  onAddActivityClick = () => this.props.onActivityDialogShow();
  onTextSolutionSubmit = (solution, activityId) => {
    const {
      onCloseDialog,
      onActivitySolutionSubmit,
      pathActivities
    } = this.props;
    const activity = pathActivities.activities.find(
      activity => activity.id === activityId
    );
    onActivitySolutionSubmit(
      pathActivities.path.id,
      { ...activity, problemId: activity.id },
      solution
    );
    onCloseDialog();
  };
  onProfileUpdate = profile => {
    const {
      onCloseDialog,
      onActivitySolutionSubmit,
      onProfileUpdate,
      ui
    } = this.props;

    onProfileUpdate(profile, "CodeCombat");
    onActivitySolutionSubmit(
      ui.dialog.value.path,
      { ...ui.dialog.value, problemId: ui.dialog.value.id },
      profile
    );
    onCloseDialog();
  };

  onActivityDeleteRequest = (activityId, pathId) => {
    this.setState({
      selectedActivityId: activityId,
      selectedPathId: pathId
    });
  };

  onActivityChangeRequest = (id, data) => {
    const { pathActivities = {}, onActivityChangeRequest } = this.props;
    const activities = pathActivities.activities || [];
    let additionalData = {};
    if (!data.id) {
      let maxOrderIndex = -Infinity;
      activities.forEach(activity => {
        maxOrderIndex =
          activity.orderIndex > maxOrderIndex
            ? activity.orderIndex
            : maxOrderIndex;
      });
      maxOrderIndex = maxOrderIndex === -Infinity ? 1 : maxOrderIndex + 1;
      additionalData = {
        orderIndex: maxOrderIndex
      };
    }
    onActivityChangeRequest(id, {
      ...data,
      ...additionalData
    });
  };

  render() {
    const {
      classes,
      codeCombatProfile,
      match,
      onAddAssistant,
      onAssistantKeyChange,
      onCloseDialog,
      onActivityDeleteRequest,
      onActivityDialogShow,
      onProfileUpdate,
      onShowCollaboratorsClick,
      onRemoveAssistant,
      pathActivities,
      pathStatus,
      pendingActivityId,
      pendingProfileUpdate,
      ui,
      uid,
      fetchGithubFiles
    } = this.props;

    if (!(pathActivities && pathActivities.path)) {
      if (pathActivities.path === null) {
        return <p>Path does not exist!</p>
      }
      return <LinearProgress />;
    }

    const allFinished =
      (pathActivities.activities || []).filter(problem => problem.solved)
        .length === (pathActivities.activities || []).length;
    const hasActivities =
      ui.dialog.pathsInfo &&
      ui.dialog.pathsInfo.filter(
        pathInfo => pathInfo.activities && pathInfo.activities.length
      ).length;
    // Flag that used for creator and educator activities to force
    // AddActivityDialog to create new activity of required type instead of
    // editing existing activity
    // FIXIT: move it into selectors
    const isCreatorActivity =
      ui.dialog.value &&
      ui.dialog.value.owner !== uid &&
      ui.dialog.value.type === ACTIVITY_TYPES.creator.id;

    let pathName, pathDesc;

    if (match.params.pathId[0] !== "-") {
      pathName = "Default";
    }

    pathName =
      pathName || (pathActivities.path && pathActivities.path.name) || "";
    pathDesc =
      (pathActivities.path && pathActivities.path.description) ||
      "None Provided";

    return (
      <Fragment>
        <Breadcrumbs
          action={
            (![PATH_STATUS_OWNER, PATH_STATUS_COLLABORATOR].includes(
              pathStatus
            ) && [
              allFinished && {
                label: "Request more",
                handler: this.requestMoreDialogShow.bind(this)
              },
              // disable Refresh button.
              // !allFinished && {
              // label: "Refresh",
              // handler: this.refreshSolutions.bind(this)
              // },
              uid && {
                label: pathStatus === PATH_STATUS_JOINED ? "Leave" : "Join",
                handler: this.changeJoinStatus.bind(this)
              }
            ]) ||
            []
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
        <Typography
          gutterBottom
          style={{
            marginLeft: 30
          }}
        >
          Path Description: {pathDesc}
        </Typography>
        {[PATH_STATUS_OWNER, PATH_STATUS_COLLABORATOR].includes(pathStatus) && (
          <Toolbar>
            <Button
              color="primary"
              onClick={this.onAddActivityClick}
              variant="contained"
            >
              Add Activity
            </Button>
            {pathStatus === PATH_STATUS_OWNER && (
              <Button
                className={classes.toolbarButton}
                onClick={() => onShowCollaboratorsClick(pathActivities.path.id)}
                variant="contained"
              >
                Collaborators
              </Button>
            )}
          </Toolbar>
        )}
        <AddTextSolutionDialog
          onClose={onCloseDialog}
          onCommit={this.onTextSolutionSubmit}
          open={ui.dialog.type === `${ACTIVITY_TYPES.text.id}Solution`}
          solution={ui.dialog.solution}
          taskId={ui.dialog.value && ui.dialog.value.id}
        />
        <AddJestSolutionDialog
          onClose={onCloseDialog}
          onCommit={this.onTextSolutionSubmit}
          open={ui.dialog.type === `${ACTIVITY_TYPES.jest.id}Solution`}
          problem={ui.dialog.value}
          taskId={ui.dialog.value && ui.dialog.value.id}
        />
        <AddGameSolutionDialog
          botsQuantity={this.state.botsQuantity}
          onClose={onCloseDialog}
          onCommit={this.onTextSolutionSubmit}
          open={ui.dialog.type === `${ACTIVITY_TYPES.game.id}Solution`}
          problem={ui.dialog.value}
          taskId={ui.dialog.value && ui.dialog.value.id}
        />
        <AddGameTournamentSolutionDialog
          onClose={onCloseDialog}
          onCommit={this.onTextSolutionSubmit}
          open={
            ui.dialog.type === `${ACTIVITY_TYPES.gameTournament.id}Solution`
          }
          problem={ui.dialog.value}
          taskId={ui.dialog.value && ui.dialog.value.id}
        />
        <AddCreatorSolutionDialog
          onClose={onCloseDialog}
          onCommit={this.onTextSolutionSubmit}
          open={
            !!(
              ["creatorSolution", "educatorSolution"].includes(
                ui.dialog.type
              ) &&
              ui.dialog.pathsInfo &&
              hasActivities
            )
          }
          pathsInfo={ui.dialog.pathsInfo || []}
          solution={ui.dialog.solution}
          taskId={ui.dialog.value && ui.dialog.value.id}
        />
        <FetchCodeCombatDialog
          currentUserId={uid}
          defaultValue={(codeCombatProfile && codeCombatProfile.id) || ""}
          externalProfile={{
            url: "https://codecombat.com",
            id: "CodeCombat",
            name: "CodeCombat",
            description: "learn programming by playing games"
          }}
          onClose={onCloseDialog}
          onCommit={this.onProfileUpdate}
          open={ui.dialog.type === `${ACTIVITY_TYPES.profile.id}Solution`}
        />
        <ActivitiesTable
          activities={pathActivities.activities || []}
          codeCombatProfile={codeCombatProfile}
          currentUserId={uid || "Anonymous"}
          onDeleteActivity={this.onActivityDeleteRequest}
          onEditActivity={onActivityDialogShow}
          onMoveActivity={this.onMoveActivity}
          onOpenActivity={this.onOpenActivity}
          pathStatus={pathStatus}
          pendingActivityId={pendingActivityId}
          selectedPathId={(pathActivities.path && pathActivities.path.id) || ""}
        />
        <AddProfileDialog
          externalProfile={{
            url: "https://codecombat.com",
            name: "CodeCombat",
            id: "CodeCombat"
          }}
          inProgress={pendingProfileUpdate}
          keepOnCommit={true}
          onClose={onCloseDialog}
          onCommit={profile => {
            onProfileUpdate(profile, "CodeCombat");
          }}
          open={ui.dialog && ui.dialog.type === "Profile"}
          uid={uid}
        />
        <AddActivityDialog
          activity={!isCreatorActivity && ui.dialog.value}
          fetchGithubFiles={fetchGithubFiles}
          fetchGithubFilesStatus={ui.fetchGithubFilesStatus}
          onClose={onCloseDialog}
          onCommit={this.onActivityChangeRequest}
          open={
            ui.dialog.type === "ProblemChange" ||
            !!(
              ["creatorSolution", "educatorSolution"].includes(
                ui.dialog.type
              ) &&
              ui.dialog.pathsInfo &&
              !hasActivities
            )
          }
          pathId={
            ["creatorSolution", "educatorSolution"].includes(ui.dialog.type)
              ? ""
              : (pathActivities.path && pathActivities.path.id) || ""
          }
          pathsInfo={ui.dialog.pathsInfo || []}
          restrictedType={isCreatorActivity && ui.dialog.value.targetType}
          uid={uid || "Anonymous"}
        />
        <DeleteConfirmationDialog
          message="This will remove activity"
          onClose={() => this.setState({ selectedActivityId: "" })}
          onCommit={() => {
            onActivityDeleteRequest(
              this.state.selectedActivityId,
              this.state.selectedPathId
            );
            this.setState({ selectedActivityId: "" });
          }}
          open={!!this.state.selectedActivityId}
        />
        <ControlAssistantsDialog
          assistants={ui.dialog.assistants}
          isOwner={pathStatus === PATH_STATUS_OWNER}
          newAssistant={ui.dialog.newAssistant}
          onAddAssistant={onAddAssistant}
          onAssistantKeyChange={onAssistantKeyChange}
          onClose={onCloseDialog}
          onRemoveAssistant={onRemoveAssistant}
          open={ui.dialog.type === "CollaboratorsControl"}
          target={pathActivities.path.id}
        />
        <FetchCodeCombatLevelDialog
          activity={pathActivities.activities.find(
            activity => activity.id === pendingActivityId
          )}
          codeCombatId={codeCombatProfile && codeCombatProfile.id}
          onClose={onCloseDialog}
          open={ui.dialog.type === "FetchCodeCombatLevel"}
        />
        <RequestMorePathContentDialog
          onClose={this.requestMoreDialogHide}
          onConfirm={this.requestMoreProblems}
          open={this.state.requestMoreDialogShow}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  codeCombatProfile: codeCombatProfileSelector(state),
  pathActivities: pathActivitiesSelector(state, ownProps),
  pathStatus: pathStatusSelector(state, ownProps),
  pendingActivityId: state.path.ui.pendingActivityId,
  pendingProfileUpdate: state.path.ui.pendingProfileUpdate,
  ui: state.path.ui,
  uid: state.firebase.auth.uid
});

const mapDispatchToProps = {
  onAddAssistant: pathAddCollaboratorRequest,
  onAssistantKeyChange: assignmentAssistantKeyChange,
  onCloseDialog: closeActivityDialog,
  onNotification: notificationShow,
  onOpen: pathOpen,
  onShowCollaboratorsClick: pathShowCollaboratorsDialog,
  onProfileUpdate: externalProfileUpdateRequest,
  onOpenSolution: pathOpenSolutionDialog,
  onActivityChangeRequest: pathActivityChangeRequest,
  onActivityCodeCombatOpen: pathActivityCodeCombatOpen,
  onActivityDeleteRequest: pathActivityDeleteRequest,
  onActivityDialogShow: pathActivityDialogShow,
  onActivityMoveRequest: pathActivityMoveRequest,
  onActivitySolutionSubmit: problemSolutionSubmitRequest,
  onPushPath: push,
  onRefreshSolutions: pathRefreshSolutionsRequest,
  onRemoveAssistant: pathRemoveCollaboratorRequest,
  onRequestMoreProblems: pathMoreProblemsRequest,
  onToggleJoinStatus: pathToggleJoinStatusRequest,
  fetchGithubFiles: fetchGithubFiles,
  openJestActivity: pathOpenJestSolutionDialog
};

export default compose(
  withStyles(styles),
  withRouter,
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const uid = state.firebase.auth.uid;
    const pathId = ownProps.match.params.pathId;

    if (!uid) {
      return [
        `/paths/${pathId}`,
        `/activities#orderByChild=path&equalTo=${pathId}`
      ];
    }

    return [
      `/activities#orderByChild=path&equalTo=${pathId}`,
      `/completedActivities/${uid}/${pathId}`,
      `/paths/${pathId}`,
      `/pathAssistants/${pathId}`,
      `/activities#orderByChild=path&equalTo=${pathId}`,
      `/studentJoinedPaths/${uid}/${pathId}`,
      `userAchievements/${uid}/CodeCombat`
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Path);
