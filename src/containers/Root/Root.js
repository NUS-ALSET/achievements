/**
 * @file Root container Root module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import NotificationArea from "../../components/NotificationArea";
import { acceptEulaRequest, notificationShow, signOutRequest } from "./actions";
import ConfirmEULADialog from "../../components/ConfirmEULADialog";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

class Root extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    auth: PropTypes.object,
    firebase: PropTypes.object,
    users: PropTypes.object,
    requireAcceptEULA: PropTypes.bool.isRequired,
    notification: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  handleNotificationClose = () => {
    this.props.dispatch(notificationShow(""));
  };

  onSignOut = () => {
    this.props.dispatch(signOutRequest());
  };

  onAcceptEULA = () => {
    this.props.dispatch(acceptEulaRequest());
  };

  render() {
    const { requireAcceptEULA, notification, children } = this.props;

    return (
      <Fragment>
        <ConfirmEULADialog
          onSignOut={this.onSignOut}
          onAcceptEULA={this.onAcceptEULA}
          open={requireAcceptEULA}
        />
        <NotificationArea
          handleClose={this.handleNotificationClose}
          open={notification.show}
          message={notification.message}
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
  requireAcceptEULA: state.root.requireAcceptEULA,
  notification: state.root.notification
});

export default compose(
  firebaseConnect(
    // Pretty dirty hack to get data fetching only after login
    (ownProps, store) =>
      !store.getState().firebase.auth.isEmpty && ["blacklistActions"]
  ),
  connect(mapStateToProps)
)(Root);
