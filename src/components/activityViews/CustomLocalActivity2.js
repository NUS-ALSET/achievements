/* eslint-disable react/display-name */
import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import { CustomTaskResponseForm } from "../forms/CustomTaskResponseForm";

import Card from "@material-ui/core/Card";

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

class CustomLocalActivity2 extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.string,
    disabledCommitBtn: PropTypes.bool,
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

  sectionStyle = {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 48%",
    width: "100%",
    margin: "0 0.5rem 0 0.5rem"
  };
  cardStyle = {
    minWidth: "250px",
    margin: "1rem 0 0 0",
    textAlign: "left",
    padding: "1rem"
  };

  renderBlock = (block, uid) => (
    <React.Fragment
      key={block.metadata.achievements.type + block.metadata.achievements.index}
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
    </React.Fragment>
  );

  filterBlocks = (problemJSON, blockType, uid) => {
    const filteredCells = problemJSON.cells.filter(
      block =>
        block.source.join("") && block.metadata.achievements.type === blockType
    );
    return filteredCells.length === 0
      ? false
      : filteredCells.map(block => this.renderBlock(block, uid));
  };

  render() {
    const { uid, problem, solution, readOnly, disabledCommitBtn } = this.props;
    if (!problem.problemJSON) {
      return <LinearProgress />;
    }
    return (
      <Grid container spacing={8} style={{ overflowY: "auto" }}>
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
                {this.filterBlocks(problem.problemJSON, "public", uid) || (
                  <Typography variant="p">
                    Edit the code in the editable code block below to pass the
                    tests!
                  </Typography>
                )}
              </Card-content>
            </Card>
            <Card style={this.cardStyle}>
              <Card-content>
                {problem.problemJSON.cells
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
                          <Grid item xs={7}>
                            <Typography variant="h6">
                              Editable Code Block
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={5}
                            style={{
                              display: "flex",
                              justifyContent: "space-around"
                            }}
                          >
                            <Button
                              color="primary"
                              disabled={!this.state.solution}
                              onClick={this.onSolutionRunClick}
                              variant="contained"
                            >
                              Run
                            </Button>
                            {!readOnly && uid && (
                              <div
                                style={{
                                  bottom: 0,
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  position: "relative"
                                }}
                              >
                                <Button
                                  color="primary"
                                  disabled={disabledCommitBtn}
                                  onClick={this.props.onCommit}
                                  variant="contained"
                                >
                                  Commit
                                </Button>
                              </div>
                            )}
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
                {this.filterBlocks(problem.problemJSON, "shown", uid)}
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
      </Grid>
    );
  }
}

export default CustomLocalActivity2;
