/**
 * @file AuthCheck container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withFirebase } from "react-redux-firebase";
import AuthDialog from "../../components/AuthDialog";
import { authProvider } from "../../achievementsApp/config";
import NotificationArea from "../../components/NotificationArea";
import { riseErrorMessage } from "./actions";

class AuthCheck extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    auth: PropTypes.object,
    firebase: PropTypes.object,
    notificationMessage: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  handleNotificationClose = () => {
    this.props.dispatch(riseErrorMessage(""));
  };

  authClick = authType => {
    switch (authType) {
      case "google":
        return this.props.firebase.auth().signInWithPopup(authProvider);
      default:
        console.error("Should never come here");
    }
  };

  render() {
    return (
      <Fragment>
        <NotificationArea
          handleClose={this.handleNotificationClose}
          message={this.props.notificationMessage}
        />
        {this.props.auth.uid ? (
          this.props.children
        ) : (
          <AuthDialog authClick={this.authClick} />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  notificationMessage: state.authCheck.notificationMessage
});

export default compose(withFirebase, connect(mapStateToProps))(AuthCheck);
