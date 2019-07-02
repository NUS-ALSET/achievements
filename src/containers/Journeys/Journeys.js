import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Toolbar from "@material-ui/core/Toolbar";

import Breadcrumbs from "../../components/Breadcrumbs";
import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";
import JourneyForm from "../../components/forms/JourneyForm";
import {
  journeyShowDialog,
  journeyUpsertRequest,
  journeyDeleteRequest,
  journeyDeleteConfirmationRequest,
  journeyDialogClose,
  journeyAddActivitiesRequest,
  journeysOpen,
  journeyPathActivitiesFetchRequest,
  journeyActivitiesFetchRequest,
  journeyDeleteActivityRequest,
  journeyMoveActivityRequest,
  journeyDataUpdate,
  journeyChangesCancel
} from "./actions";
import { AddJourneyDialog } from "../../components/dialogs/AddJourneyDialog";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import { AddJourneyActivitiesDialog } from "../../components/dialogs/AddJourneyActivitiesDialog";
import { selectJourneys } from "./selectors";

class Journeys extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    ),
    changes: PropTypes.object,
    completedActivities: PropTypes.object,
    isInitializing: PropTypes.bool,
    journeyActivities: PropTypes.any,
    journeyActivitiesFetchRequest: PropTypes.func,
    journeys: PropTypes.any,
    journeyAddActivitiesRequest: PropTypes.func,
    journeyAddDialogToggle: PropTypes.func,
    journeyChangesCancel: PropTypes.func,
    journeyDataUpdate: PropTypes.func,
    journeyDeleteActivityRequest: PropTypes.func,
    journeyDeleteRequest: PropTypes.func,
    journeyDialogClose: PropTypes.func,
    journeyDeleteConfirmationRequest: PropTypes.func,
    journeyMoveActivityRequest: PropTypes.func,
    journeyPathActivitiesFetchRequest: PropTypes.func,
    journeysOpen: PropTypes.func,
    journeyUpsertRequest: PropTypes.func,
    loadingJourneys: PropTypes.bool,
    paths: PropTypes.shape({
      myPaths: PropTypes.object,
      publicPaths: PropTypes.object
    }),
    ui: PropTypes.object
  };

  componentDidMount() {
    this.props.journeysOpen();
  }

  onAddJourneyClick = () => this.props.journeyAddDialogToggle("ADD_JOURNEY");
  onCloseDialog = () => this.props.journeyAddDialogToggle(false);
  onDeleteConfirm = () =>
    this.props.journeyDeleteRequest(this.props.ui.dialog.id);

  render() {
    const {
      activities,
      changes,
      completedActivities,
      isInitializing,
      journeyActivities,
      journeyActivitiesFetchRequest,
      journeys,
      journeyAddActivitiesRequest,
      journeyAddDialogToggle,
      journeyChangesCancel,
      journeyDataUpdate,
      journeyDeleteActivityRequest,
      journeyDeleteConfirmationRequest,
      journeyDialogClose,
      journeyMoveActivityRequest,
      journeyUpsertRequest,
      journeyPathActivitiesFetchRequest,
      loadingJourneys,
      paths,
      ui
    } = this.props;

    if (isInitializing) {
      return <LinearProgress />;
    }

    return (
      <React.Fragment>
        <Breadcrumbs paths={[{ label: "Journeys" }]} />
        <Toolbar>
          <Button
            color="primary"
            onClick={this.onAddJourneyClick}
            variant="contained"
          >
            Add new journey
          </Button>
        </Toolbar>
        <Grid container spacing={8}>
          {loadingJourneys ? (
            <LinearProgress />
          ) : (
            Object.values(journeys).map(journey => (
              <Grid item key={journey.id} xs={12}>
                <JourneyForm
                  activities={journeyActivities[journey.id]}
                  changed={!!changes[journey.id]}
                  completed={completedActivities}
                  journey={journey}
                  key={journey.id}
                  onAddActivityClick={journeyAddDialogToggle}
                  onCancelClick={journeyChangesCancel}
                  onDataUpdate={journeyDataUpdate}
                  onDeleteActivityClick={journeyDeleteActivityRequest}
                  onExpand={journeyActivitiesFetchRequest}
                  onMoveActivityClick={journeyMoveActivityRequest}
                  onRemoveClick={journeyDeleteConfirmationRequest}
                  onSaveClick={journeyUpsertRequest}
                />
              </Grid>
            ))
          )}
        </Grid>
        <AddJourneyDialog
          onClose={this.onCloseDialog}
          onCommit={journeyUpsertRequest}
          open={ui.dialog.type === "ADD_JOURNEY"}
        />
        <AddJourneyActivitiesDialog
          journeyId={ui.dialog.data}
          onClose={this.onCloseDialog}
          onCommit={journeyAddActivitiesRequest}
          onPathSelect={journeyPathActivitiesFetchRequest}
          open={ui.dialog.type === "ADD_JOURNEY_ACTIVITIES"}
          pathActivities={activities}
          paths={paths}
        />
        <DeleteConfirmationDialog
          message="This will remove the journey"
          onClose={journeyDialogClose}
          onCommit={this.onDeleteConfirm}
          open={ui.dialog.type === "DELETE_JOURNEY"}
        />
      </React.Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  activities: state.journeys.activities,
  changes: state.journeys.changes,
  completedActivities: state.firebase.data.completedActivities,
  journeys: selectJourneys(state),
  journeyActivities: state.journeys.journeyActivities,
  ui: state.journeys.ui,
  paths: state.journeys.paths,
  isInitializing: state.firebase.isInitializing,
  loadingJourneys:
    state.firebase.requesting && state.firebase.requesting.journeys
});
const mapDispatchToProps = {
  journeysOpen,
  journeyActivitiesFetchRequest,
  journeyAddDialogToggle: journeyShowDialog,
  journeyAddActivitiesRequest,
  journeyChangesCancel,
  journeyDataUpdate,
  journeyDeleteRequest,
  journeyDeleteConfirmationRequest,
  journeyDeleteActivityRequest,
  journeyDialogClose,
  journeyMoveActivityRequest,
  journeyPathActivitiesFetchRequest,
  journeyUpsertRequest
};

export default compose(
  firebaseConnect((ownProps, store) => {
    const auth = store.getState().firebase.auth;
    if (!(auth && auth.uid)) {
      return [];
    }
    return [
      {
        path: "/journeys",
        queryParams: ["orderByChild=owner", `equalTo=${auth.uid}`]
      },
      {
        path: `/completedActivities/${auth.uid}`,
        storeAs: "completedActivities"
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Journeys);
