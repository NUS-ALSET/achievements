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
import ExternalProfileCard from "../../components/ExternalProfileCard";
import {
  externalProfileDialogHide,
  externalProfileDialogShow,
  externalProfileRefreshRequest,
  externalProfileRemoveDialogShow
} from "./actions";
import AddProfileDialog from "../../components/AddProfileDialog";
import { notificationShow } from "../Root/actions";

import { accountService } from "../../services/account";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import RemoveExternalProfileDialog from "../../components/RemoveProfileDialog";

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
    userAchievements: PropTypes.object,
    removeRequest: PropTypes.any
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

  closeExternalProfileDialog = () => {
    this.props.dispatch(externalProfileDialogHide());
  };
  showError = error => this.props.dispatch(notificationShow(error));

  render() {
    const {
      classes,
      userAchievements,
      externalProfiles,
      removeRequest,
      dispatch
    } = this.props;

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
                  onError={this.showError}
                  uid={this.props.uid}
                  onClose={this.closeExternalProfileDialog}
                  dispatch={dispatch}
                />
              </Fragment>
            ))}
          </Grid>
        </Grid>
        <RemoveExternalProfileDialog
          open={removeRequest.actual}
          externalProfileType={removeRequest.type}
          externalProfileId={removeRequest.id}
          dispatch={dispatch}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

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
  removeRequest: {
    actual: state.account.showRemoveExternalProfileDialog,
    id: state.account.removingProfileId,
    type: state.account.removingProfileType
  },
  user: (state.firebase.data.users || {})[state.firebase.auth.uid]
});

export default compose(
  firebaseConnect((props, store) => [
    //    "/users",
    `/userAchievements/${store.getState().firebase.auth.uid}`
  ]),
  withStyles(styles),
  connect(mapStateToProps)
)(Account);
