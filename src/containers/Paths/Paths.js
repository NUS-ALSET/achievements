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
import List, { ListItem, ListItemText, ListSubheader } from "material-ui/List";
import PropTypes from "prop-types";

import { pathDialogShow, pathProblemDialogShow, pathSelect } from "./actions";

import PathDialog from "../../components/dialogs/PathDialog";
import ProblemsTable from "../../components/tables/ProblemsTable";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import ProblemDialog from "../../components/dialogs/ProblemDialog";

class Paths extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    myPaths: PropTypes.object,
    publicPaths: PropTypes.object,
    selectedPathId: PropTypes.string,
    ui: PropTypes.object
  };

  state = { tabIndex: 0 };

  onAddPathClick = () => this.props.dispatch(pathDialogShow());
  selectPath = pathId => this.props.dispatch(pathSelect(pathId));
  onAddProblemClick = () => this.props.dispatch(pathProblemDialogShow());

  render() {
    const { myPaths, publicPaths, dispatch, ui, selectedPathId } = this.props;

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
            <List
              component="nav"
              subheader={
                <ListSubheader component="div">Private Paths</ListSubheader>
              }
            >
              <ListItem
                button
                onClick={() => this.selectPath("")}
                style={
                  (!selectedPathId && {
                    background: "rgba(0, 0, 0, 0.14)"
                  }) ||
                  {}
                }
              >
                <ListItemText inset primary="Default path" />
              </ListItem>
              {Object.keys(myPaths || {})
                .map(id => ({ ...myPaths[id], id }))
                .map(path => (
                  <ListItem
                    button
                    key={path.id}
                    onClick={() => this.selectPath(path.id)}
                    style={
                      (selectedPathId === path.id && {
                        background: "rgba(0, 0, 0, 0.14)"
                      }) ||
                      {}
                    }
                  >
                    <ListItemText inset primary={path.name} />
                  </ListItem>
                ))}
            </List>
            {publicPaths && (
              <List
                component="nav"
                subheader={
                  <ListSubheader component="div">Public Paths</ListSubheader>
                }
              >
                <ListItem button>
                  <ListItemText inset primary="Default path" />
                </ListItem>
              </List>
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
            <ProblemsTable dispatch={dispatch} problems={{}} />
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
  publicPaths: state.firebase.data.publicPaths
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
        }
      ]
    );
  }),
  connect(mapStateToProps)
)(Paths);
