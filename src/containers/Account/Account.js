/**
 * @file Account container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 26.01.18
 */
import { accountService } from "../../services/account";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  accountOpen,
  displayNameEditToggle,
  displayNameUpdateRequest,
  externalProfileDialogHide,
  externalProfileDialogShow,
  externalProfileRefreshRequest,
  externalProfileRemoveDialogHide,
  externalProfileRemoveDialogShow,
  externalProfileRemoveRequest,
  externalProfileUpdateRequest,
  profileUpdateDataRequest
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
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from "@material-ui/core/LinearProgress";

import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import RemoveExternalProfileDialog from "../../components/dialogs/RemoveProfileDialog";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import sagas from "./sagas";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import { getDisplayName, getProfileData } from "./selectors";
import JoinedPathCard from "../../components/cards/JoinedPathCard";

const styles = theme => ({
  card: {
    margin: theme.spacing.unit
  }
});

class Account extends React.PureComponent {
  static propTypes = {
    achievementsRefreshingInProgress: PropTypes.bool,
    auth: PropTypes.object,
    classes: PropTypes.object.isRequired,

    accountOpen: PropTypes.func,
    displayNameEditToggle: PropTypes.func,
    displayNameUpdateRequest: PropTypes.func,
    externalProfileDialogHide: PropTypes.func,
    externalProfileDialogShow: PropTypes.func,
    externalProfileRefreshRequest: PropTypes.func,
    externalProfileRemoveDialogHide: PropTypes.func,
    externalProfileRemoveDialogShow: PropTypes.func,
    externalProfileRemoveRequest: PropTypes.func,
    externalProfileUpdateRequest: PropTypes.func,
    profileUpdateDataRequest: PropTypes.func,

    notificationShow: PropTypes.func,
    displayNameEdit: PropTypes.bool,
    externalProfileInUpdate: PropTypes.bool,
    externalProfiles: PropTypes.object,
    joinedPaths: PropTypes.object,
    match: PropTypes.object,
    profileData: PropTypes.array,
    removeRequest: PropTypes.any,
    showDialog: PropTypes.bool.isRequired,
    user: PropTypes.object,
    uid: PropTypes.string,
    userName: PropTypes.string,
    userAchievements: PropTypes.object
  };

  state = {
    newDisplayName: ""
  };

  componentDidMount() {
    this.props.accountOpen(this.props.match.params.accountId);
  }

