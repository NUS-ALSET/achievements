/**
 * @file Paths container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.02.18
 */
import React, { Fragment } from "react";

import { compose } from "redux";
import { connect } from "react-redux";

import { firebaseConnect } from "react-redux-firebase";

// import Button from "@material-ui/core/Button";
// import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

import AddPathDialog from "../../components/dialogs/AddPathDialog";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import { getProblems } from "./selectors";
import PathTabs from "../../components/tabs/PathTabs";
import Breadcrumbs from "../../components/Breadcrumbs";
import { pathsOpen, pathDialogShow } from "./actions";
import PathsTable from "../../components/tables/PathsTable";
import LinearProgress from "@material-ui/core/LinearProgress";

class Paths extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    myPaths: PropTypes.object,
    joinedPaths: PropTypes.object,
    publicPaths: PropTypes.object,
    selectedPathId: PropTypes.string,
    problems: PropTypes.array,
    ui: PropTypes.object,
    // FIXIT: figure out correct type
    uid: PropTypes.any,
    fetchedPaths: PropTypes.bool,
    pathsOpen: PropTypes.func,
    pathDialogShow: PropTypes.func
  };

  componentDidMount() {
    this.props.pathsOpen();
  }

  render() {
    const {
      dispatch,
      myPaths,
      joinedPaths,
      publicPaths,
      ui,
      uid,
      fetchedPaths,
      pathDialogShow
    } = this.props;

    return (
      <Fragment>
        <Breadcrumbs paths={[{ label: "Paths" }]} />
        {!fetchedPaths ? (
          <Fragment>
            Loading Paths...
            <LinearProgress />
          </Fragment>
        ) : uid ? (
          <Fragment>
            <PathTabs
              pathDialogShow={pathDialogShow}
              joinedPaths={joinedPaths}
              myPaths={Object.assign({ [uid]: { name: "Default" } }, myPaths)}
              publicPaths={publicPaths}
            />
            <AddPathDialog
              dispatch={dispatch}
              open={ui.dialog.type === "PathChange"}
              path={ui.dialog.value}
            />
          </Fragment>
        ) : (
          <PathsTable
            pathDialogShow={pathDialogShow}
            paths={publicPaths || {}}
          />
        )}
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  ui: state.paths.ui,
  selectedPathId: state.paths.selectedPathId,
  myPaths: state.firebase.data.myPaths,
  publicPaths: state.firebase.data.publicPaths,
  joinedPaths: state.paths.joinedPaths,
  problems: getProblems(state),
  fetchedPaths: state.paths.fetchedPaths
});

const mapDispatchToProps = dispatch => ({
  pathsOpen: () => dispatch(
    pathsOpen()
  ),
  pathDialogShow: (pathInfo) => dispatch(
    pathDialogShow(pathInfo)
  ),
  dispatch
});

export default compose(
  firebaseConnect((ownProps, store) => {
    // I didn't find way to test this
    const firebaseAuth = store.getState().firebase.auth;
    return [
      {
        path: "/paths",
        storeAs: "publicPaths",
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
            }
          ]
    );
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Paths);
