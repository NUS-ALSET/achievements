import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class Account extends React.Component {
  render() {
    let userName = this.props.userName;
    return <div>{userName}</div>;
  }
}

Account.propTypes = {
  userName: PropTypes.string
};

export default withRouter(Account);
