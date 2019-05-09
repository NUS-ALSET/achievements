/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import ReactJoyride, { STATUS } from "react-joyride";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import HelpIcon from "@material-ui/icons/HelpOutline";

import { CustomTaskResponseForm } from "./CustomTaskResponseForm";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const Markdown = Loadable({
  loader: () => import("../../components/ReactMarkdown"),
  loading: () => <LinearProgress />
});

const styles = {
  toolbar: { display: "flex", justifyContent: "space-between" },
  paper: { margin: "24px 2px", padding: "2.5%" },
  output: { color: "red" }
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
    solution: "",
    runTour: false,
    steps: [
      {
        target: "#custom-task-name",
        content: "Name for new task"
      },
      {
        target: "#custom-task-url",
        content: "URL of custom task service"
      },
      {
        target: "#custom-task-fallback",
        content: "Format of custom task service output"
      },
      {
        target: "#custom-task-mode-editable",
        content: "Mode of block. Editable and hidden blocks could be only code"
      },
      {
        target: "#custom-task-editor-editable",
        content: "Default content of block available to edit by user"
      },
      {
        target: "#custom-task-editor-hidden",
        content:
          "Block with hidden code. Usually used to validate user's solution"
      },
      {
        target: "#custom-task-editor-shown",
        content: "Displayed for user block"
      },
      {
        target: "#custom-task-add-button",
        content: "Click to add more displayed for user blocks"
      }
    ]
  };

  onJoyrideCallback = data =>
    [STATUS.FINISHED, STATUS.SKIPPED].includes(data.status) &&
    this.setState({ runTour: false });
  onSolutionChange = solution => this.setState({ solution });

  onStartTour = () => this.setState({ runTour: true });

  onTaskRunRequest = () =>
    this.props.onTaskRunRequest(
      this.props.taskInfo.id,
      this.props.taskInfo,
      this.state.solution
    );

  onUserViewChange = e => {
    this.setState({ userView: e.target.checked });
    this.props.onChange({ userView: e.target.checked });
  };

  render() {
    const { isRunning, taskInfo, userView } = this.props;
    const { runTour, solution, steps } = this.state;

    if (isRunning) {
      return (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      );
    }
    return (
      <React.Fragment>
        <ReactJoyride
          callback={this.onJoyrideCallback}
          continuous
          run={runTour}
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={steps}
          styles={{
            options: {
              zIndex: 10000
            }
          }}
        />
        <Grid item style={styles.toolbar} xs={12}>
          <FormControlLabel
            control={
              <Checkbox checked={userView} onChange={this.onUserViewChange} />
            }
            label="User view"
          />

          <Button onClick={this.onStartTour}>
            <Typography align="right" variant="body1">
              Help
            </Typography>
            <HelpIcon style={{ marginLeft: "10px" }} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {taskInfo.json.cells
            .filter(block =>
              userView
                ? block.source.join("") &&
                  !["hidden", "editable"].includes(
                    block.metadata.achievements.type
                  )
                : block.metadata.achievements.type !== "editable"
            )
            .map(block => (
              <Paper
                key={
                  block.metadata.achievements.type +
                  block.metadata.achievements.index
                }
                style={styles.paper}
              >
                {block.cell_type === "text" ? (
                  <Markdown source={block.source.join("\n")} />
                ) : (
                  <AceEditor
                    maxLines={Infinity}
                    minLines={3}
                    mode={block.metadata.achievements.language_info.name}
                    readOnly={true}
                    setOptions={{ showLineNumbers: false }}
                    showGutter={true}
                    theme="github"
                    value={block.source.join("\n")}
                    width={"100%"}
                  />
                )}
                {block.metadata.achievements.type === "shown" &&
                  block.outputs &&
                  !!block.outputs.length &&
                  block.outputs.map(
                    (output, index) =>
                      output.data && (
                        <pre key={index} style={styles.output}>
                          {output.data["text/plain"]}
                        </pre>
                      )
                  )}
              </Paper>
            ))}
        </Grid>
        {taskInfo.response && (
          <Grid item xs={12}>
            <CustomTaskResponseForm taskInfo={taskInfo} />
          </Grid>
        )}
        {userView &&
          taskInfo.json.cells
            .filter(block => block.metadata.achievements.type === "editable")
            .map(block => (
              <Grid item key="there-should-be-only-one" xs={12}>
                <Paper style={styles.paper}>
                  <Typography color="textSecondary">
                    Please first read the Path Activity above. <br />
                    Click the RUN button to test your solution.
                  </Typography>
                  <Grid container item spacing={8}>
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
                    mode={block.metadata.achievements.language_info.name}
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
