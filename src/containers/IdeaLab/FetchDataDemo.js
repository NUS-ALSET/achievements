import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { firebaseConnect } from "react-redux-firebase";
import {
  changePathKeyJupSol,
  initAnalyticsData,
  filterAnalyticsData
} from "./actions";

class FetchDataDemo extends React.PureComponent {
  static propTypes = {
    auth: PropTypes.object,
    analyticsData: PropTypes.object,
    changePathKeyJupSol: PropTypes.func,
    filterAnalyticsData: PropTypes.func,
    filteredAnalytics: PropTypes.array,
    initAnalyticsData: PropTypes.func,
    jupyterAnalyticsPathKey: PropTypes.string,
    moreProbRequestsData: PropTypes.object
  };
  state = {
    anchorEl: null
  };

  componentDidUpdate(prevProps) {
    if (prevProps.analyticsData !== this.props.analyticsData) {
        this.props.initAnalyticsData(this.props.analyticsData);
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeKey = pathKey => {
    this.props.changePathKeyJupSol(pathKey);
  };

  filterByPathKey = (analyticsData, pathKey) => {
    this.props.filterAnalyticsData(analyticsData, pathKey);
  };

  render() {
    const { anchorEl } = this.state;
    const {
      auth,
      analyticsData,
      filteredAnalytics,
      jupyterAnalyticsPathKey,
      moreProbRequestsData
    } = this.props;

    return (
      <Fragment>
        {analyticsData ? (
          <Fragment>
            <h1>Fetched data from Firebase /analytics/jupyterSolutions node</h1>
            <Button
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              color="primary"
              onClick={this.handleClick}
              variant="contained"
            >
              Select PathKey to fetch from jupyterSolutions
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem
                onClick={() => {
                  this.handleChangeKey("-LIHcRLK2Ql9Fva5uERe");
                  this.handleClose();
                  this.filterByPathKey(analyticsData, "-LIHcRLK2Ql9Fva5uERe");
                }}
              >
                pathKey1: -LIHcRLK2Ql9Fva5uERe
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleChangeKey("-LMfAB4SNR25AyoFLmN5");
                  this.handleClose();
                  this.filterByPathKey(analyticsData, "-LMfAB4SNR25AyoFLmN5");
                }}
              >
                pathKey2: -LMfAB4SNR25AyoFLmN5
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleChangeKey("-LLd7A7XpcbQiQ9pzAIX");
                  this.handleClose();
                  this.filterByPathKey(analyticsData, "-LLd7A7XpcbQiQ9pzAIX");
                }}
              >
                pathKey3: -LLd7A7XpcbQiQ9pzAIX
              </MenuItem>
            </Menu>
            <h2>data with pathKey = {jupyterAnalyticsPathKey || "show all"}:</h2>
            <hr />
            <ul>
              {filteredAnalytics && Object.keys(filteredAnalytics)
                .map(item => (
                  <li key={item}>
                    jupyterSolutions ID: {filteredAnalytics[item]}
                  </li>
              ))}
            </ul>
          </Fragment>
        ) : (
          <Fragment>
            <h1>fetching from /analytics/jupyterSolutions</h1>
            <h2>data with pathKey = {jupyterAnalyticsPathKey}:</h2>
            <h2>...</h2>
          </Fragment>
        )}
        {moreProbRequestsData ? (
          <Fragment>
            <h1>Fetched data from Firebase /moreProblemsRequests node</h1>
            <ul>
              <li>moreProblemsRequests ID: activityCount</li>
              {Object.keys(moreProbRequestsData).map(item => (
                <li key={item}>
                  {moreProbRequestsData[item].path}:{" "}
                  {moreProbRequestsData[item].activityCount}
                </li>
              ))}
            </ul>
          </Fragment>
        ) : (
          auth.isEmpty ? (
            <h1>
              only logged users can access /moreProblemsRequests
            </h1>
          ) : (
            <Fragment>
              <h1>fetching from /moreProblemsRequests</h1>
              <h2>...</h2>
            </Fragment>
          )
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  analyticsData: state.firebase.data.analyticsData,
  filteredAnalytics: state.fetchDataDemo.filteredAnalytics,
  jupyterAnalyticsPathKey: state.fetchDataDemo.jupyterAnalyticsPathKey,
  moreProbRequestsData: state.firebase.data.moreProbRequestsData
});

const mapDispatchToProps = {
  changePathKeyJupSol,
  initAnalyticsData,
  filterAnalyticsData
};

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;

    return [
      {
        path: "/analytics/jupyterSolutions",
        storeAs: "analyticsData"
      }
    ].concat(
      firebaseAuth.isEmpty
        ? []
        : [
            {
              path: "/moreProblemsRequests",
              storeAs: "moreProbRequestsData",
              queryParams: ["orderByChild=requestTime"]
            }
          ]
    );
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(FetchDataDemo);
