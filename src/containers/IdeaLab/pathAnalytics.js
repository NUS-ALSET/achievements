import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Typography } from "@material-ui/core";
import { firebaseConnect } from "react-redux-firebase";
import ReactFusioncharts from "react-fusioncharts";

import {
  updateSelectedPath,
  fetchActivityAttempts
} from "./actions";
import { selectDataset } from "./reducer";

class PathAnalytics extends React.PureComponent {
  static propTypes = {
    fetchActivityAttempts: PropTypes.func,
    dataSource: PropTypes.object,
    updateSelectedPath: PropTypes.func,
    ownerPaths: PropTypes.object,
    // selectedPath: PropTypes.object
  };
  state = {
    anchorEl: null,
    loading: true
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  pathSelected = (path, key) => {
    this.props.updateSelectedPath(path, key);
    // get activityAttempts from DB
    this.props.fetchActivityAttempts(key);
  }

  getFirstElement = object => {
    const obj = object || {}
    const isObjectEmpty = Object.entries(obj).length === 0 && obj.constructor === Object;
    return !isObjectEmpty ? obj[Object.keys(obj)[0]] : "";
  }

  renderDropdownItems = () => {
    const ownerPaths = this.props.ownerPaths;
    return ownerPaths && Object.keys(ownerPaths).map((key, i) => (
      <MenuItem
        key={key+i}
        onClick={() => {
          this.pathSelected(ownerPaths[key], key);
          this.handleClose();
        }}
      >
        {ownerPaths[key].name} - {key}
      </MenuItem>
    ))
  }

  render() {
    const {
      anchorEl
    } = this.state;
    const {
      dataSource
    } = this.props;

    return (
      <Fragment>
            <Fragment>
              <div style={{ display: "flex" }}>
                <Typography style = {{ flexDirection: "column" }} variant="h5">
                  Path Analysis
                </Typography>
              </div>
              <Button
                aria-haspopup="true"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                color="primary"
                onClick={this.handleClick}
                variant="contained"
              >
                Select PathKey to fetch
              </Button>
              <Menu
                anchorEl={anchorEl}
                id="simple-menu"
                onClose={this.handleClose}
                open={Boolean(anchorEl)}
              >
                {this.renderDropdownItems()}
              </Menu>
              <hr />
            </Fragment>
          <div style={{ height : "300px"}}>
            <ReactFusioncharts
              dataFormat = "JSON"
              dataSource = {dataSource}
              height = '100%'
              type = "msline"
              width = '100%'
            />
          </div>
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ownerPaths: state.firebase.data.ownerPaths,
  selectedPath: state.CRUDdemo.selectedPath,
  dataSource: selectDataset(state)
});

const mapDispatchToProps = {
  updateSelectedPath,
  fetchActivityAttempts
};

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuthUser = store.getState().firebase.auth;
    return [
      {
        path: "/paths",
        storeAs: "ownerPaths",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuthUser.uid}`]
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PathAnalytics);
