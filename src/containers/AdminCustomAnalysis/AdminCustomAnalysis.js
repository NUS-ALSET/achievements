/**
 * @file Admin Custom Analysis container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 02.07.18
 */

import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import { adminCustomAnalysisOpen } from "./actions";

const styles = () => ({
  root: {
    width: "100%"
  }
});

class AdminCustomAnalysis extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    isAdmin: PropTypes.bool,
    onOpen: PropTypes.func
  };

  componentDidMount() {
    this.props.onOpen();
  }

  render() {
    const { classes, isAdmin } = this.props;
    return (
      <div className={classes.root}>
        <div>Admin Status : {String(isAdmin)}</div>
      </div>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  isAdmin: state.adminCustomAnalysis.isAdmin
});

const mapDispatchToProps = {
  onOpen: adminCustomAnalysisOpen
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AdminCustomAnalysis);
