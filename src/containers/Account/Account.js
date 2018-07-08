/**
 * @file Account container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 26.01.18
 */
import { accountService } from "../../services/account";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  displayNameEditToggle,
  displayNameUpdateRequest,
  externalProfileDialogHide,
  externalProfileDialogShow,
  externalProfileRefreshRequest,
  externalProfileRemoveDialogShow,
  externalProfileUpdateRequest
} from "./actions";
import { firebaseConnect } from "react-redux-firebase";
import { notificationShow } from "../Root/actions";
import { sagaInjector } from "../../services/saga";
import AddProfileDialog from "../../components/dialogs/AddProfileDialog";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";

import ExternalProfileCard from "../../components/cards/ExternalProfileCard";
import Grid from "@material-ui/core/Grid";

import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import RemoveExternalProfileDialog from "../../components/dialogs/RemoveProfileDialog";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import sagas from "./sagas";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";

const styles = theme => ({
  card: {
    margin: theme.spacing.unit
  }
});

class Account extends React.PureComponent {
  static propTypes = {
    externalProfileInUpdate: PropTypes.bool,
    achievementsRefreshingInProgress: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    showDialog: PropTypes.bool.isRequired,
    firebase: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object,
    uid: PropTypes.string,
    userName: PropTypes.string,
    externalProfiles: PropTypes.object,
    userAchievements: PropTypes.object,
    displayNameEdit: PropTypes.bool,
    removeRequest: PropTypes.any
  };

  state = {
    newDisplayName: ""
  };

  addExternalProfileRequest = externalProfile => {
    this.props.dispatch(externalProfileDialogShow(externalProfile));
  };
  refreshAchievementsRequest = externalProfile => {
    const { userAchievements, dispatch } = this.props;

    dispatch(
      externalProfileRefreshRequest(
        userAchievements[externalProfile.id].id,
        externalProfile.id
      )
    );
  };
  removeExternalProfileRequest = externalProfile => {
    const { userAchievements, dispatch } = this.props;

    dispatch(
      externalProfileRemoveDialogShow(
        userAchievements[externalProfile.id].id,
        externalProfile.id
      )
    );
    // this.showConfirmation(
    //   `Are you sure you want to remove ${externalProfile.name} profile?`
    // ).then(result => {
    //   if (result) {
    //     accountService.removeExternalProfile(externalProfile, this.props.uid);
    //   }
    //   this.closeConfirmation();
    // });
  };

  toggleDisplayNameEdit = status => {
    if (status) {
      this.setState({
        newDisplayName: this.props.userName
      });
    }
    this.props.dispatch(displayNameEditToggle(status));
  };

  closeExternalProfileDialog = () => {
    this.props.dispatch(externalProfileDialogHide());
  };

  updateDisplayName = () =>
    this.props.dispatch(displayNameUpdateRequest(this.state.newDisplayName));

  catchReturn = event => event.key === "Enter" && this.updateDisplayName();

  changeDisplayName = event =>
    this.setState({ newDisplayName: event.target.value });

  showError = error => this.props.dispatch(notificationShow(error));
  onProfileUpdate = profile => {
    this.props.dispatch(externalProfileUpdateRequest(profile, "CodeCombat"));
  };

  render() {
    const {
      classes,
      userAchievements,
      externalProfiles,
      removeRequest,
      user,
      userName,
      displayNameEdit,
      dispatch,
      achievementsRefreshingInProgress
    } = this.props;

    return (
      <Fragment>
        <Grid container>
          <Grid item xs={3}>
            <Card className={classes.card}>
              <CardMedia
                image={
                  (user && user.photoURL) ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQ" +
                    "AAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                }
                style={{ height: 240 }}
                title={this.props.userName}
              />
              <CardContent>
                {displayNameEdit ? (
                  <Fragment>
                    <TextField
                      autoFocus
                      defaultValue={userName}
                      label="Display Name"
                      onChange={this.changeDisplayName}
                      onKeyPress={this.catchReturn}
                      style={{
                        width: "calc(100% - 48px)"
                      }}
                    />
                    <IconButton>
                      <CheckIcon onClick={() => this.updateDisplayName()} />
                    </IconButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Typography
                      style={{
                        marginTop: 20,
                        display: "inline-block",
                        fontSize: 16,
                        width: "calc(100% - 48px)"
                      }}
                    >
                      {userName}
                    </Typography>
                    <IconButton>
                      <EditIcon
                        onClick={() => this.toggleDisplayNameEdit(true)}
                      />
                    </IconButton>
                  </Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            {Object.keys(externalProfiles).map(externalProfileKey => (
              <Fragment key={externalProfileKey}>
                <ExternalProfileCard
                  addExternalProfileRequest={this.addExternalProfileRequest}
                  classes={classes}
                  externalProfile={externalProfiles[externalProfileKey]}
                  inProgress={achievementsRefreshingInProgress}
                  refreshAchievementsRequest={this.refreshAchievementsRequest}
                  removeExternalProfileRequest={
                    this.removeExternalProfileRequest
                  }
                  userAchievements={
                    (userAchievements || {})[externalProfileKey]
                  }
                />
                <AddProfileDialog
                  externalProfile={externalProfiles[externalProfileKey]}
                  inProgress={this.props.externalProfileInUpdate}
                  onClose={this.closeExternalProfileDialog}
                  onCommit={this.onProfileUpdate}
                  open={this.props.showDialog}
                  uid={this.props.uid}
                />
              </Fragment>
            ))}
          </Grid>
        </Grid>
        <RemoveExternalProfileDialog
          dispatch={dispatch}
          externalProfileId={removeRequest.id}
          externalProfileType={removeRequest.type}
          open={removeRequest.actual}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  userName:
    state.firebase.auth.uid &&
    state.firebase.data &&
    state.firebase.data.users &&
    state.firebase.data.users[
      ownProps.match.params.accountId || state.firebase.auth.uid
    ].displayName,
  uid: state.firebase.auth.uid,
  auth: state.firebase.auth,

  // That should be in firebase
  externalProfiles: accountService.fetchExternalProfiles(),

  userAchievements: (state.firebase.data.userAchievements || {})[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ],
  showDialog: state.account.showExternalProfileDialog,
  removeRequest: {
    actual: state.account.showRemoveExternalProfileDialog,
    id: state.account.removingProfileId,
    type: state.account.removingProfileType
  },
  externalProfileInUpdate: state.account.externalProfileInUpdate,
  achievementsRefreshingInProgress:
    state.account.achievementsRefreshingInProgress,
  displayNameEdit: state.account.displayNameEdit,
  user: (state.firebase.data.users || {})[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ]
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => [
    `/users/${ownProps.match.params.accountId}`,
    `/userAchievements/${ownProps.match.params.accountId}`,
    `/users/${store.getState().firebase.auth.uid}`,
    `/userAchievements/${store.getState().firebase.auth.uid}`
  ]),
  withStyles(styles),
  connect(mapStateToProps)
)(Account);
