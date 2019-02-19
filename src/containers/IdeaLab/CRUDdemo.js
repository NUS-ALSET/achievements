import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { firebaseConnect } from "react-redux-firebase";

import AddTextSolutionDialog from "../../components/dialogs/AddTextSolutionDialog"
import sagas from "./sagas";
import { sagaInjector } from "../../services/saga";
import * as actions from "./actions";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";


// this is a demo route for CRUD actions to Firebase

class CRUDdemo extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    analyticsData: PropTypes.object,
    changePathKeyJupSol: PropTypes.func,
    filterAnalyticsData: PropTypes.func,
    filteredAnalytics: PropTypes.array,
    initAnalyticsData: PropTypes.func,
    jupyterAnalyticsPathKey: PropTypes.string,
    moreProbRequestsData: PropTypes.object,
    createToCRUDdemo: PropTypes.func,
    CRUDdemoData: PropTypes.object,
    deleteCRUDdemoData: PropTypes.func
  };

  state = {
    anchorEl: null,
    CreateDialogOpen: false
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

  CreateToCRUDdemo = (solution) => {
    console.log("trigger create crud demo write", solution)
    this.setState({
      CreateDialogOpen: false
    })
    this.props.createToCRUDdemo(solution)
  }

  deleteCRUDdemoData = () => {
    this.props.deleteCRUDdemoData()
  }

  render() {
    const { anchorEl } = this.state;
    const {
      auth,
      analyticsData,
      CRUDdemoData,
      filteredAnalytics,
      jupyterAnalyticsPathKey,
      moreProbRequestsData
    } = this.props;

    return (
      <Fragment>
        <h1>1. Create/Update</h1>
        <Button
          color="primary"
          onClick={() =>
            this.setState({
              CreateDialogOpen: true
            })
          }
          variant="contained"
        >
          Create value at /analytics/cruddemo in firebase
        </Button>
        <AddTextSolutionDialog
          onClose={() =>
            this.setState({
              CreateDialogOpen: false
            })
          }
          onCommit={this.CreateToCRUDdemo}
          open={this.state.CreateDialogOpen}
          solution={"some default value"}
          taskId={"dummyId"}
        />
        <hr />
        <h1>2. Read/Delete</h1>
        <h3>Here is the data of /analytics/CRUDdemo as read in real-time:</h3>
        <ul>
          <li><b>=== user ID: stored data ===</b></li>
          {CRUDdemoData
            ? (
              Object.keys(CRUDdemoData).map(item => (
                <li key={item}>
                  {item}: {CRUDdemoData[item]}
                  {item === auth.uid &&
                    <button onClick={this.deleteCRUDdemoData}>
                      Delete my data
                    </button>
                  }
                </li>
              ))
            )
            : (
              "loading..."
            )
          }
        </ul>
        {analyticsData ? (
          <Fragment>
            <h1>Fetched data from Firebase /analytics/activityAttempts node</h1>
            <Button
              aria-haspopup="true"
              aria-owns={anchorEl ? "simple-menu" : undefined}
              color="primary"
              onClick={this.handleClick}
              variant="contained"
            >
              Select PathKey to fetch from jupyterSolutions
            </Button>
            <Menu
              anchorEl={anchorEl}
              id="simple-menu"
              onClose={this.handleClose}
              open={Boolean(anchorEl)}
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
            <h2>
              data with pathKey = {jupyterAnalyticsPathKey || "show all"}:
            </h2>
            <hr />
            <ul>
              {filteredAnalytics &&
                Object.keys(filteredAnalytics).map(item => (
                  <li key={item}>
                    jupyterSolutions ID: {filteredAnalytics[item]}
                  </li>
                ))}
            </ul>
          </Fragment>
        ) : (
          <Fragment>
            <h1>fetching from /analytics/activityAttempts</h1>
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
        ) : auth.isEmpty ? (
          <h1>only logged users can access /moreProblemsRequests</h1>
        ) : (
          <Fragment>
            <h1>fetching from /moreProblemsRequests</h1>
            <h2>...</h2>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

// inject saga to the main saga
sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  analyticsData: state.firebase.data.analyticsData,
  CRUDdemoData: state.firebase.data.CRUDdemoData,
  filteredAnalytics: state.CRUDdemo.filteredAnalytics,
  jupyterAnalyticsPathKey: state.CRUDdemo.jupyterAnalyticsPathKey,
  moreProbRequestsData: state.firebase.data.moreProbRequestsData
});

const mapDispatchToProps = {
  changePathKeyJupSol: actions.changePathKeyJupSol,
  initAnalyticsData: actions.initAnalyticsData,
  filterAnalyticsData: actions.filterAnalyticsData,
  createToCRUDdemo: actions.createToCRUDdemo,
  deleteCRUDdemoData: actions.deleteCRUDdemoData
};

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;

    return [
      {
        path: "/analytics/CRUDdemo",
        storeAs: "CRUDdemoData"
      },
      {
        path: "/analytics/activityAttempts",
        storeAs: "analyticsData",
        queryParams: ["orderByChild=activityType", 'equalTo=jupyterInline']
      },
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CRUDdemo);
