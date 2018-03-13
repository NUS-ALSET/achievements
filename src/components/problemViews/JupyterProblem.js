/**
 * @file JupyterProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from "material-ui/Dialog";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";

import Jupyter from "react-jupyter";

class JupyterProblem extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.any,
    solutionJSON: PropTypes.any,
    solutionKey: PropTypes.any
  };

  render() {
    const {
      classes,
      problem,
      solution,
      solutionJSON,
      solutionKey
    } = this.props;

    return (
      <Fragment>
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
              notebook={problem.problemJSON}
              showCode={true}
            />
          </div>
          <Typography align="right" variant="caption">
            <a
              href={problem.problemColabURL}
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
}

export default JupyterProblem;
