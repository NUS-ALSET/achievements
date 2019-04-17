/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import AddIcon from "@material-ui/icons/Add";

import { CustomTaskEditor } from "./CustomTaskEditor";

// Every custom task has to have `hidden` and `shown` blocks at least
const CUSTOM_REQUIRED_BLOCKS_COUNT = 2;

export class CustomTaskSettingsForm extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    taskInfo: PropTypes.object
  };
  state = {
    isChanged: false,
    changes: {}
  };
  render() {
    const { taskInfo } = this.props;
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <TextField fullWidth label="preset" value={taskInfo.preset || ""} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL"
            onChange={this.onChangeField("url")}
            value={taskInfo.url || ""}
          />
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
        <Button onClick={this.onAddBlock}>
          Add more blocks <AddIcon />
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
        json.cells = json.cells.map(block =>
          block === changedBlock
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
