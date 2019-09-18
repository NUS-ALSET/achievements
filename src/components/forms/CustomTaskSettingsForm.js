/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import AddIcon from "@material-ui/icons/Add";

import { CustomTaskEditor } from "./CustomTaskEditor";
import { MenuItem } from "@material-ui/core";

// Every custom task has to have `editable`, `hidden` and `shown` blocks at least
const CUSTOM_REQUIRED_BLOCKS_COUNT = 3;

export class CustomTaskSettingsForm extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    taskInfo: PropTypes.object
  };
  state = {
    isChanged: false,
    changes: {
      type: "custom"
    }
  };
  render() {
    const { taskInfo } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="custom-task-name"
            label="Name"
            onChange={this.onChangeField("name")}
            value={taskInfo.name || ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="custom-task-url"
            label="URL"
            onChange={this.onChangeField("url")}
            value={taskInfo.url || ""}
          />
        </Grid>
        <Grid id="custom-task-fallback" item xs={6}>
          <TextField
            fullWidth
            label="Fallback mode"
            onChange={this.onChangeField("fallback")}
            select
            value={taskInfo.fallback || "ipynb"}
          >
            <MenuItem value="ipynb">ipynb</MenuItem>
            <MenuItem value="json">JSON</MenuItem>
            <MenuItem value="html">HTML</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </TextField>
        </Grid>
        {taskInfo.json.cells.map(block => (
          <CustomTaskEditor
            block={block}
            key={
              block.metadata.achievements.type +
              block.metadata.achievements.index
            }
            onChange={this.onChangeNotebook}
            onRemove={
              block.metadata.achievements.index !== undefined
                ? this.onBlockRemove
                : undefined
            }
          />
        ))}
        <Button id="custom-task-add-button" onClick={this.onAddBlock}>
          Add more blocks to Introduction section <AddIcon />
        </Button>
      </React.Fragment>
    );
  }

  onChangeNotebook = (field, changedBlock) => value => {
    const { onChange, taskInfo } = this.props;

    // Process value from React.ChangeEvent<HTMLInputElement>
    if (value.target && value.target.value) {
      value = value.target.value;
    }

    let json;
    switch (field) {
      case "title":
        json = { ...taskInfo.json };
        json.cells = json.cells.map(block =>
          block === changedBlock
            ? {
                ...block,
                metadata: {
                  ...block.metadata,
                  achievements: {
                    ...block.metadata.achievements,
                    title: value
                  }
                }
              }
            : block
        );
        break;
      case "content":
        json = { ...taskInfo.json };
        json.cells = json.cells.map(block =>
          block === changedBlock
            ? {
                ...block,
                source: [value]
              }
            : block
        );
        break;
      case "mode":
        json = { ...taskInfo.json };
        if (value !== "markdown") {
          json.metadata.language_info = {
            name: value
          };
          json.metadata.kernelspec = {
            language: value,
            display_name: value
          };
        }
        json.cells = json.cells.map(block =>
          block === changedBlock ||
          !(value === "markdown" || block.cell_type === "text")
            ? {
                ...block,
                cell_type: value === "markdown" ? "text" : "code",
                metadata: {
                  ...block.metadata,
                  achievements: {
                    ...block.metadata.achievements,
                    language_info: {
                      name: value
                    }
                  }
                }
              }
            : block
        );
        break;
      default:
    }

    const change = {
      changes: {
        ...this.state.changes,
        json: json || taskInfo.json
      },
      isChanged: true
    };

    this.setState(change);
    onChange(change);
  };

  onAddBlock = () => {
    const { onChange, taskInfo } = this.props;

    const change = {
      changes: {
        ...this.state.changes,
        json: {
          ...taskInfo.json,
          cells: taskInfo.json.cells.concat([
            {
              cell_type: "code",
              metadata: {
                colab_type: "code",
                achievements: {
                  title: "Public Block",
                  language_info: {
                    name: "python"
                  },
                  type: "public",
                  index:
                    taskInfo.json.cells.length - CUSTOM_REQUIRED_BLOCKS_COUNT
                }
              },
              source: []
            }
          ])
        }
      }
    };
    this.setState(change);
    onChange(change);
  };

  onBlockRemove = targetBlock => {
    const { onChange, taskInfo } = this.props;
    const change = {
      changes: {
        ...this.state.changes,
        json: {
          ...taskInfo.json,
          cells: taskInfo.json.cells.filter(block => block !== targetBlock)
        }
      }
    };
    this.setState(change);
    onChange(change);
  };

  onChangeField = field => e => {
    const change = {
      changes: { ...this.state.changes, [field]: e.target.value },
      isChanged: true
    };
    this.setState(change);
    this.props.onChange(change);
  };
}
