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

class AuthCheck extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    auth: PropTypes.object,
    firebase: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
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
    if (this.props.auth.uid) {
      return <Fragment>{this.props.children}</Fragment>;
    }
    return <AuthDialog authClick={this.authClick} />;
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth
});

export default compose(withFirebase, connect(mapStateToProps))(AuthCheck);
