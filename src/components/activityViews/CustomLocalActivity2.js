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
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";

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

const StyledTabs = withStyles({
  flexContainer: {
    flexWrap: "wrap"
  }
})(Tabs);

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
    solution: undefined,
    tabValue: "one"
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

  resetSolution = () => this.setState({ solution: undefined });

  sectionStyle = {
    display: "flex",
    flexDirection: "column",
    flex: "1 300px",
    width: "100%",
    margin: "0 0.5rem 0 0.5rem"
  };
  cardStyle = {
    minWidth: "250px",
    margin: 0,
    textAlign: "left",
    padding: "1rem"
  };

  renderBlock = (block, uid) => (
    <React.Fragment
      key={block.metadata.achievements.type + block.metadata.achievements.index}
    >
      {block.cell_type === "text" ? (
        <div style={{textAlign:"left"}}>
        <Markdown
          source={block.source
            .join("\n")
            .replace(/YOUR_USER_TOKEN/g, uid.slice(0, 5))}
        />
        </div>
      ) : (
        <AceEditor
          maxLines={Infinity}
          minLines={10}
          mode={block.metadata.achievements.language_info.name}
          readOnly={true}
          setOptions={{ showLineNumbers: false }}
          showGutter={true}
          style={{ margin: "1rem 0 2rem 0" }}
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

  filterBlocks = (problemJSON, blockType) => {
    const filteredCells = problemJSON.cells.filter(
      block =>
        block.source.join("") && block.metadata.achievements.type === blockType
    );
    return filteredCells.length === 0 ? false : filteredCells;
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  TabPanel = props => {
    const { children, value, index, ...other } = props;
    return (
      <div
        style={
          value !== index
            ? { display: "none", minHeight: "200px" }
            : { minHeight: "200px" }
        }
        {...other}
      >
        {children}
      </div>
    );
  };

  render() {
    const { uid, problem, solution, readOnly, disabledCommitBtn } = this.props;
    if (!problem.problemJSON) {
      return <LinearProgress />;
    }

    const introductoryBlocks = this.filterBlocks(
      problem.problemJSON,
      "public",
      uid
    );
    console.log("additionalIntroBlocks data validation")
    const additionalIntroBlocks = introductoryBlocks
      ? introductoryBlocks.slice(1)
      : [];

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
                          <Grid item xs={5}>
                            <Typography variant="h6">
                              Editable Code Block
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            style={{
                              display: "flex",
                              justifyContent: "space-around"
                            }}
                            xs={7}
                          >
                            <Button
                              color="primary"
                              disabled={!this.state.solution}
                              onClick={this.onSolutionRunClick}
                              variant="contained"
                            >
                              Run
                            </Button>
                            <Button
                              color="primary"
                              disabled={!this.state.solution}
                              onClick={this.resetSolution}
                              variant="contained"
                            >
                              Reset
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
                          minLines={10}
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
            <AppBar
              position="static"
              style={{ backgroundColor: "lightslategrey" }}
            >
              <StyledTabs
                onChange={this.handleTabChange}
                value={this.state.tabValue}
              >
                <Tab label="Introduction" value="one" />
                <Tab label="Tests" value="two" />
                {additionalIntroBlocks &&
                  additionalIntroBlocks.map((block, index) => (
                    <Tab
                      key={index}
                      label={block.metadata.achievements.title}
                      value={block.metadata.achievements.title}
                    />
                  ))}
              </StyledTabs>
            </AppBar>
            {this.TabPanel({
              value: this.state.tabValue,
              index: "one",
              children: introductoryBlocks ? (
                this.renderBlock(introductoryBlocks[0], uid)
              ) : (
                <Typography variant="p">
                  Edit the code in the editable code block below to pass the
                  tests!
                </Typography>
              )
            })}
            {this.TabPanel({
              value: this.state.tabValue,
              index: "two",
              children: (
                this.filterBlocks(problem.problemJSON, "shown", uid) || []
              ).map(filteredBlock => this.renderBlock(filteredBlock, uid))
            })}
            {additionalIntroBlocks &&
              additionalIntroBlocks.map(block =>
                this.TabPanel({
                  value: this.state.tabValue,
                  index: block.metadata.achievements.title,
                  children: this.renderBlock(block, uid)
                })
              )}
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
