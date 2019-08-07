/**
 * @file CustomAnalysisTabs container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 01.08.19
 */

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const styles = theme => {
  return {
    tabs: {
      background: theme.palette.grey["200"],
      borderRadius: 20
    },
    tab: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      "&:hover": {
        background: theme.palette.grey["100"]
      }
    }
  };
};
class CustomAnalysisTabs extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired
  };

  render() {
    const { classes, onChange, tabIndex } = this.props;

    return (
      <Tabs
        className={classes.tabs}
        fullWidth
        indicatorColor="primary"
        onChange={onChange}
        textColor="primary"
        value={tabIndex}
        centered
      >
        <Tab className={classes.tab} label="Solution Analysis" disableRipple />
        <Tab className={classes.tab} label="Log Analysis" disableRipple />
        <Tab className={classes.tab} label="User Log Analysis" disableRipple />
      </Tabs>
    );
  }
}

export default withStyles(styles)(CustomAnalysisTabs);
