/* eslint-disable react/display-name */

import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Fab from "@material-ui/core/Fab";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Zoom from "@material-ui/core/Zoom";

import SaveIcon from "@material-ui/icons/Save";

import Breadcrumbs from "../../components/Breadcrumbs";
import JupyterNotebook from "../../components/activityViews/JupyterNotebook";

import { taskOpen, taskSaveRequest, taskRunRequest } from "./actions";
import { sagaInjector } from "../../services/saga";
import { sagas } from "./sagas";
import { Typography } from "@material-ui/core";

const RANDOM_RADIX = 32;

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const styles = () => ({
  fabButton: { position: "fixed", bottom: 24, right: 24 },
  previewCenter: { textAlign: "center" },
  mainColumn: { height: "100%" }
});

class Task extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      fabButton: PropTypes.string,
      mainColumn: PropTypes.string
    }),
    isRunning: PropTypes.bool,
    match: PropTypes.shape({
      params: PropTypes.shape({
        taskId: PropTypes.string
      })
    }),
    onTaskOpen: PropTypes.func,
    onTaskRunRequest: PropTypes.func,
    onTaskSaveRequest: PropTypes.func,
    presets: PropTypes.array,
    response: PropTypes.any,
    task: PropTypes.any
  };

  state = {
    changes: {},
    userView: true,
    isChanged: false,
    presetId: "basic"
  };

  componentDidMount() {
    this.props.onTaskOpen(this.props.match.params.taskId);
  }

  getBlockIndex = taskInfo => {
    const { changes } = this.state;
    let result = Math.max((changes.blockIndex || 1) - 1);

    if (!taskInfo) {
      return 0;
    }

    // Restrict current block index with 0 and max length
    result = Math.min(result, taskInfo.json.length - 1);
    result = Math.max(0, result);
    return result;
  };

  /**
   * Returns data for current task from existing task, changes and preset
   * combination
   */
  getTaskInfo = () => {
    const { match, presets, response } = this.props;
    const { changes, presetId } = this.state;
    const task = this.props.task || {};
    const preset = (presets || []).find(
      preset => preset.id === presetId || task.presetId || "basic"
    );
    let json;

    if (!preset) {
      return false;
    }

    json = changes.json || JSON.parse(task.json || preset.json).cells;
    return {
      id: match.params.id,
      editable: changes.editable || task.editable || preset.editable || false,
      hidden: {},
      isNew: match.params.id === "new",
      name: task.name || "New task",
      presetId: preset.id === presetId || task.presetId || "basic",
      blocksCount: json.length,
      type: changes.types || task.type || preset.type || "jupyter",
      json: json.map((cell, index) =>
        response
          ? {
              ...cell,
              outputs:
                response.cells[index] &&
                response.cells[index].source.join("") === cell.source.join("")
                  ? [...response.cells[index].outputs]
                  : []
            }
          : cell
      )
    };
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
      cells: taskInfo.json
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

  onChangeField = field => e =>
    this.setState({
      changes: { ...this.state.changes, [field]: e.target.value },
      isChanged: true
    });

  onChangeNotebook = (field, taskInfo) => e => {
    let json = taskInfo.json;
    const blockIndex = this.getBlockIndex(taskInfo);
    let blocksCount;

    switch (field) {
      case "blockType":
        json = json.map((cell, index) =>
          index === blockIndex
            ? {
                ...cell,
                cell_type: e.target.value,
                outputs: []
              }
            : cell
        );
        break;
      case "blocksCount":
        blocksCount = Number(e.target.value);
        blocksCount = Math.max(blocksCount, 1);
        for (let i = json.length; i < blocksCount; i += 1) {
          json.push({
            cell_type: "markdown",
            metadata: { jyputer: {} },
            source: ["New block"],
            outputs: []
          });
        }
        json = json.slice(0, blocksCount);
        break;
      case "hide":
        json = json.map((cell, index) =>
          index === blockIndex
            ? {
                ...cell,
                metadata: {
                  cellView: "form",
                  collapsed: e.target.value === "all",
                  hide: e.target.value,
                  jupyter: {
                    outputs_hidden: e.target.value === "all",
                    source_hidden: e.target.checked
                  },
                  outputs_hidden: e.target.value === "all",
                  source_hidden: ["code", "all"].includes(e.target.value)
                }
              }
            : cell
        );
        break;
      case "hidden":
        json = json.map((cell, index) =>
          index === blockIndex
            ? {
                ...cell,
                metadata: {
                  cellView: "form",
                  source_hidden: e.target.checked,
                  jupyter: {
                    source_hidden: e.target.checked
                  }
                }
              }
            : cell
        );
        break;
      case "content":
        json = json.map((cell, index) =>
          index === blockIndex
            ? {
                ...cell,
                source: [e],
                outputs: []
              }
            : cell
        );
        break;
      default:
        break;
    }
    this.setState({
      isChanged: true,
      changes: {
        ...this.state.changes,
        json
      }
    });
  };

  onUserViewChange = e =>
    this.setState({
      userView: e.target.checked
    });

  onRunClick = taskInfo => () => {
    this.props.onTaskRunRequest(
      taskInfo.id,
      taskInfo.type,
      JSON.stringify(this.generatePreview(taskInfo, true))
    );
    this.setState({
      isChanged: true
    });
  };

  onSelectPreset = presetId =>
    this.setState({
      preset: this.props.presets.find(preset => preset.id === presetId)
    });

  onSave = () => {
    const taskInfo = this.getTaskInfo();
    this.props.onTaskSaveRequest(this.props.match.params.taskId, {
      ...this.state.changes,
      presetId: taskInfo.presetId,
      type: taskInfo.type,
      json: JSON.stringify(this.generatePreview(taskInfo, false))
    });
    this.setState({
      isChanged: false
    });
  };

  render() {
    const { classes, isRunning, presets } = this.props;
    const { isChanged, userView } = this.state;
    const taskInfo = this.getTaskInfo();
    let blockIndex = this.getBlockIndex(taskInfo);
    let currentBlock;

    if (!taskInfo) {
      return <LinearProgress />;
    }

    // Pick current block with block index and task JSON
    currentBlock = taskInfo.json[blockIndex];

    return (
      <React.Fragment>
        <Breadcrumbs
          paths={[{ label: "Tasks", link: "/tasks" }, { label: taskInfo.name }]}
        />
        <Grid container spacing={8}>
          <Grid
            className={classes.mainColumn}
            container
            item
            lg={6}
            spacing={8}
            xs={12}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Jupyter settings</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Type" select value="jupyter">
                <MenuItem value="jupyter">Jupyter</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Template"
                onChange={this.onSelectPreset}
                select
                value={this.state.presetId}
              >
                {presets.map(preset => (
                  <MenuItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                defaultValue={taskInfo.isNew ? "" : taskInfo.name}
                fullWidth
                label="Name"
                onChange={this.onChangeField("name")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Current index"
                onChange={this.onChangeField("blockIndex")}
                type="number"
                value={blockIndex + 1}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Count of blocks"
                onChange={this.onChangeNotebook("blocksCount", taskInfo)}
                type="number"
                value={taskInfo.blocksCount}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Current block type"
                onChange={this.onChangeNotebook("blockType", taskInfo)}
                select
                value={currentBlock.cell_type || "markdown"}
              >
                <MenuItem value="markdown">Markdown</MenuItem>
                <MenuItem value="code">Code</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                disabled={currentBlock.cell_type !== "code"}
                fullWidth
                label="Hide"
                onChange={this.onChangeNotebook("hide", taskInfo)}
                select
                value={
                  (currentBlock.metadata && currentBlock.metadata.hide) || ""
                }
              >
                <MenuItem value="">Nothing</MenuItem>
                <MenuItem value="code">Code</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={taskInfo.editable === blockIndex}
                    onChange={e =>
                      this.onChangeField("editable")({
                        target: { value: e.target.checked ? blockIndex : false }
                      })
                    }
                  />
                }
                disabled={currentBlock.cell_type !== "code"}
                label="Editable"
              />
            </Grid>
            <Grid item xs={12}>
              <AceEditor
                maxLines={40}
                minLines={20}
                mode="python"
                onChange={this.onChangeNotebook("content", taskInfo)}
                theme="github"
                value={currentBlock.source.join("")}
              />
            </Grid>
          </Grid>
          <Grid
            className={classes.mainColumn}
            container
            item
            lg={6}
            spacing={8}
            xs={12}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Preview settings</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userView}
                    onChange={this.onUserViewChange}
                  />
                }
                label="User view"
              />
              <Button onClick={this.onRunClick(taskInfo)} variant="contained">
                Run Jupyter
              </Button>
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
          </Grid>
        </Grid>
        <Zoom in={isChanged && !isRunning}>
          <Fab
            aria-label="Add"
            className={classes.fabButton}
            color="primary"
            disabled={isRunning}
            onClick={this.onSave}
          >
            <SaveIcon />
          </Fab>
        </Zoom>
      </React.Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  isRunning: state.task.isRunning,
  presets: state.task.presets,
  task: state.task.currentTask,
  response: state.task.currentResponse
});

const mapDispatchToProps = {
  onTaskOpen: taskOpen,
  onTaskRunRequest: taskRunRequest,
  onTaskSaveRequest: taskSaveRequest
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Task);
