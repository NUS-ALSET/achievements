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
import Typography from "@material-ui/core/Typography";

import HelpIcon from "@material-ui/icons/HelpOutline";

import Card from "@material-ui/core/Card";

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

  sectionStyle = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    margin: "0 0.5rem 0 0.5rem"
  };
  cardStyle = {
    minWidth: "250px",
    margin: "1rem 0 0 0",
    textAlign: "left",
    padding: "1rem"
  };

  filterBlocks = (taskInfo, blockType) => {
    const filteredCells = taskInfo.cells.filter(
      block =>
        block.source.join("") && block.metadata.achievements.type === blockType
    );
    return filteredCells.length === 0
      ? false
      : filteredCells.map(block => this.renderBlock(block));
  };

  renderBlock = block => (
    <React.Fragment
      key={block.metadata.achievements.type + block.metadata.achievements.index}
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
    </React.Fragment>
  );

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
        <Grid
          item
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "1rem",
            justifyContent: "center",
            overflowX: "auto"
          }}
          xs={12}
        >
          <section style={this.sectionStyle}>
            <Card style={this.cardStyle}>
              <Card-header>
                <Card-header-text>
                  <Typography variant="h6">Introduction</Typography>
                </Card-header-text>
              </Card-header>
              <Card-content>
                {this.filterBlocks(taskInfo.json, "public") || (
                  <Typography variant="p">
                    Edit the code in the editable code block below to pass the
                    tests!
                  </Typography>
                )}
              </Card-content>
            </Card>
            <Card style={this.cardStyle}>
              <Card-content>
                {taskInfo.json.cells
                  .filter(
                    block => block.metadata.achievements.type === "editable"
                  )
                  .map(block => (
                    <Grid item key="there-should-be-only-one" xs={12}>
                      <React.Fragment>
                        <Grid
                          container
                          item
                          spacing={8}
                          style={{ alignItems: "center" }}
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6">
                              Editable Code Block
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Button
                              color="primary"
                              disabled={!this.state.solution}
                              onClick={this.onSolutionRunClick}
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
                          readOnly={true}
                          setOptions={{ showLineNumbers: false }}
                          showGutter={true}
                          theme="github"
                          value={solution || block.source.join("\n") || ""}
                          width={"100%"}
                        />
                      </React.Fragment>
                    </Grid>
                  ))}
              </Card-content>
            </Card>
          </section>
          <section style={this.sectionStyle}>
            <Card style={this.cardStyle}>
              <Card-header>
                <Card-header-text>
                  <Typography variant="h6">Tests</Typography>
                </Card-header-text>
              </Card-header>
              <Card-content>
                {this.filterBlocks(taskInfo.json, "shown")}
              </Card-content>
            </Card>
            <Card style={this.cardStyle}>
              <Card-header>
                <Card-header-text>
                  <Typography variant="h6">Results</Typography>
                </Card-header-text>
              </Card-header>
              <Card-content>
                {solution && solution.json && (
                  <CustomTaskResponseForm taskInfo={this.getTaskInfo()} />
                )}
              </Card-content>
            </Card>
          </section>
        </Grid>
      </React.Fragment>
    );
  }
}
