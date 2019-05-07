/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import FileSaver from "file-saver";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

import withStyles from "@material-ui/core/styles/withStyles";

const RANDOM_RADIX = 32;

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const styles = theme => ({
  toolbarButton: { marginRight: theme.spacing.unit },
  editableCheckbox: { marginTop: theme.spacing.unit }
});

class JupyterTaskSettingsForm extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      toolbarButton: PropTypes.string,
      editableCheckbox: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired,
    presets: PropTypes.any.isRequired,
    taskInfo: PropTypes.any.isRequired
  };

  state = {
    changes: {
      type: "jupyter"
    },
    blockIndex: 1,
    presetId: "basic",
    menuEl: document.body,
    showImportMenu: false
  };

  exportBrnRef = React.createRef();
  inputFileRef = React.createRef();

  getBlockIndex = taskInfo => {
    const { blockIndex } = this.state;
    let result = Math.max((blockIndex || 1) - 1);

    if (!taskInfo) {
      return 0;
    }

    // Restrict current block index with 0 and max length
    result = Math.min(result, taskInfo.json.cells.length - 1);
    result = Math.max(0, result);
    return result;
  };

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

  onChange = field => e => {
    this.setState({
      [field]: e.target.value
    });
  };

  onChangeField = field => e => {
    const change = {
      changes: { ...this.state.changes, [field]: e.target.value },
      isChanged: true
    };
    this.setState(change);
    this.props.onChange(change);
  };

  onChangeNotebook = (field, taskInfo) => e => {
    const { onChange } = this.props;
    const json = taskInfo.json;
    const blockIndex = this.getBlockIndex(taskInfo);
    let blocksCount;

    let cells = json.cells;

    switch (field) {
      case "blockType":
        cells = cells.map((cell, index) =>
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
        for (let i = json.cells.length; i < blocksCount; i += 1) {
          cells = [
            ...cells,
            {
              cell_type: "markdown",
              metadata: { jyputer: {} },
              source: ["New block"],
              outputs: []
            }
          ];
        }
        cells = cells.slice(0, blocksCount);
        break;
      case "editable":
        cells = cells.map((cell, index) =>
          index === blockIndex
            ? {
                ...cell,
                metadata: {
                  ...cell.metadata,
                  achievements: {
                    ...cell.metadata.achievements,
                    editable: e.target.checked
                  }
                }
              }
            : cell.metadata.achievements.editable
            ? {
                ...cell,
                metadata: {
                  ...cell.metadata,
                  achievements: {
                    ...cell.metadata.achievements,
                    editable: false
                  }
                }
              }
            : cell
        );
        break;
      case "hide":
        cells = cells.map((cell, index) =>
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
        cells = cells.map((cell, index) =>
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
        cells = cells.map((cell, index) =>
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
    const change = {
      isChanged: true,
      changes: {
        ...this.state.changes,
        json: {
          ...json,
          cells
        }
      }
    };
    this.setState(change);
    onChange(change);
  };

  onImportClick = e =>
    this.setState({ showImportMenu: true, menuEl: e.target });
  onExportClick = () => {
    const { taskInfo } = this.props;
    const result = JSON.stringify(this.generatePreview(taskInfo));

    FileSaver.saveAs(
      new Blob([result]),
      taskInfo.name.toLowerCase().replace(/\s/g, "_") + ".ipynb"
    );
  };
  onHideMenu = () => this.setState({ showImportMenu: false });

  onFileImportClick = () => {
    if (this.inputFileRef.current) {
      this.inputFileRef.current.click();
    }
    this.onHideMenu();
  };

  onFileImportRequest = e => {
    if (!e.target.files[0]) {
      return;
    }
    const reader = new FileReader();

    reader.onloadend = e => {
      try {
        const notebook = JSON.parse(e.target.result);
        if (notebook.cells && notebook.cells.length) {
          const change = {
            isChanged: true,
            changes: {
              ...this.state.changes,
              json: notebook.cells
            }
          };
          this.setState(change);
          this.props.onChange(change);
        }
      } catch (err) {
        return err;
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  render() {
    const { classes, presets, taskInfo } = this.props;
    const { menuEl, showImportMenu } = this.state;
    let blockIndex = this.getBlockIndex(taskInfo);
    let currentBlock;

    // Pick current block with block index and task JSON
    currentBlock = taskInfo.json.cells[blockIndex];

    return (
      <React.Fragment>
        <Grid item xs={6}>
          <Toolbar>
            <Button
              className={classes.toolbarButton}
              onClick={this.onImportClick}
              ref={this.exportBrnRef}
              variant="contained"
            >
              Import
            </Button>
            <Button
              className={classes.toolbarButton}
              onClick={this.onExportClick}
              variant="contained"
            >
              Export
            </Button>
          </Toolbar>
        </Grid>
        <Grid item xs={6}>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            onChange={this.onChangeField("name")}
            value={taskInfo.name || ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Template"
            onChange={this.onChangeField("presetId")}
            select
            value={taskInfo.presetId}
          >
            {presets.map(preset => (
              <MenuItem key={preset.id} value={preset.id}>
                {preset.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Current index"
            onChange={this.onChange("blockIndex")}
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
            value={taskInfo.json.cells.length}
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
            value={currentBlock.metadata.hide || ""}
          >
            <MenuItem value="">Nothing</MenuItem>
            <MenuItem value="code">Code</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <FormControlLabel
            className={classes.editableCheckbox}
            control={
              <Checkbox
                checked={currentBlock.metadata.achievements.editable || false}
                onChange={this.onChangeNotebook("editable", taskInfo)}
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
        <Menu
          anchorEl={menuEl || document.body}
          onClose={this.onHideMenu}
          open={showImportMenu}
        >
          <MenuItem onClick={this.onFileImportClick}>File</MenuItem>
          <MenuItem disabled>Google Drive</MenuItem>
        </Menu>
        <input
          hidden
          onChange={this.onFileImportRequest}
          ref={this.inputFileRef}
          type="file"
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(JupyterTaskSettingsForm);
