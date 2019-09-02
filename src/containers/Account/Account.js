/**
 * @file Account container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 26.01.18
 */
// import { accountService } from "../../services/account";
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
  profileUpdateDataRequest,
  fetchUserData,
  inspectPathAsUser
} from "./actions";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";
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
import { Button } from "@material-ui/core";
import { adminCustomAuthRequest } from "../Admin/actions";

const styles = theme => ({
  actionButton: { margin: "8px" },
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
    adminCustomAuthRequest: PropTypes.func,
    displayNameEditToggle: PropTypes.func,
    displayNameUpdateRequest: PropTypes.func,
    externalProfileDialogHide: PropTypes.func,
    externalProfileDialogShow: PropTypes.func,
    externalProfileRefreshRequest: PropTypes.func,
    externalProfileRemoveDialogHide: PropTypes.func,
    externalProfileRemoveDialogShow: PropTypes.func,
    externalProfileRemoveRequest: PropTypes.func,
    externalProfileUpdateRequest: PropTypes.func,
    inspectPathAsUser: PropTypes.func,
    isAdmin: PropTypes.bool,
    profileUpdateDataRequest: PropTypes.func,
    fetchUserData: PropTypes.func,

    notificationShow: PropTypes.func,
    displayNameEdit: PropTypes.bool,
    externalProfileInUpdate: PropTypes.bool,
    externalProfiles: PropTypes.object,
    joinedPaths: PropTypes.object,
    match: PropTypes.object,
    myPaths: PropTypes.object,

    profileData: PropTypes.array,
    removeRequest: PropTypes.any,
    showDialog: PropTypes.bool.isRequired,
    user: PropTypes.object,
    uid: PropTypes.string,
    displayName: PropTypes.string,
    userAchievements: PropTypes.object,
    userJSON: PropTypes.object,
    selectedExternalProfileType: PropTypes.any
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
  inspectPath = pathId =>
    this.props.inspectPathAsUser(pathId, this.props.match.params.accountId);

  refreshAchievementsRequest = externalProfile => {
    const {
      externalProfileRefreshRequest,
      isAdmin,
      match,
      userAchievements
    } = this.props;

    externalProfileRefreshRequest(
      userAchievements[externalProfile.id].id,
      externalProfile.id,
      isAdmin && match.params.accountId
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
        newDisplayName: this.props.displayName
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
  onProfileUpdate = (profile, profileType) => {
    const { externalProfileUpdateRequest, isAdmin, match } = this.props;
    externalProfileUpdateRequest(
      profile,
      profileType,
      isAdmin && match.params.accountId
    );
  };

  onProfileDataUpdate = (field, value) =>
    this.props.profileUpdateDataRequest(field, value);

  fetchUserData = () => {
    this.props.fetchUserData();
  };

  inspectUser = () =>
    this.props.adminCustomAuthRequest(this.props.match.params.accountId);

  render() {
    const {
      achievementsRefreshingInProgress,
      auth,
      classes,
      displayNameEdit,
      externalProfiles,
      externalProfileRemoveDialogHide,
      externalProfileRemoveRequest,
      isAdmin,
      joinedPaths,
      match,
      myPaths,
      profileData,
      userAchievements,
      removeRequest,
      user,
      displayName,
      selectedExternalProfileType
    } = this.props;

    // taken from Courses.js, display if not logged in
    if (auth.isEmpty) {
      return <div>Login required to display this page.</div>;
    }

    if (!user) {
      if (user === null) {
        return (
          <p>
            This id <b>{match.params.accountId}</b> does not exist.
          </p>
        );
      }
      return <LinearProgress />;
    }

    const isOwner = auth.uid === match.params.accountId;
    const OwnerDisplayName =
      isOwner || (user.showDisplayName || user.showDisplayName === undefined)
        ? displayName
        : "(Hidden by the user)";

    return (
      <Fragment>
        <Grid container>
          <Grid item xs={3}>
            <Card className={classes.card}>
              <CardMedia
                image={user.photoURL}
                style={{ height: 240 }}
                title="UserPhoto"
              />
              <CardContent>
                <Typography
                  style={{
                    fontSize: 14
                  }}
                >
                  User Token : {String(match.params.accountId).slice(0, 5)}
                </Typography>
                {isOwner && displayNameEdit ? (
                  <Fragment>
                    <TextField
                      autoFocus
                      defaultValue={OwnerDisplayName}
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
                      defaultValue={OwnerDisplayName}
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
            <Button
              className={classes.actionButton}
              color="primary"
              onClick={this.fetchUserData}
              variant="contained"
            >
              Download JSON
            </Button>
            {isAdmin && (
              <Button
                className={classes.actionButton}
                color="primary"
                onClick={this.inspectUser}
                variant="contained"
              >
                Inspect
              </Button>
            )}
          </Grid>
          <Grid item xs={6}>
            {(isOwner ||
              isAdmin ||
              user.showCodeCombatProfile ||
              user.showCodeCombatProfile === undefined) &&
              Object.keys(externalProfiles).map(externalProfileKey =>
                externalProfiles[externalProfileKey].enable ? (
                  <ExternalProfileCard
                    addExternalProfileRequest={this.addExternalProfileRequest}
                    classes={classes}
                    externalProfile={externalProfiles[externalProfileKey]}
                    inProgress={
                      achievementsRefreshingInProgress &&
                      selectedExternalProfileType === externalProfileKey
                    }
                    isAdmin={isAdmin}
                    isOwner={isOwner}
                    key={externalProfileKey}
                    refreshAchievementsRequest={this.refreshAchievementsRequest}
                    removeExternalProfileRequest={
                      this.removeExternalProfileRequest
                    }
                    userAchievements={
                      (userAchievements || {})[externalProfileKey]
                    }
                  />
                ) : (
                  ""
                )
              )}
            <AddProfileDialog
              externalProfile={
                externalProfiles[selectedExternalProfileType] || {}
              }
              inProgress={this.props.externalProfileInUpdate}
              onClose={this.closeExternalProfileDialog}
              onCommit={this.onProfileUpdate}
              open={this.props.showDialog}
              uid={this.props.uid}
            />
            {(joinedPaths[match.params.accountId] || []).map(path => (
              <JoinedPathCard
                classes={classes}
                id={path.id}
                isOwner={!!(myPaths && myPaths[path.id])}
                key={path.id}
                name={path.name}
                onInspect={this.inspectPath}
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
  externalProfiles: state.firebase.data.thirdPartyServices || {},
  externalProfileInUpdate: state.account.externalProfileInUpdate,
  isAdmin: state.account.isAdmin,
  joinedPaths: state.account.joinedPaths,
  myPaths: state.firebase.data.myPaths,
  profileData: getProfileData(state),
  removeRequest: {
    actual: state.account.showRemoveExternalProfileDialog,
    id: state.account.removingProfileId,
    type: state.account.removingProfileType
  },
  showDialog: state.account.showExternalProfileDialog,
  selectedExternalProfileType: state.account.selectedExternalProfileType,
  uid: state.firebase.auth.uid,
  user: (state.firebase.data.users || {})[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ],
  userAchievements: (state.firebase.data.userAchievements || {})[
    ownProps.match.params.accountId || state.firebase.auth.uid
  ],
  displayName: getDisplayName(state, ownProps),
  userJSON: state.account.userData
});

const mapDispatchToProps = {
  accountOpen,
  adminCustomAuthRequest,
  displayNameEditToggle,
  displayNameUpdateRequest,
  inspectPathAsUser,
  externalProfileDialogHide,
  externalProfileDialogShow,
  externalProfileRefreshRequest,
  externalProfileRemoveDialogHide,
  externalProfileRemoveDialogShow,
  externalProfileRemoveRequest,
  externalProfileUpdateRequest,
  notificationShow,
  profileUpdateDataRequest,
  fetchUserData
};
export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => [
    "/profileData",
    `/users/${ownProps.match.params.accountId}`,
    `/userAchievements/${ownProps.match.params.accountId}`,
    `/users/${store.getState().firebase.auth.uid}`,
    {
      path: "/paths",
      storeAs: "myPaths",
      queryParams: [
        "orderByChild=owner",
        `equalTo=${store.getState().firebase.auth.uid}`
      ]
    },
    {
      path: "/paths",
      storeAs: "publicPaths",
      queryParams: ["orderByChild=isPublic", "equalTo=true"]
    },
    `/userAchievements/${store.getState().firebase.auth.uid}`,
    "/thirdPartyServices"
  ]),
  withStyles(styles),
  firestoreConnect((ownProps, store)=>[
    {
      path: "/path_statistics",
      collection:"path_statistics",
      storeAs: "pathStats",
      orderBy: ['endDate', 'desc'],
      limit:1
    },
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
  
)(Account);



