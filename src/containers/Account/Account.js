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
  externalProfileRemoveDialogShow,
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
    dispatch: PropTypes.func.isRequired,
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
    this.props.dispatch(accountOpen(this.props.match.params.accountId));
  }

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

  onProfileDataUpdate = (field, value) =>
    this.props.dispatch(profileUpdateDataRequest(field, value));

  render() {
    const {
      achievementsRefreshingInProgress,
      auth,
      classes,
      displayNameEdit,
      dispatch,
      externalProfiles,
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
      return (
        <div>
          You do not seem to have a profile registered. Login required to
          display this page
        </div>
      );
    }

    if (!user) {
      return <LinearProgress />;
    }

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
                {profileData.map(item => (
                  <TextField
                    fullWidth
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
  connect(mapStateToProps)
)(Account);
