/**
 * @file PathTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 25.04.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Toolbar from "@material-ui/core/Toolbar";

import PathsTable from "../../components/tables/PathsTable";
import { pathDialogShow } from "../../containers/Paths/actions";

const PATHS_TAB_JOINED = 0;
const PATHS_TAB_OWNED = 1;
const PATHS_TAB_PUBLIC = 2;

class PathTabs extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    paths: PropTypes.object,
    myPaths: PropTypes.object.isRequired,
    publicPaths: PropTypes.object,
    joinedPaths: PropTypes.object
  };

  state = {
    currentTab: 0
  };

  onAddPathClick = () => {
    this.setState({ currentTab: PATHS_TAB_OWNED });

    this.props.dispatch(pathDialogShow());
  };

  handleTabChange = (event, tabIndex) => {
    this.setState({ currentTab: tabIndex });
  };

  render() {
    const { dispatch, joinedPaths, myPaths, publicPaths } = this.props;
    let paths;

    switch (this.state.currentTab) {
      case PATHS_TAB_PUBLIC:
        paths = publicPaths;
        break;
      case PATHS_TAB_OWNED:
        paths = myPaths;
        break;
      case PATHS_TAB_JOINED:
        paths = joinedPaths;
        break;
      default:
        throw new Error("Wrong tab index");
    }
    paths = paths || {};

    return (
      <Fragment>
        <Toolbar>
          <Button
            color="primary"
            onClick={this.onAddPathClick}
            style={{
              margin: 4
            }}
            variant="raised"
          >
            Add Path
          </Button>
        </Toolbar>

        <Tabs
          fullWidth
          indicatorColor="primary"
          onChange={this.handleTabChange}
          textColor="primary"
          value={this.state.currentTab}
        >
          <Tab label="Joined Paths" />
          <Tab label="My Paths" />
          <Tab label="Public Paths" />
        </Tabs>
        <PathsTable dispatch={dispatch} paths={paths} />
      </Fragment>
    );
  }
}

export default PathTabs;
