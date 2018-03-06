/**
 * @file Problem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 04.03.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import Jupyter from "react-jupyter";
import { withRouter } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";

import {
  problemInitRequest,
  problemSolutionRefreshRequest,
  problemSolutionSubmitRequest,
  problemSolveRequest,
  problemSolveSuccess
} from "./actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import Breadcrumbs from "../../components/Breadcrumbs";

import Button from "material-ui/Button";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from "material-ui/Dialog";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";

import withStyles from "material-ui/styles/withStyles";

const styles = theme => ({
  solutionButtons: {
    textDecoration: "none",
    float: "right",
    margin: `0 0 0 ${theme.spacing.unit}px`
  }
});

class Problem extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.any,
    solution: PropTypes.string,
    solutionKey: PropTypes.any,
    solutionJSON: PropTypes.any
  };

  componentDidMount() {
    this.props.dispatch(
      problemInitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId
      )
    );
  }

  refresh = () =>
    this.props.dispatch(
      problemSolutionRefreshRequest(this.props.match.params.problemId)
    );
  solve = () =>
    this.props.dispatch(problemSolveRequest(this.props.match.params.problemId));
  submitSolution = () =>
    this.props.dispatch(
      problemSolutionSubmitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId,
        this.props.solutionJSON
      )
    );
  closeDialog = () =>
    this.props.dispatch(
      problemSolveSuccess(this.props.match.params.problemId, "")
    );

  render() {
    const {
      classes,
      pathProblem,
      solution,
      solutionJSON,
      solutionKey
    } = this.props;

    if (pathProblem && pathProblem.problemColabURL) {
      return (
        <Fragment>
          <Breadcrumbs
            paths={[
              {
                label: "Paths",
                link: "/paths"
              },
              {
                label: pathProblem.pathName,
                link: `/paths/${this.props.match.params.pathId}`
              },
              {
                label: pathProblem.problemName
              }
            ]}
          />

          <Paper
            style={{
              padding: 24
            }}
          >
            <Typography variant="headline">Problem</Typography>
            <div
              style={{
                paddingLeft: 50
              }}
            >
              <Jupyter
                defaultStyle={true}
                loadMathjax={true}
                notebook={pathProblem.problemJSON}
                showCode={true}
              />
            </div>
            <Typography align="right" variant="caption">
              <a
                href={pathProblem.problemColabURL}
                rel="noopener noreferrer"
                target="_blank"
              >
                Link
              </a>
            </Typography>
          </Paper>
          <Paper
            style={{
              padding: 24,
              marginTop: 24
            }}
          >
            <Typography variant="headline">
              Solution{solution &&
                solutionJSON && (
                  <Fragment>
                    <Button
                      className={classes.solutionButtons}
                      onClick={this.refresh}
                      variant="raised"
                    >
                      Refresh
                    </Button>
                    <a
                      className={classes.solutionButtons}
                      href={
                        "https://colab.research.google.com/notebook#fileId=" +
                        solution
                      }
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button variant="raised">Open In Colab</Button>
                    </a>
                  </Fragment>
                )}
            </Typography>
            {solution && solutionJSON ? (
              <Fragment>
                <div
                  style={{
                    paddingLeft: 50
                  }}
                >
                  <Jupyter
                    defaultStyle={true}
                    loadMathjax={true}
                    notebook={solutionJSON}
                    showCode={true}
                  />
                </div>
                <Button
                  color="primary"
                  onClick={this.submitSolution}
                  variant="raised"
                >
                  Submit
                </Button>
              </Fragment>
            ) : (
              <Button
                color="primary"
                fullWidth
                onClick={this.solve}
                variant="raised"
              >
                Solve at Google Colaboratory
              </Button>
            )}
          </Paper>
          <Dialog onClose={this.closeDialog} open={!!solutionKey}>
            <DialogTitle>Solution</DialogTitle>
            <DialogContent
              style={{
                width: 320
              }}
            >
              <Typography>Solution created successful</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.closeDialog}>
                Close
              </Button>
              <a
                href={
                  "https://colab.research.google.com/notebook#fileId=" +
                  solutionKey
                }
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none"
                }}
                target="_blank"
              >
                <Button color="primary" variant="raised">
                  Open in Colab
                </Button>
              </a>
            </DialogActions>
          </Dialog>
        </Fragment>
      );
    }
    return <div>Loading</div>;
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  pathProblem: state.problem.pathProblem,
  solutionKey: state.problem.solutionKey,
  solutionJSON: state.problem.solutionJSON,
  solution:
    state.firebase.data.problemSolutions &&
    state.firebase.data.problemSolutions[ownProps.match.params.problemId] &&
    state.firebase.data.problemSolutions[ownProps.match.params.problemId][
      state.firebase.auth.uid
    ]
});

export default compose(
  withStyles(styles),
  withRouter,
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return (
      !firebaseAuth.isEmpty && [
        `/problemSolutions/${ownProps.match.params.problemId}/${
          firebaseAuth.uid
        }`
      ]
    );
  }),
  connect(mapStateToProps)
)(Problem);
