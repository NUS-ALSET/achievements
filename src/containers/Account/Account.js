/**
 * @file Account container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 26.01.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import withStyles from "material-ui/styles/withStyles";
import Grid from "material-ui/Grid";
import Card, { CardMedia, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import { accountService } from "../../services/account";
import ExternalProfileCard from "../../components/ExternalProfileCard";
import {
  externalProfileDialogHide,
  externalProfileDialogShow
} from "./actions";
import AddProfileDialog from "../../components/AddProfileDialog";
import { riseErrorMessage } from "../AuthCheck/actions";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const styles = theme => ({
  card: {
    margin: theme.spacing.unit
  }
});

class Account extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    showDialog: PropTypes.bool.isRequired,
    firebase: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object,
    uid: PropTypes.string,
    userName: PropTypes.string,
    externalProfiles: PropTypes.object,
    userAchievements: PropTypes.object
  };

  state = {
    codeCombatLogin: null,
    userChecked: false,
    confirmation: {
      resolve: () => {},
      open: false,
      message: ""
    }
  };

  closeConfirmation = () => {
    this.setState({
      confirmation: {
        open: false,
        message: "",
        resolve: () => {}
      }
    });
  };

  showConfirmation = message => {
    return new Promise(resolve =>
      this.setState({
        confirmation: {
          open: true,
          message,
          resolve
        }
      })
    );
  };

  addExternalProfileRequest = externalProfile => {
    this.props.dispatch(externalProfileDialogShow(externalProfile));
  };
  refreshAchievementsRequest = externalProfile => {
    const { uid, userAchievements } = this.props;

    accountService.refreshAchievements(
      externalProfile,
      uid,
      userAchievements[externalProfile.id].id
    );
  };
  removeExternalProfileRequest = externalProfile => {
    this.showConfirmation(
      `Are you sure you want to remove ${externalProfile.name} profile?`
    ).then(result => {
      if (result) {
        accountService.removeExternalProfile(externalProfile, this.props.uid);
      }
      this.closeConfirmation();
    });
  };

  /**
   *
   * @param {String} login
   * @param {ExternalProfile} externalProfile
   * @returns {Promise<void>}
   */
  commitNewProfile = (login, externalProfile) => {
    const { uid, dispatch } = this.props;

    return Promise.resolve()
      .then(() =>
        accountService.addExternalProfile(externalProfile, uid, login)
      )
      .catch(err => {
        dispatch(riseErrorMessage(err.message));
      })
      .then(() => this.closeExternalProfileDialog());
  };

  closeExternalProfileDialog = () => {
    this.props.dispatch(externalProfileDialogHide());
  };

  render() {
    const { classes, userAchievements, externalProfiles } = this.props;

    return (
      <Fragment>
        <Grid container>
          <Grid item xs={3}>
            <Card className={classes.card}>
              <CardMedia
                style={{ height: 240 }}
                image={this.props.auth.photoURL}
                title={this.props.userName}
              />
              <CardContent>
                <Typography>{this.props.userName}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            {Object.keys(externalProfiles).map(externalProfileKey => (
              <Fragment key={externalProfileKey}>
                <ExternalProfileCard
                  addExternalProfileRequest={this.addExternalProfileRequest}
                  refreshAchievementsRequest={this.refreshAchievementsRequest}
                  removeExternalProfileRequest={
                    this.removeExternalProfileRequest
                  }
                  classes={classes}
                  userAchievements={
                    (userAchievements || {})[externalProfileKey]
                  }
                  externalProfile={externalProfiles[externalProfileKey]}
                />
                <AddProfileDialog
                  open={this.props.showDialog}
                  externalProfile={externalProfiles[externalProfileKey]}
                  onCancel={this.closeExternalProfileDialog}
                  onCommit={this.commitNewProfile}
                />
              </Fragment>
            ))}
          </Grid>
        </Grid>
        <ConfirmationDialog
          resolve={this.state.confirmation.resolve}
          message={this.state.confirmation.message}
          open={this.state.confirmation.open}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userName: state.firebase.auth.displayName,
  uid: state.firebase.auth.uid,
  auth: state.firebase.auth,

  // That should be in firebase
  externalProfiles: accountService.fetchExternalProfiles(),

  userAchievements: (state.firebase.data.userAchievements || {})[
    state.firebase.auth.uid
  ],
  showDialog: state.account.showExternalProfileDialog,
  user: (state.firebase.data.users || {})[state.firebase.auth.uid]
});

export default compose(
  firebaseConnect((props, store) => [
    "/users",
    `/userAchievements/${store.getState().firebase.auth.uid}`
  ]),
  withStyles(styles),
  connect(mapStateToProps)
)(Account);
