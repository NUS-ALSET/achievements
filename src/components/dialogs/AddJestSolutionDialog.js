/**
 * @file AddJestSolutionDialog container module
 * @created 26:07:18
 */

import PropTypes from "prop-types";
import React from "react";

import { withStyles } from "@material-ui/core/styles";
// import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Cancel from "@material-ui/icons/CancelPresentation";

import JestRunner from "../jest-runner";

const styles = {
  root: {
    backgroundColor: "#252a31"
  },
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AddJestSolutionDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func,
    onChange: PropTypes.func,
    open: PropTypes.bool.isRequired,
    solution: PropTypes.any,
    taskId: PropTypes.string,
    classes: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    problemSolutionAttemptRequest: PropTypes.object,
    dispatch: PropTypes.func,
    isOwner: PropTypes.bool,
    onSaveProblem: PropTypes.func,
    addNewFile: PropTypes.func,
    removeFile: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.jestRunner = React.createRef();
  }

  state = {
    solution: "",
    open: true,
    editMode: false
  };

  componentDidMount() {
    // eslint-disable-next-line no-unused-expressions
    this.props.setProblemOpenTime &&
      this.props.setProblemOpenTime(
        (this.props.problem || {}).problemId,
        new Date().getTime()
      );
  }

  onChangeSolution = event => {
    this.setState({
      solution: event.target.value
    });
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, editMode: false });
    this.props.onClose();
  };

  handleSubmit = solution => {
    const finalSolution = {
      solvedFiles: solution.files.filter(f => !f.readOnly),
      testResult: solution.output
    };

    if (this.props.onChange) {
      this.props.onCommit({ type: "SOLUTION", solution: finalSolution });
    } else {
      this.props.onCommit(finalSolution, this.props.taskId);
    }
    this.handleClose();
  };

  handleEdit = () => {
    this.setState({ editMode: true });
  };

  handleSave = () => {
    this.setState({ editMode: false });
    const files = this.jestRunner.current.state.files;
    this.props.onSaveProblem(this.props.problem, files);
  };

  handleFileChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addFile = () => {
    this.props.addNewFile(this.state.name);
    this.setState({ name: "" });
  };

  render() {
    const {
      open,
      classes,
      problem,
      solution,
      readOnly,
      problemSolutionAttemptRequest,
      dispatch,
      isOwner,
      removeFile
    } = this.props;

    const { editMode } = this.state;

    return (
      <div>
        <Dialog
          className={classes.root}
          fullScreen
          onClose={this.handleClose}
          open={open}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Typography className={classes.flex} color="inherit" variant="h6">
                {problem && problem.name} {readOnly ? "( Read Only )" : ""}
              </Typography>
              <Typography color="inherit" variant="h6">
                {/* ALSET Editor */}
              </Typography>
              {isOwner && this.state.editMode && (
                <div>
                  <TextField
                    className={classes.textField}
                    id="standard-name"
                    margin="normal"
                    onChange={this.handleFileChange("name")}
                    placeholder="File Name"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      padding: "4px 10px"
                    }}
                    value={this.state.name || ""}
                  />
                  <Button
                    className={classes.button}
                    color="default"
                    disabled={this.state.name === "" || !this.state.name}
                    onClick={this.addFile}
                    style={{ margin: "18px 20px 15px 20px" }}
                    variant="contained"
                  >
                    ADD
                  </Button>
                </div>
              )}
              {isOwner && (
                <div>
                  <Button
                    className={classes.button}
                    color="default"
                    onClick={
                      this.state.editMode ? this.handleSave : this.handleEdit
                    }
                    style={{ marginRight: "20px" }}
                    variant="contained"
                  >
                    {this.state.editMode ? "SAVE" : "EDIT PROBLEM"}
                  </Button>
                  {this.state.editMode && (
                    <span
                      onClick={() => this.setState({ editMode: false })}
                      style={{ margin: "0 15px 0 0", cursor: "pointer" }}
                    >
                      <Cancel />
                    </span>
                  )}
                </div>
              )}

              {problem && (
                <Tooltip title="Open in Codesandbox">
                  <a
                    href={
                      "https://codesandbox.io/s/github/" +
                      (problem.githubURL || "").replace(
                        "https://github.com/",
                        ""
                      )
                    }
                    target="__blank"
                  >
                    <img
                      alt="Logo"
                      className="Navigation__StyledLogo-klhtd0-2 hYzIzK"
                      height="40"
                      src="data:image/png;base64,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"
                      width="40"
                    />
                  </a>
                </Tooltip>
              )}
            </Toolbar>
          </AppBar>
          {open && problem && (
            <JestRunner
              dispatch={dispatch}
              editMode={editMode}
              files={problem.files}
              onSubmit={this.handleSubmit}
              problem={problem}
              problemSolutionAttemptRequest={problemSolutionAttemptRequest}
              readOnly={readOnly}
              ref={this.jestRunner}
              removeFile={removeFile}
              solution={solution}
            />
          )}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddJestSolutionDialog);
