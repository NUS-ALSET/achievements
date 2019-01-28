/**
 * @file ${NAME} container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created ${DATE}
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

class ${NAME} extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func
  };

  render() {
    return (
      <div>${NAME}</div>
    );
  }
}

const mapStateToProps = state => ({
});

export default compose(connect(mapStateToProps))(
  ${NAME}
);
