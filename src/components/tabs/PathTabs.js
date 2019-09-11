/**
 * @file PathTabs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 25.04.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Fab from "@material-ui/core/Fab";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Zoom from "@material-ui/core/Zoom";

import AddIcon from "@material-ui/icons/Add";
import PathsTable from "../../components/tables/PathsTable";

export const PATHS_TAB_PUBLIC = 0;
export const PATHS_TAB_OWNED = 1;
export const PATHS_TAB_JOINED = 2;

class PathTabs extends React.Component {
  static propTypes = {
    pathDialogShow: PropTypes.func.isRequired,
    // paths: PropTypes.object,
    myPaths: PropTypes.object.isRequired,
    publicPaths: PropTypes.object,
    joinedPaths: PropTypes.object,
    uid: PropTypes.string,
    currentPathTab: PropTypes.number,
    handleSwitchPathTab: PropTypes.func,
    pathStats: PropTypes.object
  };

  onAddPathClick = () => {
    this.props.pathDialogShow();
  };

  handleTabChange = (event, tabIndex) => {
    this.props.handleSwitchPathTab(tabIndex);
  };

  render() {
    const {
      pathDialogShow,
      joinedPaths,
      myPaths,
      publicPaths,
      uid,
      currentPathTab
    } = this.props;
    let paths;

    switch (currentPathTab) {
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
    // paths = paths || {};

    return (
      <Fragment>
        <Zoom in={currentPathTab === PATHS_TAB_OWNED} unmountOnExit>
          <Fab
            color="primary"
            onClick={this.onAddPathClick}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>

        <Tabs
          fullWidth
          indicatorColor="primary"
          onChange={this.handleTabChange}
          textColor="primary"
          value={currentPathTab}
        >
          <Tab label="Public Paths" />
          <Tab label="Created Paths" />
          <Tab label="Joined Paths" />
        </Tabs>
        <PathsTable
          pathDialogShow={pathDialogShow}
          paths={paths}
          uid={uid}
          viewCreatedTab={currentPathTab === PATHS_TAB_OWNED}
        />
      </Fragment>
    );
  }
}

export default PathTabs;
