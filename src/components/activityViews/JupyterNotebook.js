/**
 * @file JupyterNotebook container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 09.06.18
 */
/* eslint-disable react/display-name */

import React from "react";
import PropTypes from "prop-types";
import ReactLoadable from "react-loadable";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const AceEditor = ReactLoadable({
  loader: () => import("../AceEditor"),
  loading: () => <LinearProgress />
});

const NotebookPreview = ReactLoadable({
  loader: () => import("@nteract/notebook-preview"),
  loading: () => <LinearProgress />
});

class JupyterNotebook extends React.PureComponent {
  static propTypes = {
    action: PropTypes.func,
    defaultValue: PropTypes.string,
    onCommit: PropTypes.func,
    persistent: PropTypes.bool,
    richEditor: PropTypes.bool,
    solution: PropTypes.any,
    title: PropTypes.any.isRequired,
    url: PropTypes.string,
    readOnly: PropTypes.bool
  };

  state = {
    collapsed: false,
    solution: ""
  };

  onAction = () =>
    this.state.solution &&
    this.props.action &&
    this.props.richEditor &&
    this.props.action(this.state.solution);

  onChange = e =>
    this.setState({ solution: (e && e.target && e.target.value) || e });

  onSwitchCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  getEditor = () => {
    const { action, defaultValue, readOnly, richEditor } = this.props;
    return richEditor ? (
      <AceEditor
        commands={[
          {
            name: "submit",
            bindKey: {
              win: "Shift-Enter",
              mac: "Shift-Enter",
              lin: "Shift-Enter"
            },
            exec: this.onAction
          },
          {
            name: "alt-submit",
            bindKey: {
              win: "Ctrl-Enter",
              mac: "Ctrl-Enter",
              lin: "Ctrl-Enter"
            },
            exec: this.onAction
          }
        ]}
        editorProps={{ $blockScrolling: true }}
        maxLines={20}
        minLines={10}
        mode="python"
        onChange={this.onChange}
        onLoad={editor => editor.focus()}
        readOnly={readOnly}
        style={{
          width: "100%"
        }}
        theme="github"
        value={this.state.solution || defaultValue || ""}
      />
    ) : (
      <TextField
        defaultValue={this.state.solution || defaultValue || ""}
        disabled={readOnly}
        fullWidth
        InputLabelProps={{
          style: {
            top: 24,
            left: 24
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                color="primary"
                onClick={() => action(this.state.solution)}
                style={{
                  marginBottom: 4
                }}
              >
                Run
              </Button>
            </InputAdornment>
          )
        }}
        label="Enter the url to your public solution on Colab"
        onChange={this.onChange}
        style={{ padding: 24, position: "relative" }}
      />
    );
  };

  render() {
    const { action, persistent, richEditor, solution, title, url } = this.props;
    return (
      <Paper style={{ margin: "24px 2px" }}>
        <Typography
          style={{
            position: "relative"
          }}
          variant="h5"
        >
          <span>{title}</span>
          {url && (
            <IconButton
              style={{
                position: "absolute",
                right: 48
              }}
            >
              <a
                href={url}
                rel="noopener noreferrer"
                style={{ position: "absolute", top: 10 }}
                target="_blank"
              >
                <OpenInNewIcon />
              </a>
            </IconButton>
          )}
          {persistent ? (
            <Button
              color="primary"
              disabled={!(this.state.solution && action && richEditor)}
              onClick={this.onAction}
              style={{
                position: "absolute",
                top: 4,
                right: 4
              }}
            >
              Run
            </Button>
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
        <br />
        {solution !== null && action && this.getEditor()}
        {solution && solution.json && (
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
