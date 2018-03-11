/**
 * @file Paths container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.02.18
 */
import React, { Fragment } from "react";

import { compose } from "redux";
import { connect } from "react-redux";

import { firebaseConnect } from "react-redux-firebase";

import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import PropTypes from "prop-types";

import { pathDialogShow, pathProblemDialogShow } from "./actions";

import PathDialog from "../../components/dialogs/PathDialog";
import ProblemsTable from "../../components/tables/ProblemsTable";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import ProblemDialog from "../../components/dialogs/ProblemDialog";
import { getProblems } from "./selectors";
import PathsList from "../../components/lists/PathsList";

class Paths extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    myPaths: PropTypes.object,
    publicPaths: PropTypes.object,
    selectedPathId: PropTypes.string,
    problems: PropTypes.array,
    ui: PropTypes.object,
    // FIXIT: figure out correct type
    uid: PropTypes.any
  };

  state = { tabIndex: 0 };

  onAddPathClick = () => this.props.dispatch(pathDialogShow());
  onAddProblemClick = () => this.props.dispatch(pathProblemDialogShow());

  render() {
    const {
      myPaths,
      publicPaths,
      dispatch,
      ui,
      uid,
      selectedPathId,
      problems
    } = this.props;

    return (
      <Fragment>
        <Grid container>
          <Grid item sm={3} xs={12}>
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
            {myPaths && (
              <PathsList
                dispatch={dispatch}
                header="Private Paths"
                paths={myPaths}
                selectedPathId={selectedPathId}
              />
            )}
            {publicPaths && (
              <PathsList
                dispatch={dispatch}
                header="Public Paths"
                paths={publicPaths}
                selectedPathId={selectedPathId}
              />
            )}
          </Grid>
          <Grid item sm={9} xs={12}>
            <Button
              color="primary"
              onClick={this.onAddProblemClick}
              style={{
                margin: 4
              }}
              variant="raised"
            >
              Add Problem
            </Button>
            <ProblemsTable
              currentUserId={uid}
              dispatch={dispatch}
              problems={problems}
              selectedPathId={selectedPathId}
            />
          </Grid>
        </Grid>
        <PathDialog
          dispatch={dispatch}
          open={ui.dialog.type === "PathChange"}
          path={ui.dialog.value}
        />
        <ProblemDialog
          dispatch={dispatch}
          open={ui.dialog.type === "ProblemChange"}
          pathId={selectedPathId}
          problem={ui.dialog.value}
        />
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
  problems: getProblems(state)
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return (
      !firebaseAuth.isEmpty && [
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
          path: `/problems/${firebaseAuth.uid}`
        }
      ]
    );
  }),
  connect(mapStateToProps)
)(Paths);
