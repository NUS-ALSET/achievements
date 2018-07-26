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
import RefreshIcon from "@material-ui/icons/Refresh";

import { APP_SETTING } from "../../achievementsApp/config";

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
    persistent: PropTypes.bool,
    richEditor: PropTypes.bool,
    solution: PropTypes.any,
    title: PropTypes.string.isRequired,
    url: PropTypes.string
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
      title,
      url
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
          {url && (
            <IconButton
              style={{
                position: "absolute",
                right: 48
              }}
            >
              <a
                href={url}
                style={{ position: "absolute", top: 10 }}
                target="_blank"
              >
                <OpenInNewIcon />
              </a>
            </IconButton>
          )}
          {persistent ? (
            action &&
            this.state.solution &&
            richEditor &&
            (APP_SETTING.isSuggesting ? (
              <IconButton
                onClick={() => action(this.state.solution)}
                style={{
                  position: "absolute",
                  right: 0
                }}
              >
                <RefreshIcon />
              </IconButton>
            ) : (
              <Button
                color="primary"
                onClick={() => action(this.state.solution)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4
                }}
              >
                Run
              </Button>
            ))
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
                    {APP_SETTING.isSuggesting ? (
                      <IconButton onClick={() => action(this.state.solution)}>
                        <RefreshIcon />
                      </IconButton>
                    ) : (
                      <Button
                        color="primary"
                        onClick={() => action(this.state.solution)}
                        style={{
                          marginBottom: 4
                        }}
                      >
                        Run
                      </Button>
                    )}
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
