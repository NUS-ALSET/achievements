/* eslint-disable max-len */
/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloudDownload from "@material-ui/icons/CloudDownload";
import LinkIcon from "@material-ui/icons/Link";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";

//import { GameActivity, TournamentActivity } from "../AddActivitiesForm/";

import {
  ACTIVITY_TYPES,
  YOUTUBE_QUESTIONS,
  CodeCombat_Multiplayer_Data,
  JEST_GIT_MAP
} from "../../services/paths";
import { APP_SETTING } from "../../achievementsApp/config";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

// images for user guide in the dialog
import JupyterNotebookStep1 from "../../assets/JupyterNotebookSampleActivityImg.png";
import JupyterNotebookStep2 from "../../assets/JupyterNotebookSolution.png";
import MultipleQuestionsForm from "../forms/MultipleQuestionsForm";

const DEFAULT_COUNT = 2;
const MAX_CELLS = 15;
/*const gameDefaultData = {
  game: "passenger-picker",
  scoreToWin: 10,
  gameTime: 120,
  unitsPerSide: 1,
  levelsToWin: 1,
  playMode: "manual control"
};*/

const styles = () => ({
  link: {
    textDecoration: "none"
  }
});
const cells = new Array(MAX_CELLS).fill().map((value, index) => index + 1);

// Required for search jupyter-related activities
const jupyterTypes = [
  ACTIVITY_TYPES.jupyter.id,
  ACTIVITY_TYPES.jupyterInline.id,
  ACTIVITY_TYPES.jupyterLocal.id
];

