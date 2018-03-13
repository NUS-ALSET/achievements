/**
 * @file NotImplemented container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 07.03.18
 */

import React from "react";
import PropTypes from "prop-types";

class NotImplemented extends React.PureComponent {
  static propTypes = { stub: PropTypes.bool };

  render() {
    return <div>Not Implemented</div>;
  }
}

export default NotImplemented;
