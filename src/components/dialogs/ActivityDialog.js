/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloudDownload from "@material-ui/icons/CloudDownload";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { PROBLEMS_TYPES, YOUTUBE_QUESTIONS } from "../../services/paths";
import { APP_SETTING } from "../../achievementsApp/config";

const fetchDirectoryStructureFromGitub = url => {
  return fetch(`${url}?access_token=${APP_SETTING.GITHUB_ACCESS_TOKEN}`).then(
    response => response.json()
  );
};

class ActivityDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    pathId: PropTypes.string.isRequired,
    paths: PropTypes.array,
    problems: PropTypes.array,
    problem: PropTypes.object,
    uid: PropTypes.string.isRequired
  };

  state = {
    problem: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.problem) {
      this.setState({
        problem: nextProps.problem || {},
        type: nextProps.problem.type,
        name: nextProps.problem.name,
        githubURL: nextProps.problem.githubURL
      });
    }
  }
  getTypeSpecificElements() {
    let { problem } = this.props;
    problem = Object.assign(problem || {}, this.state);
    switch (this.state.type || (problem && problem.type) || "text") {
      case PROBLEMS_TYPES.text.id:
        return (
          <TextField
            fullWidth
            label="Question"
            margin="normal"
            onChange={e => this.onFieldChange("question", e.target.value)}
            value={problem.question}
          />
        );
      case PROBLEMS_TYPES.codeCombat.id:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-multiple-levels">Level</InputLabel>
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              input={<Input id="select-multiple-levels" />}
              margin="none"
              onChange={e => this.onFieldChange("level", e.target.value)}
              value={problem.level || ""}
            >
              {Object.keys(APP_SETTING.levels).map(id => (
                <MenuItem key={APP_SETTING.levels[id].name} value={id}>
                  {APP_SETTING.levels[id].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case PROBLEMS_TYPES.codeCombatNumber.id:
        return (
          <TextField
            fullWidth
            label="Levels amount"
            margin="normal"
            onChange={e => this.onFieldChange("count", e.target.value)}
            type="number"
            value={problem.count}
          />
        );
      case PROBLEMS_TYPES.jupyter.id:
        return (
          <Fragment>
            <TextField
              defaultValue={problem && problem.problemURL}
              fullWidth
              label="Problem Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              defaultValue={problem && problem.solutionURL}
              fullWidth
              label="Solution Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              defaultValue={problem && problem.frozen}
              fullWidth
              label="Number of frozen cells"
              margin="dense"
              onChange={e => this.onFieldChange("frozen", e.target.value)}
              onKeyPress={this.catchReturn}
              type="number"
            />
          </Fragment>
        );
      case PROBLEMS_TYPES.jupyterInline.id:
        return (
          <Fragment>
            <TextField
              defaultValue={problem && problem.problemURL}
              fullWidth
              label="Problem Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              defaultValue={problem && problem.solutionURL}
              fullWidth
              label="Solution Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              defaultValue={problem && problem.frozen}
              fullWidth
              label="Default code block"
              margin="dense"
              onChange={e => this.onFieldChange("code", e.target.value)}
              onKeyPress={this.catchReturn}
              type="number"
            />
            <TextField
              defaultValue={problem && problem.frozen}
              fullWidth
              label="Number of frozen cells"
              margin="dense"
              onChange={e => this.onFieldChange("frozen", e.target.value)}
              onKeyPress={this.catchReturn}
              type="number"
            />
          </Fragment>
        );
      case PROBLEMS_TYPES.youtube.id:
        return (
          <Fragment>
            <TextField
              defaultValue={problem && problem.youtubeURL}
              fullWidth
              label="YouTube URL"
              margin="dense"
              onChange={e => this.onFieldChange("youtubeURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <FormControl
              component="fieldset"
              style={{
                marginTop: 24
              }}
            >
              <FormLabel component="legend">Follow Up Questions</FormLabel>
              <FormHelperText>
                Select one or more of the questions below
              </FormHelperText>

              <FormGroup>
                {Object.keys(YOUTUBE_QUESTIONS).map(questionType => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          this.state[questionType] ||
                          (this.state[questionType] === undefined &&
                            problem[questionType])
                        }
                        color="primary"
                        onChange={e =>
                          this.onFieldChange(questionType, e.target.checked)
                        }
                      />
                    }
                    key={questionType}
                    label={YOUTUBE_QUESTIONS[questionType]}
                  />
                ))}
                <TextField
                  defaultValue={problem && problem.customText}
                  disabled={
                    this.state.questionCustom === undefined
                      ? !(problem && problem.questionCustom)
                      : !this.state.questionCustom
                  }
                  fullWidth
                  label="Custom question"
                  onChange={e =>
                    this.onFieldChange("customText", e.target.value)
                  }
                />
              </FormGroup>
            </FormControl>
          </Fragment>
        );
      case PROBLEMS_TYPES.game.id:
        return (
          <TextField
            defaultValue={problem && problem.game}
            fullWidth
            label="Game Variant"
            margin="dense"
            onChange={e => this.onFieldChange("game", e.target.value)}
            onKeyPress={this.catchReturn}
          >
            <MenuItem value="GemCollector">Gem Collector</MenuItem>
            <MenuItem value="Squad">Squad</MenuItem>
          </TextField>
        );
      case PROBLEMS_TYPES.jest.id:
        return (
          <div>
            <FormControl style={{ width: "100%" }}>
              <InputLabel htmlFor="githubURL">Github URL</InputLabel>
              <Input
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Fetch files from github."
                      onClick={this.handleGithubURLSubmit}
                    >
                      {this.state.loading ? (
                        <CircularProgress size={25} />
                      ) : (
                        <CloudDownload />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                id="githubURL*"
                onChange={e => this.onFieldChange("githubURL", e.target.value)}
                type="text"
                value={problem.githubURL || ""}
              />
            </FormControl>
            {this.state.problem &&
              this.state.problem.files && (
                <div>
                  <Typography gutterBottom variant="body2">
                    <CheckBoxIcon /> Check files to allow write access for
                    users.
                  </Typography>
                  {this.state.problem.files.map(
                    file =>
                      file.type === "file" && (
                        <ListItem button dense key={file.path} role={undefined}>
                          <Checkbox
                            checked={!file.readOnly}
                            disableRipple
                            onChange={() => this.handleReadOnlyFiles(file.path)}
                            tabIndex={-1}
                          />
                          <ListItemText primary={file.path} />
                        </ListItem>
                      )
                  )}
                </div>
              )}
          </div>
        );
      default:
    }
  }
  showLoading = () => {
    this.setState(() => ({ loading: true }));
  };
  hideLoading = () => {
    this.setState(() => ({ loading: false }));
  };
  handleReadOnlyFiles = filePath => {
    this.setState(() => ({
      problem: {
        ...this.state.problem,
        files: this.state.problem.files.map(
          file =>
            file.path === filePath
              ? { ...file, readOnly: !file.readOnly }
              : file
        )
      }
    }));
  };
  handleGithubURLSubmit = () => {
    if (this.state.loading) return;
    const { githubURL } = this.state;
    if (!githubURL.includes(APP_SETTING.GITHUB_BASE_URL)) {
      // this.showNotification('Not a Valid Github URL');
      alert("Not a Valid Github URL");
      return;
    }
    this.showLoading();

    const params = githubURL
      .replace(APP_SETTING.GITHUB_BASE_URL, "")
      .split("/");
    let repoOwner = params[0];
    let repoName = params[1];
    let subPath = "";
    if (params.length > 4) {
      for (let i = 4; i < params.length; i++) {
        subPath = `${subPath}/${params[i]}`;
      }
    }
    fetchDirectoryStructureFromGitub(
      `${
        APP_SETTING.GITHUB_SERVER_URL
      }/repos/${repoOwner}/${repoName}/contents${subPath}`
    )
      .then(files => {
        if (files && files.length) {
          // this.hideOutput();
          this.setState({
            repoDetails: {
              owner: repoOwner,
              name: repoName,
              folderPath: subPath
            },
            problem: {
              ...this.state.problem,
              githubURL,
              files: files.map(f => ({
                path: f.path,
                readOnly: true,
                type: f.type
              }))
            },
            selectedFile: null
          });
          this.fetchWholeTree(-1);
        } else {
          this.handleError();
        }
      })
      .catch(err => {
        this.handleError(err);
      });
  };
  fetchWholeTree = (fileIndex = -1) => {
    let folderToFetch = null;
    let index = 0;
    for (
      index = fileIndex + 1;
      index < this.state.problem.files.length;
      index++
    ) {
      const file = this.state.problem.files[index];
      if (file.type === "dir") {
        folderToFetch = file;
        break;
      }
    }
    if (folderToFetch) {
      fetchDirectoryStructureFromGitub(
        `${APP_SETTING.GITHUB_SERVER_URL}/repos/${
          this.state.repoDetails.owner
        }/${this.state.repoDetails.name}/contents${folderToFetch.path}`
      )
        .then(tree => {
          if (tree && tree.length) {
            this.setState({
              problem: {
                ...this.state.problem,
                files: [...this.state.problem.files, ...tree].map(f => ({
                  path: f.path,
                  readOnly: true,
                  type: f.type
                }))
              }
            });
            this.fetchWholeTree(index);
          } else {
            this.handleError();
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    } else {
      this.hideLoading();
      this.fetchWholeCode();
    }
  };

  fetchWholeCode = (fileIndex = -1) => {
    let fileToFetch = null;
    for (let index in this.state.problem.files) {
      if (this.state.problem.files.hasOwnProperty(index)) {
        const file = this.state.problem.files[index];
        if (
          file.type !== "dir" &&
          parseInt(index, 10) > parseInt(fileIndex, 10)
        ) {
          fileToFetch = { ...file, index };
          break;
        }
      }
    }
    if (fileToFetch) {
      fetch(
        `${APP_SETTING.RAW_GIT_URL}/${this.state.repoDetails.owner}/${
          this.state.repoDetails.name
        }/master/${fileToFetch.path}`
      )
        .then(response => response.text())
        .then(code => {
          this.setState({
            problem: {
              ...this.state.problem,
              files: this.state.problem.files.map(
                (f, i) => (i === fileToFetch.index ? { ...f, code } : f)
              )
            }
          });
          this.fetchWholeCode(fileToFetch.index);
        })
        .catch(err => {
          this.handleError(err);
        });
    } else {
      const firstFile = this.state.problem.files.find(f => f.type !== "dir");
      if (firstFile) {
        // Do something
      }
    }
  };
  handleError = (err = "Error occurs.") => {
    this.hideLoading();
    if (typeof err === "string") {
      alert(err);
    } else if (err.message) {
      alert(err.message);
    } else {
      alert("Error occurs");
    }
  };
  onFieldChange = (field, value) => this.setState({ [field]: value });
  onCommit = () => {
    if (this.state.type === PROBLEMS_TYPES.jest.id) {
      const { type, githubURL, problem: { files }, name } = this.state;
      this.props.onCommit(this.props.pathId, { type, githubURL, files, name });
      return;
    }
    this.props.onCommit(
      this.props.pathId,
      Object.assign(this.props.problem || {}, this.state, {
        type:
          this.state.type ||
          (this.props.problem && this.props.problem.type) ||
          "text"
      })
    );

    this.resetState();
  };

  onClose = () => {
    this.resetState();
    this.props.onClose();
  };
  resetState = () => {
    // Clear state. Render will be invoked 1 time only
    Object.keys(this.state).forEach(
      key => this.setState({ [key]: undefined }) || true
    );
    this.setState({ type: "" });
  };

  render() {
    const { problem, open } = this.props;
    return (
      <Dialog fullWidth onClose={this.onClose} open={open}>
        <DialogTitle>
          {problem && problem.id ? "Edit Problem" : "Add New Problem"}
        </DialogTitle>
        <DialogContent
          style={{
            width: "100%"
          }}
        >
          <TextField
            autoFocus
            defaultValue={problem && problem.name}
            fullWidth
            label="Name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            onKeyPress={this.catchReturn}
            required
            value={this.state.name}
          />
          <TextField
            fullWidth
            label="Type"
            margin="dense"
            onChange={e => this.onFieldChange("type", e.target.value)}
            select
            value={this.state.type || (problem && problem.type) || "text"}
          >
            {Object.keys(PROBLEMS_TYPES).map(key => (
              <MenuItem key={key} value={key}>
                {PROBLEMS_TYPES[key].caption}
              </MenuItem>
            ))}
          </TextField>
          {this.getTypeSpecificElements()}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={
              this.state.loading ||
              !this.state.name ||
              (this.state.type === PROBLEMS_TYPES.jest.id &&
                this.state.problem &&
                !this.state.problem.files)
            }
            onClick={this.onCommit}
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ActivityDialog;
