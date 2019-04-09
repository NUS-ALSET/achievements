/**
 * @file Cohorts container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import CohortsTable from "../../components/tables/CohortsTable";
import {
  addCohortDialogShow,
  addCohortDialogHide,
  addCohortRequest,
  cohortsChangeTab
} from "./actions";
import AddCohortDialog from "../../components/dialogs/AddCohortDialog";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

import Breadcrumbs from "../../components/Breadcrumbs";

const COHORT_TAB_PUBLIC_COHORTS = 0;
const COHORT_TAB_MY_COHORTS = 1;

class Cohorts extends React.PureComponent {
  static propTypes = {
    // dispatch: PropTypes.func,
    ui: PropTypes.object,
    currentUser: PropTypes.object,
    myCohorts: PropTypes.object,                                                                                                                                
    myPaths: PropTypes.object,
    publicCohorts: PropTypes.object,
    publicPaths: PropTypes.object,

    onAddCohortClick: PropTypes.func.isRequired,
    onEditCohortClick: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired,
    onCloseAddCohortDialg: PropTypes.func.isRequired,
    onAddCohortRequest: PropTypes.func.isRequired
  };

  render() {
    const {
      ui,
      myCohorts,
      myPaths,
      publicCohorts,
      publicPaths,
      currentUser,
      onAddCohortRequest,
      onEditCohortClick,
      onCloseAddCohortDialg
    } = this.props;
    let cohorts;

    switch (ui.currentTab) {
      case COHORT_TAB_MY_COHORTS:
        cohorts = myCohorts;
        break;
      case COHORT_TAB_PUBLIC_COHORTS:
        cohorts = publicCohorts;
        break;
      default:
        cohorts = {};
    }

    cohorts = cohorts || {};

    return (
      <Fragment>
        <Breadcrumbs paths={[{ label: "Cohorts" }]} />
        {currentUser.id && (
          <Toolbar>
            <Button
              color="primary"
              onClick={this.props.onAddCohortClick}
              variant="contained"
            >
              Add New Cohort
            </Button>
          </Toolbar>
        )}
        <Tabs
          indicatorColor="primary"
          onChange={this.props.onChangeTab}
          textColor="primary"
          value={ui.currentTab}
        >
          <Tab label="Public Cohorts" />
          {currentUser.id && <Tab label="My Cohorts" />}
        </Tabs>
        <CohortsTable
          cohorts={cohorts}
          currentUserId={currentUser.id || ""}
          onEditCohortClick={onEditCohortClick}
        />
        <AddCohortDialog
          cohort={ui.dialog && ui.dialog.cohort}
          myPaths={myPaths}
          onAddCohortRequest={onAddCohortRequest}
          onCloseAddCohortDialg={onCloseAddCohortDialg}
          open={ui.dialog && ui.dialog.type === "addCohort"}
          publicPaths={publicPaths}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  myCohorts: state.firebase.data.myCohorts,
  myPaths: state.firebase.data.myPaths,
  publicCohorts: state.firebase.data.publicCohorts,
  publicPaths: state.firebase.data.publicPaths,
  currentUser: {
    id: state.firebase.auth.uid
  },
  ui: {
    currentTab: state.cohorts.currentTab,
    dialog: state.cohorts.dialog
  }
});

// need the e in onChangeTab for event logging to work
const mapDispatchToProps = dispatch => ({
  onAddCohortClick: () => dispatch(addCohortDialogShow()),
  onChangeTab: (e, tabIndex) => dispatch(cohortsChangeTab(tabIndex)),
  onEditCohortClick: cohort => dispatch(addCohortDialogShow(cohort)),
  onCloseAddCohortDialg: () => dispatch(addCohortDialogHide()),
  onAddCohortRequest: cohortData => dispatch(addCohortRequest(cohortData))
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return [
      {
        path: "/cohorts",
        storeAs: "publicCohorts",
        queryParams: ["orderByChild=isPublic", "equalTo=true"]
      }
    ].concat(
      firebaseAuth.isEmpty
        ? []
        : [
            {
              path: "/paths",
              storeAs: "myPaths",
              queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
            },
            {
              path: "/paths",
              storeAs: "publicPaths",
              queryParams: ["orderByChild=isPublic", "equalTo=true"]
            },
            {
              path: "/cohorts",
              storeAs: "myCohorts",
              queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
            }
          ]
    );
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Cohorts);
