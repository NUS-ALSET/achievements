/**
 * @file Problem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 04.03.18
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import Jupyter from "react-jupyter";
import { problemInitRequest } from "./actions";
import { withRouter } from "react-router-dom";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

class Problem extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    problemJSON: PropTypes.any
  };

  componentDidMount() {
    this.props.dispatch(
      problemInitRequest(
        this.props.match.params.userId,
        this.props.match.params.problemId
      )
    );
  }

  render() {
    if (this.props.problemJSON) {
      return (
        <Jupyter
          defaultStyle={true}
          loadMathjax={true}
          notebook={this.props.problemJSON}
          showCode={true}
        />
      );
    }
    return <div>Loading</div>;
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  problemJSON: state.problem.problemJSON
});

export default compose(withRouter, connect(mapStateToProps))(Problem);
