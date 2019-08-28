/**
 * @file Paths container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.02.18
 */
import React, { Fragment } from "react";

import { compose } from "redux";
import { connect } from "react-redux";

import { firebaseConnect,firestoreConnect } from "react-redux-firebase";

import PropTypes from "prop-types";

import AddPathDialog from "../../components/dialogs/AddPathDialog";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import PathTabs from "../../components/tabs/PathTabs";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  pathChangeRequest,
  pathDialogHide,
  pathDialogShow,
  pathsOpen,
  switchPathTab
} from "./actions";
import PathsTable from "../../components/tables/PathsTable";
import { publicPathSelector } from "./selector";
import LinearProgress from "@material-ui/core/LinearProgress";

class Paths extends React.PureComponent {
  static propTypes = {
    myPaths: PropTypes.object,
    joinedPaths: PropTypes.object,
    publicPaths: PropTypes.object,
    ui: PropTypes.object,
    uid: PropTypes.string,

    pathsOpen: PropTypes.func.isRequired,
    pathDialogShow: PropTypes.func,
    pathChangeRequest: PropTypes.func,
    pathDialogHide: PropTypes.func,
    handleSwitchPathTab: PropTypes.func,
    currentPathTab: PropTypes.number,
    pathStats:PropTypes.object
  };

  componentDidMount() {
    this.props.pathsOpen();
  }

  render() {
    const {
      pathChangeRequest,
      pathDialogHide,
      myPaths,
      joinedPaths,
      publicPaths,
      ui,
      uid,
      pathDialogShow,
      currentPathTab,
      pathStats,
      handleSwitchPathTab
    } = this.props;
    return (
      <Fragment>
        <Breadcrumbs paths={[{ label: "Paths" }]} />
        {uid ? (
          !joinedPaths ? (
            joinedPaths === null && <p>Paths does not exist!</p>
          ) : (
            <Fragment>
              <PathTabs
                currentPathTab={currentPathTab}
                handleSwitchPathTab={handleSwitchPathTab}
                joinedPaths={joinedPaths}
                myPaths={Object.assign(
                  {
                    [uid]: { name: "Default" }
                  },
                  myPaths
                )}
                pathDialogShow={pathDialogShow}
                publicPaths={publicPaths}
                pathStats={pathStats}
                uid={uid}
                
              />              
              <AddPathDialog
                open={ui.dialog.type === "PathChange"}
                path={ui.dialog.value}
                pathChangeRequest={pathChangeRequest}
                pathDialogHide={pathDialogHide}
              />
            </Fragment>
          )
        ) : !publicPaths ? (
          publicPaths === null ? (
            <p>Public does not exist!</p>
          ) : (
            <Fragment>
              Loading Public Paths...
              <LinearProgress />
            </Fragment>
          )
        ) : (
          <PathsTable pathDialogShow={pathDialogShow} paths={publicPaths} />
        )}
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  ui: state.paths.ui,
  myPaths: state.firebase.data.myPaths,
  joinedPaths: state.paths.joinedPaths,
  publicPaths: publicPathSelector(state),
  currentPathTab: state.paths.currentPathTab,
  pathStats:state.firestore.data.pathStats
});

const mapDispatchToProps = dispatch => ({
  pathsOpen: () => dispatch(pathsOpen()),
  pathDialogShow: pathInfo => dispatch(pathDialogShow(pathInfo)),
  pathChangeRequest: pathInfo => dispatch(pathChangeRequest(pathInfo)),
  pathDialogHide: () => dispatch(pathDialogHide()),
  handleSwitchPathTab: tabIndex => dispatch(switchPathTab(tabIndex))
});

export default compose(  
  firestoreConnect((ownProps, store)=>[
    {
      path: "/path_statistics",
      collection:"path_statistics",
      storeAs: "pathStats",
      orderBy: ['endDate', 'desc'],
      limit:1
    }]),
  firebaseConnect((ownProps, store) => {
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
   connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Paths);
