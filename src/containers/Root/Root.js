/**
 * @file Root container Root module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */
import {
  acceptEulaRequest,
  notificationHide,
  signInRequest,
  signOutRequest
} from "./actions";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { sagaInjector } from "../../services/saga";
import ConfirmEULADialog from "../../components/dialogs/ConfirmEULADialog";
import NotificationArea from "../../components/NotificationArea";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import sagas from "./sagas";
import RefreshPageDialog from "../../components/dialogs/RefreshPageDialog";
import SignInDialog from "../../components/dialogs/SignInDialog";

class Root extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    dispatch: PropTypes.func,
    notification: PropTypes.object.isRequired,
    requireAcceptEULA: PropTypes.bool.isRequired,
    requireRefresh: PropTypes.bool,
    requireSignIn: PropTypes.bool
  };

  handleNotificationClose = () => {
    this.props.dispatch(notificationHide());
  };

  onSignIn = () => this.props.dispatch(signInRequest());

  onSignOut = () => {
    this.props.dispatch(signOutRequest());
  };

  onAcceptEULA = () => {
    this.props.dispatch(acceptEulaRequest());
  };

  render() {
    const {
      children,
      notification,
      requireAcceptEULA,
      requireRefresh,
      requireSignIn
    } = this.props;

    return (
      <Fragment>
        <ConfirmEULADialog
          onAcceptEULA={this.onAcceptEULA}
          onSignOut={this.onSignOut}
          open={requireAcceptEULA}
        />
        <RefreshPageDialog open={requireRefresh} />
        <SignInDialog onSignInClick={this.onSignIn} open={requireSignIn} />
        <NotificationArea
          handleClose={this.handleNotificationClose}
          message={notification.message}
          open={notification.show}
        />
        {children}
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  requireRefresh: state.root.needRefresh,
  requireAcceptEULA: state.root.requireAcceptEULA,
  requireSignIn: !state.firebase.auth.uid && state.root.requireSignIn,
  notification: state.root.notification
});

export default compose(
  firebaseConnect(
    // Pretty dirty hack to get data fetching only after login
    (ownProps, store) =>
      !store.getState().firebase.auth.isEmpty && [
        `/users/${store.getState().firebase.auth.uid}`
      ]
  ),
  connect(mapStateToProps)
)(Root);
