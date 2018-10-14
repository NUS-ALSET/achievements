/**
 * @file CohortTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 12.10.18
 */

import React from "react";
import PropTypes from "prop-types";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

class CohortTabs extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired
  };

  render() {
    const { onChange, tabIndex } = this.props;

    return (
      <Tabs
        fullWidth
        indicatorColor="primary"
        onChange={onChange}
        textColor="primary"
        value={tabIndex}
      >
        <Tab label="Cohort" />
        <Tab label="Edit" />
        <Tab label="Instructor View" />
      </Tabs>
    );
  }
}

export default CohortTabs;