class AddActivityDialog extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    activityExampleSolution: PropTypes.any,
    classes: PropTypes.shape({
      link: PropTypes.string
    }),

    // temporary remove isRequired for fetchGithubFiles
    fetchGithubFiles: PropTypes.func,
    fetchGithubFilesStatus: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    pathId: PropTypes.string.isRequired,
    pathsInfo: PropTypes.any,
    restrictedType: PropTypes.oneOf([...Object.keys(ACTIVITY_TYPES), false]),
    tasks: PropTypes.any,
    thirdPartiesServices: PropTypes.any,
    thirdPartiesLevels: PropTypes.any,
    uid: PropTypes.string.isRequired
  };

  state = {
    type: "text",
    isCorrectInput: false,
    cell: []
  };

  fetchedGithubURL = "";

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((nextProps.fetchGithubFilesStatus || "").length > 0) {
      this.handelfetchGithubFilesStatus(
        nextProps.fetchGithubFilesStatus,
        nextProps.activity
      );
      return;
    }
    if ((this.props || {}).open !== nextProps.open) {
      this.resetState();
    }
    if (nextProps.activity) {
      let state = {};
      if (
        nextProps.activity.name &&
        AddName.test(nextProps.activity.name) &&
        NoStartWhiteSpace.test(nextProps.activity.name)
      ) {
        this.setState({ isCorrectInput: true });
      }
      if (
        [ACTIVITY_TYPES.jupyterInline.id, ACTIVITY_TYPES.jupyter.id].includes(
          nextProps.activity.type
        )
      ) {
        state = {
          code: nextProps.activity.code || 1,
          frozen: nextProps.activity.frozen || 1
        };
      } else if (nextProps.activity.type === ACTIVITY_TYPES.jest.id) {
        state = {
          githubURL: nextProps.activity.githubURL || "",
          files: nextProps.activity.files || []
        };
        this.fetchedGithubURL = nextProps.activity.githubURL || "";
      }
      this.setState({
        ...nextProps.activity,
        ...state
      });
    }
  }

  handelfetchGithubFilesStatus = (fetchGithubFilesStatus, activity) => {
    switch (fetchGithubFilesStatus) {
      case "SUCCESS":
        this.fetchedGithubURL = this.state.githubURL;
        this.setState({ files: activity.files || [] });
        this.hideLoading();
        break;
      case "LOADING":
        this.showLoading();
        break;
      case "ERROR":
        this.hideLoading();
        break;
      default:
        this.hideLoading();
    }
  };

  handleCellsChange = e => {
    this.setState({
      cell: e.target.value
    });
  };

  /**
   * Returns menu option by ACTIVITY_TYPES key. Required for combining jupyter
   * activites into singe option
   */
  getTypeOption = key => {
    const { activity, restrictedType } = this.props;
    const type =
      restrictedType ||
      this.state.type ||
      (activity && activity.type) ||
      "text";
    switch (key) {
      case ACTIVITY_TYPES.jupyter.id:
      case ACTIVITY_TYPES.jupyterInline.id:
      case ACTIVITY_TYPES.jupyterLocal.id:
        if (jupyterTypes.includes(type)) {
          if (key !== type) {
            return null;
          }
          return (
            <MenuItem key={key} value={key}>
              Jupyter
            </MenuItem>
          );
        } else if (key === ACTIVITY_TYPES.jupyterInline.id) {
          return (
            <MenuItem key={key} value={key}>
              Jupyter
            </MenuItem>
          );
        } else if (key === ACTIVITY_TYPES.jupyterLocal.id) {
          return (
            <MenuItem key={key} value={key}>
              Advanced Activity
            </MenuItem>
          );
        }

        break;
      default:
        return (
          <MenuItem key={key} value={key}>
            {ACTIVITY_TYPES[key].caption}
          </MenuItem>
        );
    }
  };

  getServicesList = () => {
    let { thirdPartiesServices, activity } = this.props;
    activity = Object.assign(activity || {}, this.state);
    if (!thirdPartiesServices) {
      return "Loading...";
    }
    const enabledServices = Object.keys(thirdPartiesServices).reduce(
      (res, service) => {
        if (thirdPartiesServices[service].enable) {
          res[service] = thirdPartiesServices[service];
        }
        return res;
      },
      {}
    );
    return (
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="select-multiple-services">
          Select Service
        </InputLabel>
        <Select
          input={<Input id="select-multiple-services" />}
          margin="none"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 224,
                width: 250
              }
            }
          }}
          onChange={e => this.onFieldChange("service", e.target.value)}
          value={activity.service || ""}
        >
          {Object.keys(enabledServices).map(id => (
            <MenuItem key={id} value={id}>
              {enabledServices[id].name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  getTypeSpecificElements() {
    let {
      activity,
      activityExampleSolution,
      restrictedType,
      tasks,
      thirdPartiesLevels
    } = this.props;
    let levels;
    const type =
      restrictedType ||
      this.state.type ||
      (activity && activity.type) ||
      "text";

    /* if (
      ["jupyter", "jupyterInline"].includes(type) &&
      !isLoaded(activityExampleSolution)
    ) {
      return "";
    }*/
    activity = Object.assign(activity || {}, this.state);
    switch (type) {
      case ACTIVITY_TYPES.text.id:
        return (
          <TextField
            fullWidth
            label="Question"
            margin="normal"
            onChange={e => {
              this.onFieldChange("question", e.target.value);
            }}
            value={activity.question || ""}
          />
        );
      case ACTIVITY_TYPES.feedback.id:
        return (
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            onChange={e => {
              this.onFieldChange("question", e.target.value);
            }}
            value={activity.question || ""}
          />
        );
      case ACTIVITY_TYPES.multipleQuestion.id:
        return (
          <MultipleQuestionsForm
            activity={activity}
            changes={this.state}
            onFieldChange={this.onFieldChange}
          />
        );
      case ACTIVITY_TYPES.profile.id:
        return this.getServicesList();
      case ACTIVITY_TYPES.codeCombat.id:
        levels = (thirdPartiesLevels[activity.service] || {}).levelsJSON || {};
        return (
          <Fragment>
            {this.getServicesList()}
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-multiple-levels">Level</InputLabel>
              <Select
                disabled={!activity.service}
                input={<Input id="select-multiple-levels" />}
                margin="none"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250
                    }
                  }
                }}
                onChange={e => this.onFieldChange("level", e.target.value)}
                value={activity.level || ""}
              >
                {Object.keys(levels).map((id, index) => (
                  <MenuItem key={levels[id].name + index} value={id}>
                    {levels[id].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Fragment>
        );
      case ACTIVITY_TYPES.codeCombatNumber.id:
        return (
          <Fragment>
            {this.getServicesList()}
            <TextField
              defaultValue={String(activity.count || "1")}
              fullWidth
              label="Levels amount"
              margin="normal"
              onChange={e =>
                this.onFieldChange("count", Number(e.target.value))
              }
              type="number"
              value={activity.count}
            />
          </Fragment>
        );
      case ACTIVITY_TYPES.codeCombatMultiPlayerLevel.id:
        return (
          <Fragment>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-multiplayer-team">Team</InputLabel>
              <Select
                input={<Input id="select-multiplayer-team" />}
                margin="none"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250
                    }
                  }
                }}
                onChange={e => this.onFieldChange("team", e.target.value)}
                value={activity.team || ""}
              >
                {Object.keys(CodeCombat_Multiplayer_Data.teams).map(id => (
                  <MenuItem
                    key={CodeCombat_Multiplayer_Data.teams[id].id}
                    value={id}
                  >
                    {CodeCombat_Multiplayer_Data.teams[id].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-multiplayer-level">Level</InputLabel>
              <Select
                input={<Input id="select-multiplayer-level" />}
                margin="none"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250
                    }
                  }
                }}
                onChange={e => this.onFieldChange("level", e.target.value)}
                value={activity.level || ""}
              >
                {Object.keys(CodeCombat_Multiplayer_Data.levels).map(id => (
                  <MenuItem
                    key={CodeCombat_Multiplayer_Data.levels[id].id}
                    value={id}
                  >
                    {CodeCombat_Multiplayer_Data.levels[id].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-multiplayer-percentile">
                Percentile Required
              </InputLabel>
              <Select
                input={<Input id="select-multiplayer-percentile" />}
                margin="none"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250
                    }
                  }
                }}
                onChange={e =>
                  this.onFieldChange("requiredPercentile", e.target.value)
                }
                value={activity.requiredPercentile || ""}
              >
                {CodeCombat_Multiplayer_Data.rankingPercentile.map(id => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Fragment>
        );
      case ACTIVITY_TYPES.jupyter.id:
        return (
          <Fragment>
            <TextField
              defaultValue={activity.problemURL}
              fullWidth
              label="Problem Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
            />
            <TextField
              defaultValue={(activityExampleSolution || {}).solutionURL || ""}
              fullWidth
              label="Solution Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
            />
            <TextField
              defaultValue={String(activity.frozen || "1")}
              fullWidth
              label="Number of frozen cells"
              margin="dense"
              onChange={e =>
                this.onFieldChange("frozen", Number(e.target.value))
              }
              type="number"
            />
            <Select
              input={<Input id="select-multiple-checkbox" />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              multiple
              onChange={this.handleCellsChange}
              renderValue={selected => selected.join(", ")}
              value={this.state.cell}
            >
              {cells.map(num => (
                <MenuItem key={num} value={num}>
                  <Checkbox checked={this.state.cell.indexOf(num) > -1} />
                  <ListItemText primary={num} />
                </MenuItem>
              ))}
            </Select>
          </Fragment>
        );
      case ACTIVITY_TYPES.jupyterInline.id:
        return (
          <Fragment>
            <Typography gutterBottom variant="body2">
              Jupyter Notebook Activity
            </Typography>
            <Typography gutterBottom variant="body1">
              A type of activity that requires the students to submit the python
              solution for a single code box in a Jupyter notebook. The solution
              should ensure that any relevant assertions/testing in the notebook
              pass.
            </Typography>
            <br />
            <Typography gutterBottom variant="body2">
              Step 1: Get the Shareable Link from Google Colab/github commit
              ipynb
            </Typography>
            <img alt="JupyterNotebookStep1" src={JupyterNotebookStep1} />
            <a
              href="https://colab.research.google.com/drive/1Rx_oOoslo2bbT7CY6nXmWuwzJXootjzA"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography align="center" gutterBottom variant="caption">
                Sample Google Colab ipynb Link
              </Typography>
            </a>
            <TextField
              defaultValue={activity.problemURL}
              fullWidth
              helperText="Make sure the ipynb's Link Sharing is on"
              label="Google Colab ipynb URL for this Activity"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
            />
            <Typography gutterBottom style={{ marginTop: 30 }} variant="body2">
              Step 2: Get the Shareable Link of the Solution Notebook
            </Typography>
            <img alt="JupyterNotebookStep2" src={JupyterNotebookStep2} />
            <a
              href="https://colab.research.google.com/drive/1k-Q9j1AGx3MmQ9xxATlXXggwKo5CGC7C"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography align="center" gutterBottom variant="caption">
                Sample Solution Google Colab ipynb Link
              </Typography>
            </a>
            <TextField
              defaultValue={(activityExampleSolution || {}).solutionURL || ""}
              fullWidth
              helperText="just a sample solution from you is ok"
              label="Another Google Colab ipynb URL for the Solution"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
            />
            <Typography gutterBottom style={{ marginTop: 30 }} variant="body2">
              Step 3: Select code block for solution input
            </Typography>
            <TextField
              defaultValue={String(activity.code || "1")}
              fullWidth
              label="Index of Code Block Student Can Edit Solution (Index starts from 0)"
              margin="dense"
              onChange={e => this.onFieldChange("code", Number(e.target.value))}
              type="number"
            />
            <Typography gutterBottom style={{ marginTop: 30 }} variant="body2">
              Step 4:(optional) Submit public data file
            </Typography>
            <Grid container spacing={8}>
              <Grid item xs={4}>
                <input
                  style={{ display: "none" }}
                  id="raised-button-file-public"
                  type="file"
                  onChange={this.handlePublicUpload}
                />
                <label htmlFor="raised-button-file-public">
                  <Button variant="contained" component="span" color="default">
                    Upload Public Data
                    <CloudUploadIcon />
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={8}
                style={{
                  color: "green",
                  display: "flex",
                  alignItems: "center",
                  visibility: this.state.files ? "visible" : "hidden"
                }}
              >
                <CheckIcon />
                {this.state.files && this.state.files.name}
                &nbsp;&nbsp;
                <Fab
                  size="small"
                  style={{ marginLeft: "5px" }}
                  aria-label="Delete"
                  onClick={this.onDelete}
                >
                  <DeleteIcon />
                </Fab>
              </Grid>
            </Grid>
          </Fragment>
        );
      case ACTIVITY_TYPES.jupyterLocal.id:
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Local Jupyter task"
              onChange={e => this.onFieldChange("task", e.target.value)}
              select
              value={activity.task || ""}
            >
              {Object.keys(tasks || {}).map(taskId => (
                <MenuItem key={taskId} value={taskId}>
                  {tasks[taskId].name}
                </MenuItem>
              ))}
            </TextField>
          </Fragment>
        );
      case ACTIVITY_TYPES.youtube.id:
        return (
          <Fragment>
            <TextField
              defaultValue={activity.youtubeURL}
              fullWidth
              helperText="The URL should be a clean '?v=<id>', without time start or playlist info (for example, 'https://www.youtube.com/watch?v=ZK3O402wf1c')"
              label="YouTube URL"
              margin="dense"
              onChange={e => this.onFieldChange("youtubeURL", e.target.value)}
            />
            <FormControl
              component="fieldset"
              required
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
                            activity[questionType]) ||
                          false
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
                {this.state.questionCustom === undefined
                  ? activity.questionCustom
                  : this.state.questionCustom && (
                      <TextField
                        defaultValue={activity.customText}
                        disabled={!this.state.questionCustom}
                        fullWidth
                        label="Custom question"
                        onChange={e =>
                          this.onFieldChange("customText", e.target.value)
                        }
                      />
                    )}
                {this.state.multipleQuestion === undefined
                  ? activity.multipleQuestion
                  : this.state.multipleQuestion && (
                      <MultipleQuestionsForm
                        activity={activity}
                        changes={this.state}
                        onFieldChange={this.onFieldChange}
                      />
                    )}
              </FormGroup>
            </FormControl>
          </Fragment>
        );
      /* case ACTIVITY_TYPES.game.id:
        return <GameActivity activity={activity} onFieldChange={this.onFieldChange} />;*/
      case ACTIVITY_TYPES.jest.id:
        return (
          <Fragment>
            <FormControl style={{ width: "100%" }}>
              <InputLabel htmlFor="method">Select Method</InputLabel>
              <Select
                inputProps={{
                  name: "method",
                  id: "method"
                }}
                onChange={e => this.onFieldChange("jestMethod", e.target.value)}
                value={this.state.jestMethod || ""}
              >
                <MenuItem value={"git"}>Github URL</MenuItem>
                <MenuItem value={"templates"}>Templates</MenuItem>
              </Select>
            </FormControl>
            {this.state.jestMethod === "templates" && (
              <FormControl style={{ width: "100%" }}>
                <InputLabel htmlFor="templates">Select Template</InputLabel>
                <Select
                  inputProps={{
                    name: "templates"
                  }}
                  onChange={e => {
                    this.setState(
                      {
                        githubURL: e.target.value
                      },
                      () => {
                        this.handleGithubURLSubmit();
                      }
                    );
                  }}
                  value={this.state.githubURL || ""}
                >
                  <MenuItem value={JEST_GIT_MAP.react.url}>
                    {JEST_GIT_MAP.react.id}
                  </MenuItem>
                  <MenuItem value={JEST_GIT_MAP.vue.url}>
                    {JEST_GIT_MAP.vue.id}
                  </MenuItem>
                  <MenuItem value={JEST_GIT_MAP.vanilla.url}>
                    {JEST_GIT_MAP.vanilla.id}
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {this.state.jestMethod === "git" && (
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
                  id="githubURL"
                  onChange={e =>
                    this.onFieldChange("githubURL", e.target.value)
                  }
                  type="text"
                  value={activity.githubURL || ""}
                />
              </FormControl>
            )}
            {this.props.fetchGithubFilesStatus === "LOADING" && (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "15px"
                }}
              >
                <CircularProgress />
                <p>Fetching Template...</p>
              </div>
            )}
            {this.state.files && this.state.files.length > 0 && (
              <Fragment>
                <Typography
                  gutterBottom
                  style={{ margin: "12px 0px" }}
                  variant="body2"
                >
                  <CheckBoxIcon style={{ float: "left" }} />
                  Check files to allow write access for users.
                </Typography>
                <Typography gutterBottom variant="body2">
                  {this.fetchedGithubURL && (
                    <LinkIcon style={{ float: "left" }} />
                  )}
                  &nbsp;
                  {this.fetchedGithubURL}
                </Typography>
                {this.state.files.map(
                  file =>
                    file.type === "file" && (
                      <ListItem
                        button
                        dense
                        key={file.path}
                        role={undefined}
                        style={{ padding: "0px 25px" }}
                      >
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
              </Fragment>
            )}
          </Fragment>
        );
      /*  case ACTIVITY_TYPES.gameTournament.id:
        return <TournamentActivity activity={activity} onFieldChange={this.onFieldChange} />;*/
      case ACTIVITY_TYPES.creator.id:
      case ACTIVITY_TYPES.educator.id:
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Type of required activity"
              margin="dense"
              onChange={e => this.onFieldChange("targetType", e.target.value)}
              select
              value={this.state.targetType || activity.targetType || "text"}
            >
              {Object.keys(ACTIVITY_TYPES).map(key => (
                <MenuItem key={key} value={key}>
                  {ACTIVITY_TYPES[key].caption}
                </MenuItem>
              ))}
            </TextField>
            {activity.type === ACTIVITY_TYPES.educator.id && (
              <TextField
                fullWidth
                label="Count of required solutions"
                margin="dense"
                onChange={e =>
                  this.onFieldChange("count", Number(e.target.value))
                }
                value={this.state.count || (activity.count || DEFAULT_COUNT)}
              />
            )}
          </Fragment>
        );
      default:
        return;
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
      files: this.state.files.map(file =>
        file.path === filePath ? { ...file, readOnly: !file.readOnly } : file
      )
    }));
  };

  handleGithubURLSubmit = () => {
    if (this.state.loading) return;
    this.fetchedGithubURL = "";
    this.setState({ files: [] });
    this.props.fetchGithubFiles(this.state.githubURL);
  };

  handlePublicUpload = ({ target }) => {
    const currentFile = target.files[0];
    let FileSize = currentFile.size / 1024 / 1024; // in MB
    if (FileSize > APP_SETTING.JUPYTER_FILE_UPLOAD_LIMIT) {
      alert(
        "File size exceeds " + APP_SETTING.JUPYTER_FILE_UPLOAD_LIMIT + " MB"
      );
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(currentFile);
    fileReader.onload = e => {
      let fileInfo = {
        name: currentFile.name,
        content: btoa(e.target.result)
      };
      this.setState(() => ({
        files: { ...fileInfo }
      }));
    };
  };

  isIncorrect = () => {
    const { activity } = this.props;
    if (
      (activity && activity.type === ACTIVITY_TYPES.multipleQuestion.id) ||
      this.state.type === ACTIVITY_TYPES.multipleQuestion.id
    ) {
      if (activity) {
        const options = activity.options;
        if (!(options && Object.keys(options).length)) {
          return true;
        }
      }
    }
    return (
      this.state.loading ||
      !this.state.isCorrectInput ||
      !this.state.type ||
      (this.state.type === ACTIVITY_TYPES.jest.id &&
        !(this.state.files && this.state.files.length > 0))
    );
  };

  //TODO : Delete file -> Commit -> Should delete file from problem
  onDelete = () => {
    this.setState({ files: undefined });
  };

  onPathChange = e =>
    this.setState({
      path: e.target.value
    });

  onFieldChange = (field, value) => {
    const { activity } = this.props;
    // when edit/update
    if (activity && activity.id) {
      this.setState({
        isCorrectInput: true
      });
    }
    let state = {};
    if (
      field === "type" &&
      [ACTIVITY_TYPES.jupyterInline.id, ACTIVITY_TYPES.jupyter.id].includes(
        value
      )
    ) {
      state = {
        code: 1,
        frozen: 1
      };
    }
    /* if (field === "type" && value === "game") {
      state = { ...gameDefaultData };
    }*/
    if (field === "level" && this.state.type === ACTIVITY_TYPES.codeCombat.id) {
      state = {
        name: APP_SETTING.CodeCombatLevels[value].name,
        isCorrectInput: true
      };
    }
    // validate name input
    if (field === "name") {
      if (AddName.test(value) && NoStartWhiteSpace.test(value)) {
        this.setState({
          isCorrectInput: true
        });
      } else {
        this.setState({
          isCorrectInput: false
        });
      }
    }
    this.setState({ [field]: value, ...state });
  };

  // TODO: validate required inputs at client-side for
  // other types of activities

  onCommit = () => {
    const activity = { ...this.props.activity };
    if (this.state.type === ACTIVITY_TYPES.jest.id) {
      const { type, name } = this.state;
      this.props.onCommit(this.props.pathId || this.state.path, {
        ...activity,
        type,
        name,
        githubURL: this.fetchedGithubURL,
        files: this.state.files,
        version: 1
      });
    } else {
      this.props.onCommit(
        this.props.pathId || this.state.path,
        Object.assign(activity, this.state, {
          type: this.state.type || activity.type || "text"
        })
      );
    }
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
    this.setState({
      type: this.props.restrictedType || "text",
      isCorrectInput: false,
      cell: []
    });
  };

  render() {
    const {
      activity,
      classes,
      open,
      pathId,
      pathsInfo,
      restrictedType
    } = this.props;
    const type =
      restrictedType ||
      this.state.type ||
      (activity && activity.type) ||
      "text";

    return (
      <Dialog fullWidth onClose={this.onClose} open={open}>
        <DialogTitle>
          {activity && activity.id ? "Edit Activity" : "Add New Activity"}
        </DialogTitle>
        <DialogContent
          style={{
            width: "100%"
          }}
        >
          {!pathId && (
            <TextField
              fullWidth
              label="Path"
              margin={"dense"}
              onChange={this.onPathChange}
              required
              select
              value={this.state.path || ""}
            >
              {pathsInfo.map(pathInfo => (
                <MenuItem key={pathInfo.id} value={pathInfo.id}>
                  {pathInfo.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            autoFocus
            error={!this.state.isCorrectInput}
            fullWidth
            helperText={
              this.state.isCorrectInput
                ? ""
                : "Name should not be empty or too long or have invalid characters"
            }
            label="Name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            required
            value={this.state.name || ""}
          />
          <TextField
            fullWidth
            label="Type"
            margin="dense"
            onChange={e => this.onFieldChange("type", e.target.value)}
            readOnly={!!restrictedType}
            select
            value={type}
          >
            {Object.keys(ACTIVITY_TYPES).map(key => this.getTypeOption(key))}
          </TextField>
          {jupyterTypes.includes(type) && (
            <TextField
              fullWidth
              label="Jupyter type"
              margin="dense"
              onChange={e => this.onFieldChange("type", e.target.value)}
              readOnly={!!restrictedType}
              select
              value={type}
            >
              {jupyterTypes.map(key => (
                <MenuItem key={key} value={key}>
                  {ACTIVITY_TYPES[key].caption}
                </MenuItem>
              ))}
              <Divider />
              <Link className={classes.link} to="/advanced/new">
                <MenuItem>Create in achievements</MenuItem>
              </Link>
            </TextField>
          )}
          {this.getTypeSpecificElements()}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={this.isIncorrect()}
            onClick={this.onCommit}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activityExampleSolution: (state.firebase.data.activityExampleSolutions ||
      {})[(ownProps.activity || {}).id],
    thirdPartiesServices: state.firebase.data.thirdPartyServices,
    thirdPartiesLevels: state.firebase.data.thirdPartiesLevels
  };
};

export default compose(
  withStyles(styles),
  firebaseConnect(ownProps => {
    const final = ["thirdPartyServices", "thirdPartiesLevels"];
    const activityType = (ownProps.activity || {}).type;
    if (["jupyter", "jupyterInline"].includes(activityType)) {
      final.push(`/activityExampleSolutions/${ownProps.activity.id}`);
    }
    return final;
  }),
  connect(mapStateToProps)
)(AddActivityDialog);
