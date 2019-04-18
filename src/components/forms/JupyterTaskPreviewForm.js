import * as React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

import withStyles from "@material-ui/core/styles/withStyles";

import JupyterNotebook from "../../components/activityViews/JupyterNotebook";

const RANDOM_RADIX = 32;

const styles = theme => ({
  toolbarButton: { marginRight: theme.spacing.unit },
  previewCenter: { textAlign: "center" }
});

class JupyterTaskPreviewForm extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      toolbarButton: PropTypes.string,
      previewCenter: PropTypes.string
    }),
    isChanged: PropTypes.bool,
    isRunning: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onTaskRunRequest: PropTypes.func,
    taskInfo: PropTypes.any.isRequired,
    userView: PropTypes.bool
  };

  state = {
    userView: true
  };

  /**
   * Returns notebook JSON in Jupyter Notebook format
   *
   * @param {Object} taskInfo
   * @param {Boolean} [persistentOnly] flag that removes cells after editable
   * @param {Boolean} [userView] flag that ignores hiding at all
   */
  generatePreview = (taskInfo, persistentOnly, userView) => {
    return {
      nbformat: 4,
      nbformat_minor: 0,
      metadata: {
        language_info: {
          name: "python"
        }
      },
      cells: taskInfo.json.cells
        .map(cell => ({
          ...cell,
          source:
            userView && cell.metadata && cell.metadata.hide === "code"
              ? []
              : cell.source,
          outputs: cell.outputs,
          metadata: {
            ...(cell.metadata || {}),
            id: Math.random().toString(RANDOM_RADIX),
            colab_type: cell.cell_type === "code" ? "code" : "text"
          }
        }))
        .filter(cell =>
          userView ? cell.metadata && cell.metadata.hide !== "all" : true
        )
        .slice(0, persistentOnly ? taskInfo.editable : undefined)
    };
  };

  getJupyterNotebookSolution = taskInfo => ({
    json: this.generatePreview(taskInfo, false, this.state.userView)
  });

  onUserViewChange = e => {
    this.setState({ userView: e.target.checked });
    this.props.onChange({ userView: e.target.checked });
  };

  onRunClick = taskInfo => () => {
    this.props.onTaskRunRequest(taskInfo.id, taskInfo);
    this.setState({
      isChanged: true
    });
  };

  render() {
    const { classes, isChanged, isRunning, taskInfo, userView } = this.props;
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox checked={userView} onChange={this.onUserViewChange} />
            }
            label="User view"
          />

          <Button
            className={classes.toolbarButton}
            onClick={this.onRunClick(taskInfo)}
            variant="contained"
          >
            Run Jupyter
          </Button>
          <Tooltip title={isChanged ? "Save Task to test it" : ""}>
            <span>
              <Button
                className={classes.toolbarButton}
                disabled={true}
                variant="contained"
              >
                Test
              </Button>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          {isRunning ? (
            <LinearProgress />
          ) : (
            <div className={classes.previewCenter}>
              <JupyterNotebook
                readOnly={true}
                solution={this.getJupyterNotebookSolution(taskInfo)}
                title="Preview"
              />
            </div>
          )}
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(JupyterTaskPreviewForm);
