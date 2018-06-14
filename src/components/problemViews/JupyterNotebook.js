/**
 * @file JupyterNotebook container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 09.06.18
 */

import React from "react";
import PropTypes from "prop-types";

import AceEditor from "react-ace";
import "brace/mode/python";
import "brace/theme/github";

import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/Refresh";

import NotebookPreview from "@nteract/notebook-preview";

class JupyterNotebook extends React.PureComponent {
  static propTypes = {
    action: PropTypes.func,
    defaultValue: PropTypes.string,
    persistent: PropTypes.bool,
    richEditor: PropTypes.bool,
    solution: PropTypes.any,
    title: PropTypes.string.isRequired
  };

  state = {
    collapsed: false,
    solution: ""
  };

  onChange = e =>
    this.setState({ solution: (e && e.target && e.target.value) || e });

  onSwitchCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const {
      action,
      defaultValue,
      persistent,
      richEditor,
      solution,
      title
    } = this.props;
    return (
      <Paper style={{ margin: "24px 2px" }}>
        <Typography
          style={{
            position: "relative"
          }}
          variant="headline"
        >
          <span>{title}</span>
          {persistent ? (
            action &&
            this.state.solution &&
            richEditor && (
              <IconButton
                onClick={() => action(this.state.solution)}
                style={{
                  position: "absolute",
                  right: 0
                }}
              >
                <RefreshIcon />
              </IconButton>
            )
          ) : (
            <IconButton
              onClick={this.onSwitchCollapse}
              style={{
                position: "absolute",
                right: 0
              }}
            >
              {this.state.collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Typography>
        {solution !== null &&
          action &&
          (richEditor ? (
            <AceEditor
              editorProps={{ $blockScrolling: true }}
              maxLines={20}
              minLines={10}
              mode="python"
              onChange={this.onChange}
              onLoad={editor => editor.focus()}
              theme="github"
              value={this.state.solution || defaultValue || ""}
            />
          ) : (
            <TextField
              InputLabelProps={{
                style: {
                  top: 24,
                  left: 24
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => action(this.state.solution)}>
                      <RefreshIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              defaultValue={this.state.solution || defaultValue || ""}
              fullWidth
              label="Enter the url to your public solution on Colab"
              onChange={this.onChange}
              style={{ padding: 24, position: "relative" }}
            />
          ))}
        {solution &&
          solution.json && (
            <Collapse collapsedHeight="10px" in={!this.state.collapsed}>
              <div
                style={{
                  textAlign: "left"
                }}
              >
                <NotebookPreview notebook={solution.json} />
              </div>
            </Collapse>
          )}
        {solution && solution.loading && <CircularProgress />}
      </Paper>
    );
  }
}

export default JupyterNotebook;
