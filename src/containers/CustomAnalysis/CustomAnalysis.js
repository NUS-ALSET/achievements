/**
 * @file Custom Analysis container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 30.06.19
 */

import * as React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

// Import components
import CustomAnalysisTabs from "../../components/tabs/CustomAnalysisTabs";
import LogCustomAnalysis from "./LogCustomAnalysis";
import UserCustomAnalysis from "./UserCustomAnalysis";
import SolutionCustomAnalysis from "./SolutionCustomAnalysis";

const styles = () => ({
  hidden: {
    display: "none"
  }
});

const ANALYSIS_TAB_SOLUTIONS = 0;
const ANALYSIS_TAB_LOGS = 1;
const ANALYSIS_TAB_USER_LOGS = 2;

class CustomAnalysis extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object
  };

  state = {
    tabIndex: ANALYSIS_TAB_SOLUTIONS
  };

  changeTabIndex = (event, tabIndex) => this.setState({ tabIndex });

  render() {
    const { classes } = this.props;
    const tabIndex = this.state.tabIndex;
    return (
      <div>
        <CustomAnalysisTabs
          onChange={this.changeTabIndex}
          tabIndex={tabIndex}
        />

        <br />
        <div
          className={tabIndex === ANALYSIS_TAB_SOLUTIONS ? "" : classes.hidden}
        >
          <SolutionCustomAnalysis />
        </div>

        <div className={tabIndex === ANALYSIS_TAB_LOGS ? "" : classes.hidden}>
          <LogCustomAnalysis />
        </div>

        <div
          className={tabIndex === ANALYSIS_TAB_USER_LOGS ? "" : classes.hidden}
        >
          <UserCustomAnalysis />
        </div>
      </div>
    );
  }
}

sagaInjector.inject(sagas);

export default withStyles(styles)(CustomAnalysis);