  addExternalProfileRequest = externalProfile => {
    this.props.externalProfileDialogShow(externalProfile);
  };
  refreshAchievementsRequest = externalProfile => {
    const { userAchievements, externalProfileRefreshRequest } = this.props;

    externalProfileRefreshRequest(
      userAchievements[externalProfile.id].id,
      externalProfile.id
    );
  };
  removeExternalProfileRequest = externalProfile => {
    const { userAchievements, externalProfileRemoveDialogShow } = this.props;

    externalProfileRemoveDialogShow(
      userAchievements[externalProfile.id].id,
      externalProfile.id
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
    this.props.displayNameEditToggle(status);
  };

  closeExternalProfileDialog = () => {
    this.props.externalProfileDialogHide();
  };

  updateDisplayName = () =>
    this.props.displayNameUpdateRequest(this.state.newDisplayName);

  catchReturn = event => event.key === "Enter" && this.updateDisplayName();

  changeDisplayName = event =>
    this.setState({ newDisplayName: event.target.value });

  showError = error => this.props.notificationShow(error);
  onProfileUpdate = profile => {
    this.props.externalProfileUpdateRequest(profile, "CodeCombat");
  };

  onProfileDataUpdate = (field, value) =>
    this.props.profileUpdateDataRequest(field, value);

  render() {
    const {
      achievementsRefreshingInProgress,
      auth,
      classes,
      displayNameEdit,
      externalProfiles,
      externalProfileRemoveDialogHide,
      externalProfileRemoveRequest,
      joinedPaths,
      match,
      profileData,
      userAchievements,
      removeRequest,
      user,
      userName
    } = this.props;

    // taken from Courses.js, display if not logged in
    if (auth.isEmpty) {
      return <div>Login required to display this page.</div>;
    }

    if (!user) {
      return <LinearProgress />;
    }

    const isOwner = auth.uid === match.params.accountId;
    const displayName = isOwner ||
      (user.showDisplayName || user.showDisplayName === undefined)
        ? userName
        : "Hidden"

    return (
      <Fragment>
        <Grid container>
          <Grid item xs={3}>
            <Card className={classes.card}>
              <CardMedia
                image={user && user.photoURL}
                style={{ height: 240 }}
                title={this.props.userName}
              />
              <CardContent>
                <Typography
                  style={{
                    fontSize: 12
                  }}
                >
                  User ID: {match.params.accountId}
                </Typography>
                {isOwner && displayNameEdit ? (
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
                    <TextField
                      autoFocus
                      defaultValue={displayName}
                      InputProps={{
                        readOnly: true
                      }}
                      label="Display Name"
                      style={{
                        width: "calc(100% - 48px)"
                      }}
                    />
                    {isOwner && (
                      <IconButton
                        onClick={() => this.toggleDisplayNameEdit(true)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Fragment>
                )}
                {profileData.map(item => (
                  <TextField
                    fullWidth
                    InputProps={{
                      readOnly: !isOwner
                    }}
                    key={item.id}
                    label={item.title}
                    onChange={e =>
                      this.onProfileDataUpdate(item.id, e.target.value)
                    }
                    select
                    value={user[item.id] || ""}
                  >
                    {item.options.map(option => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                ))}
                {isOwner && (
                  <FormControl
                    component="fieldset"
                    style={{
                      marginTop: "20px"
                    }}
                  >
                    <FormLabel component="legend">Public visibility</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              user.showDisplayName === undefined
                                ? true
                                : user.showDisplayName
                            }
                            onChange={e =>
                              this.onProfileDataUpdate(
                                "showDisplayName",
                                e.target.checked
                              )
                            }
                            value="showDisplayName"
                          />
                        }
                        label="Show Display Name"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              user.showCodeCombatProfile === undefined
                                ? true
                                : user.showCodeCombatProfile
                            }
                            onChange={e =>
                              this.onProfileDataUpdate(
                                "showCodeCombatProfile",
                                e.target.checked
                              )
                            }
                            value="showCodeCombatProfile"
                          />
                        }
                        label="Show CodeCombat Profile"
                      />
                    </FormGroup>
                    <FormHelperText>Display data to other users</FormHelperText>
                  </FormControl>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            {(isOwner ||
              user.showCodeCombatProfile ||
              user.showCodeCombatProfile === undefined) &&
              Object.keys(externalProfiles).map(externalProfileKey => (
                <Fragment key={externalProfileKey}>
                  <ExternalProfileCard
                    addExternalProfileRequest={this.addExternalProfileRequest}
                    classes={classes}
                    externalProfile={externalProfiles[externalProfileKey]}
                    inProgress={achievementsRefreshingInProgress}
                    isOwner={isOwner}
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
            {(joinedPaths[match.params.accountId] || []).map(path => (
              <JoinedPathCard
                classes={classes}
                id={path.id}
                key={path.id}
                name={path.name}
                solutions={path.solutions}
              />
            ))}
          </Grid>
        </Grid>
        <RemoveExternalProfileDialog
          externalProfileId={removeRequest.id}
          externalProfileRemoveDialogHide={externalProfileRemoveDialogHide}
          externalProfileRemoveRequest={externalProfileRemoveRequest}
          externalProfileType={removeRequest.type}
          open={removeRequest.actual}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  achievementsRefreshingInProgress:
    state.account.achievementsRefreshingInProgress,
  auth: state.firebase.auth,
  displayNameEdit: state.account.displayNameEdit,

  // That should be in firebase
  externalProfiles: accountService.fetchExternalProfiles(),
  externalProfileInUpdate: state.account.externalProfileInUpdate,
  joinedPaths: state.account.joinedPaths,
  profileData: getProfileData(state),
  removeRequest: {
    actual: state.account.showRemoveExternalProfileDialog,
    id: state.account.removingProfileId,
    type: state.account.removingProfileType
  },
  showDialog: state.account.showExternalProfileDialog,
  uid: state.firebase.auth.uid,
  user: (state.firebase.data.users || {})[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ],
  userAchievements: (state.firebase.data.userAchievements || {})[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ],
  userName: getDisplayName(state, ownProps)
});

const mapDispatchToProps = {
  accountOpen,
  displayNameEditToggle,
  displayNameUpdateRequest,
  externalProfileDialogHide,
  externalProfileDialogShow,
  externalProfileRefreshRequest,
  externalProfileRemoveDialogHide,
  externalProfileRemoveDialogShow,
  externalProfileRemoveRequest,
  externalProfileUpdateRequest,
  notificationShow,
  profileUpdateDataRequest
};

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => [
    "/profileData",
    `/users/${ownProps.match.params.accountId}`,
    `/userAchievements/${ownProps.match.params.accountId}`,
    `/users/${store.getState().firebase.auth.uid}`,
    `/userAchievements/${store.getState().firebase.auth.uid}`
  ]),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Account);
