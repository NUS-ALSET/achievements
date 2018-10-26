/**
 * @file Root container Root module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */
import { acceptEulaRequest, notificationHide, signOutRequest } from "./actions";
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

class Root extends React.PureComponent {
  static propTypes = {
    auth: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    dispatch: PropTypes.func,
    firebase: PropTypes.object,
    notification: PropTypes.object.isRequired,
    requireAcceptEULA: PropTypes.bool.isRequired,
    requireRefresh: PropTypes.bool,
    users: PropTypes.object
  };

  handleNotificationClose = () => {
    this.props.dispatch(notificationHide());
  };

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
      requireRefresh
    } = this.props;

    return (
      <Fragment>
        <ConfirmEULADialog
          onAcceptEULA={this.onAcceptEULA}
          onSignOut={this.onSignOut}
          open={requireAcceptEULA}
        />
        <RefreshPageDialog open={requireRefresh} />
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
  users: state.firebase.data.users,
  auth: state.firebase.auth,
  requireRefresh: state.root.needRefresh,
  requireAcceptEULA: state.root.requireAcceptEULA,
  notification: state.root.notification
});

export default compose(
  firebaseConnect(
    // Pretty dirty hack to get data fetching only after login
    (ownProps, store) =>
      !store.getState().firebase.auth.isEmpty && [
        "blacklistActions",
        `/users/${store.getState().firebase.auth.uid}`
      ]
  ),
  connect(mapStateToProps)
)(Root);
