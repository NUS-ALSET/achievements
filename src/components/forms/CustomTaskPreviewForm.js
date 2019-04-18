/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import HelpIcon from "@material-ui/icons/HelpOutline";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const Markdown = Loadable({
  loader: () => import("../../components/ReactMarkdown"),
  loading: () => <LinearProgress />
});

const styles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  }
};

export class CustomTaskPreviewForm extends React.PureComponent {
  static propTypes = {
    isRunning: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onTaskRunRequest: PropTypes.func,
    taskInfo: PropTypes.object,
    userView: PropTypes.bool
  };

  state = {
    solution: ""
  };

  onUserViewChange = e => {
    this.setState({ userView: e.target.checked });
    this.props.onChange({ userView: e.target.checked });
  };

  onSolutionChange = solution => this.setState({ solution });

  onTaskRunRequest = () =>
    this.props.onTaskRunRequest(
      this.props.taskInfo.id,
      this.props.taskInfo,
      this.state.solution
    );

  render() {
    const { isRunning, taskInfo, userView } = this.props;
    const { solution } = this.state;

    if (isRunning) {
      return (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      );
    }
    return (
      <React.Fragment>
        <Grid item style={styles.toolbar} xs={12}>
          <FormControlLabel
            control={
              <Checkbox checked={userView} onChange={this.onUserViewChange} />
            }
            label="User view"
          />

          <Button>
            <Typography align="right" variant="body1">
              Help
            </Typography>
            <HelpIcon style={{ marginLeft: "10px" }} />
          </Button>
        </Grid>
        {taskInfo.json.cells
          .filter(block =>
            userView
              ? !["hidden", "editable"].includes(
                  block.metadata.achievements.type
                )
              : block.metadata.achievements.type !== "editable"
          )
          .map(block => (
            <Grid
              item
              key={
                block.metadata.achievements.type +
                block.metadata.achievements.index
              }
              xs={12}
            >
              {block.cell_type === "text" ? (
                <Markdown source={block.source.join("\n")} />
              ) : (
                <AceEditor
                  maxLines={Infinity}
                  minLines={3}
                  mode={block.metadata.language_info.name}
                  readOnly={true}
                  setOptions={{ showLineNumbers: false }}
                  showGutter={true}
                  theme="github"
                  value={block.source.join("\n")}
                  width={"100%"}
                />
              )}
            </Grid>
          ))}
        {userView &&
          taskInfo.json.cells
            .filter(block => block.metadata.achievements.type === "editable")
            .map(block => (
              <Grid item key="there-should-be-only-one" xs={12}>
                <Paper style={{ margin: "24px 2px", padding: "2.5%" }}>
                  <Typography color="textSecondary">
                    Please first read the Path Activity above. <br />
                    Click the RUN button to test your solution.
                  </Typography>
                  <Grid container spacing={8}>
                    <Grid item xs={8}>
                      <Typography variant="h6">
                        Edit Your Solution Here
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        color="primary"
                        disabled={!solution}
                        onClick={this.onTaskRunRequest}
                        variant="contained"
                      >
                        Run
                      </Button>
                    </Grid>
                  </Grid>
                  <AceEditor
                    maxLines={Infinity}
                    minLines={3}
                    mode={block.metadata.language_info.name}
                    onChange={this.onSolutionChange}
                    setOptions={{ showLineNumbers: false }}
                    showGutter={true}
                    theme="github"
                    value={solution || block.source.join("\n") || ""}
                    width={"100%"}
                  />
                </Paper>
              </Grid>
            ))}
      </React.Fragment>
    );
  }
}
