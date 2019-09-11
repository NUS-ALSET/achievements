/* eslint-disable react/display-name */
import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { CustomTaskResponseForm } from "../forms/CustomTaskResponseForm";
import {
  problemSolutionRefreshFail,
  problemSolveUpdate
} from "../../containers/Activity/actions";

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

class CustomLocalActivity extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.string,
    dispatch: PropTypes.func,
    onChange: PropTypes.func,
    onCommit: PropTypes.func,
    problem: PropTypes.any,
    readOnly: PropTypes.bool,
    solution: PropTypes.object
  };

  state = {
    solution: undefined
  };

  componentDidMount() {
    this.setState({
      open: new Date().getTime()
    });
  }

  getTaskInfo = () => ({
    response: this.props.solution.json
  });

  onSolutionChange = solution => this.setState({ solution });

  onSolutionRunClick = () => {
    const { dispatch, onChange, problem } = this.props;
    const { open, solution } = this.state;

    dispatch(problemSolutionRefreshFail());
    if (onChange) {
      onChange({ payload: solution });
    }

    return dispatch(
      problemSolveUpdate(
        problem.pathId,
        problem.problemId,
        { payload: solution },
        open
      )
    );
  };

  onTaskRunRequest = () => this.props.onCommit();

  render() {
    const { uid, problem, solution, readOnly } = this.props;
    if (!problem.problemJSON) {
      return <LinearProgress />;
    }
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {problem.problemJSON.cells
            .filter(
              block =>
                block.source.join("") &&
                !["hidden", "editable"].includes(
                  block.metadata.achievements.type
                )
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
                  <Markdown
                    source={block.source
                      .join("\n")
                      .replace(/YOUR_USER_TOKEN/g, uid.slice(0, 5))}
                  />
                ) : (
                  <AceEditor
                    maxLines={Infinity}
                    minLines={3}
                    mode={block.metadata.achievements.language_info.name}
                    readOnly={true}
                    setOptions={{ showLineNumbers: false }}
                    showGutter={true}
                    theme="github"
                    value={block.source
                      .join("\n")
                      .replace(/YOUR_USER_TOKEN/g, uid.slice(0, 5))}
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
        {solution && solution.json && (
          <Grid item xs={12}>
            <CustomTaskResponseForm taskInfo={this.getTaskInfo()} />
          </Grid>
        )}
        {problem.problemJSON.cells
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
                  readOnly={readOnly}
                  setOptions={{ showLineNumbers: false }}
                  showGutter={true}
                  theme="github"
                  value={
                    this.state.solution === undefined
                      ? (solution && solution.payload) ||
                        block.source.join("\n")
                      : this.state.solution
                  }
                  width={"100%"}
                />
              </Paper>
            </Grid>
          ))}
      </Grid>
    );
  }
}

export default CustomLocalActivity;
