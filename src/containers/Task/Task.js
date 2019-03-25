/* eslint-disable react/display-name */

import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import withStyles from "@material-ui/core/styles/withStyles";

import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Zoom from "@material-ui/core/Zoom";

import SaveIcon from "@material-ui/icons/Save";

import Breadcrumbs from "../../components/Breadcrumbs";
import JupyterNotebook from "../../components/activityViews/JupyterNotebook";

import { taskOpen, taskSaveRequest } from "./actions";
import { sagaInjector } from "../../services/saga";
import { sagas } from "./sagas";
import { notificationShow } from "../Root/actions";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const styles = () => ({
  fabButton: { position: "fixed", bottom: 24, right: 24 },
  previewCenter: { textAlign: "center" }
});

class Task extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      fabButton: PropTypes.string
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        taskId: PropTypes.string
      })
    }),
    presets: PropTypes.array,
    task: PropTypes.any,
    onTaskOpen: PropTypes.func,
    onTaskSaveRequest: PropTypes.func
  };

  state = {
    changes: {},
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
    const { match, presets } = this.props;
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
      isNew: match.params.id === "new",
      name: task.name || "New task",
      presetId: preset.id === presetId || task.presetId || "basic",
      blocksCount: json.length,
      json
    };
  };

  generatePreview = taskInfo => {
    return {
      nbformat: 4,
      nbformat_minor: 0,
      metadata: {},
      cells: taskInfo.json
    };
  };

  getJupyterNotebookSolution = taskInfo => ({
    json: this.generatePreview(taskInfo)
  });

  onChangeField = field => e =>
    this.setState({
      changes: { ...this.state.changes, [field]: e.target.value },
      isChanged: true
    });

  onChangeNotebook = (field, taskInfo) => e => {
    let json = taskInfo.json;

    const blockIndex = this.getBlockIndex(taskInfo);

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
      case "content":
        json = json.map((cell, index) =>
          index === blockIndex
            ? {
                ...cell,
                source: [e]
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

  onSelectPreset = presetId =>
    this.setState({
      preset: this.props.presets.find(preset => preset.id === presetId)
    });

  onSave = () => {
    const taskInfo = this.getTaskInfo();
    this.props.onTaskSaveRequest(this.props.match.params.taskId, {
      ...this.state.changes,
      presetId: taskInfo.presetId,
      json: JSON.stringify(this.generatePreview(taskInfo))
    });
    this.setState({
      isChanged: false
    });
  };

  render() {
    const { classes, presets } = this.props;
    const { isChanged } = this.state;
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
          <Grid container item spacing={8} xs={6}>
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
                defaultValue={taskInfo.blocksCount}
                fullWidth
                label="Count of blocks"
                onChange={this.onChangeNotebook("blocksCount", taskInfo)}
                type="number"
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
                label="Current block type"
                onChange={this.onChangeNotebook("blockType", taskInfo)}
                select
                value={currentBlock.cell_type || "markdown"}
              >
                <MenuItem value="markdown">Markdown</MenuItem>
                <MenuItem value="code">Code</MenuItem>
              </TextField>
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
          <Grid item xs={6}>
            <div className={classes.previewCenter}>
              <JupyterNotebook
                readOnly={true}
                solution={this.getJupyterNotebookSolution(taskInfo)}
                title="Preview"
              />
            </div>
          </Grid>
        </Grid>
        <Zoom in={isChanged}>
          <Fab
            aria-label="Add"
            className={classes.fabButton}
            color="primary"
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
  presets: state.task.presets,
  task: state.task.currentTask
});

const mapDispatchToProps = {
  onNotificationShow: notificationShow,
  onTaskOpen: taskOpen,
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
