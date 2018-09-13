/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { firebaseConnect,isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";

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
import LinkIcon from "@material-ui/icons/Link";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { ACTIVITY_TYPES, YOUTUBE_QUESTIONS } from "../../services/paths";
import { APP_SETTING } from "../../achievementsApp/config";

// RegExp rules
import {
  AddName,
  NoStartWhiteSpace
} from "../regexp-rules/RegExpRules";

// images for user guide in the dialog
import JupyterNotebookStep1 from "../../assets/JupyterNotebookSampleActivityImg.png";
import JupyterNotebookStep2 from "../../assets/JupyterNotebookSolution.png";


const gameDefaultData = {
  game : 'passenger-picker',
  scoreToWin : 10,
  gameTime : 90,
  unitsPerSide : 1,
  levelsToWin : 1,
  playMode : 'manual control'
}
 /**
   * @param {String} timeStr input timeString eg 01:10:20
   * @returns {Number} time in second
   */
function convertTimeStrToSecond(timeStr){
  const [ hours=0, minutes=0, seconds=0 ] = timeStr.split(':').map(t=>Number(t));
  return (seconds + (hours*60 +  minutes)*60)
}
 /**
   * @param {Number | String} value time in seconds 90
   * @returns {String} eg 00:01:30
   */
function convertSecondsToTimeStr(value){
  const totalSeconds = Number(value);
  const hours = parseInt(totalSeconds/(60*60), 10);
  const minutes = parseInt((totalSeconds/60)%60, 10)
  const seconds = parseInt( (totalSeconds%60), 10)
  function getFormat(number){
    return number > 9 ? number : `0${number}`
  }
  return `${getFormat(hours)}:${getFormat(minutes)}:${getFormat(seconds)}`
}


class AddActivityDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    pathId: PropTypes.string.isRequired,
    paths: PropTypes.array,
    activity: PropTypes.object,
    uid: PropTypes.string.isRequired,
    // temporary remove isRequired for fetchGithubFiles
    fetchGithubFiles: PropTypes.func,
    fetchGithubFilesStatus : PropTypes.string
  };

  state = {
    type: "text",
    isCorrectInput: false
  };

  fetchedGithubURL = "";

  componentWillReceiveProps(nextProps) {
    if((nextProps.fetchGithubFilesStatus || '').length>0){
      this.handelfetchGithubFilesStatus(nextProps.fetchGithubFilesStatus,nextProps.activity);
      return;
    }
    if((this.props || {}).open !== nextProps.open){
      this.resetState();
    }
    if (nextProps.activity) {
      let state = {};
      if(nextProps.activity.name && AddName.test(nextProps.activity.name) && NoStartWhiteSpace.test(nextProps.activity.name)){
        this.setState({ isCorrectInput : true})
      }
      if ([ ACTIVITY_TYPES.jupyterInline.id ,ACTIVITY_TYPES.jupyter.id ].includes(nextProps.activity.type)){
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

  handelfetchGithubFilesStatus = (fetchGithubFilesStatus,activity) => {
    switch (fetchGithubFilesStatus) {
      case "SUCCESS":
        this.fetchedGithubURL = this.state.githubURL;
        this.setState({ files : activity.files || []})
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
  }

  getTypeSpecificElements() {
    let { activity, activityExampleSolution } = this.props;
    if(['jupyter','jupyterInline'].includes((activity || {}).type) && !isLoaded(activityExampleSolution)){
      return "";
    }
    console.log('activity', (activity|| {}).id)
    activity = Object.assign(activity || {}, this.state);
    switch (this.state.type || (activity && activity.type) || "text") {
      case ACTIVITY_TYPES.text.id:
        return (
          <TextField
            fullWidth
            label="Question"
            margin="normal"
            onChange={e => {
              this.onFieldChange(
                "question", e.target.value
              )
            }}
            value={activity.question || ""}
          />
        );
      case ACTIVITY_TYPES.codeCombat.id:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-multiple-levels">Level</InputLabel>
            <Select
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
              {Object.keys(APP_SETTING.levels).map(id => (
                <MenuItem key={APP_SETTING.levels[id].name} value={id}>
                  {APP_SETTING.levels[id].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case ACTIVITY_TYPES.codeCombatNumber.id:
        return (
          <TextField
            defaultValue={activity && String(activity.count || "1")}
            fullWidth
            label="Levels amount"
            margin="normal"
            onChange={e => this.onFieldChange("count", Number(e.target.value))}
            type="number"
            value={activity.count}
          />
        );
      case ACTIVITY_TYPES.jupyter.id:
        return (
          <Fragment>
            <TextField
              defaultValue={activity && activity.problemURL}
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
              defaultValue={activity && String(activity.frozen || "1")}
              fullWidth
              label="Number of frozen cells"
              margin="dense"
              onChange={e =>
                this.onFieldChange("frozen", Number(e.target.value))
              }
              type="number"
            />
          </Fragment>
        );
      case ACTIVITY_TYPES.jupyterInline.id:
        return (
          <Fragment>
            <Typography
              variant="body2"
              gutterBottom
            >
              Jupyter Notebook Activity
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
            >
              A type of activity that requires the students to submit the python solution for a single code box in a Jupyter notebook. The solution should ensure that any relevant assertions/testing in the notebook pass.
            </Typography>
            <br />
            <Typography
              variant="body2"
              gutterBottom
            >
              Step 1: Get the Shareable Link from Google Colab ipynb
            </Typography>
            <a
              href="https://colab.research.google.com/drive/1Rx_oOoslo2bbT7CY6nXmWuwzJXootjzA"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={JupyterNotebookStep1} alt="JupyterNotebookStep1" />
              <Typography
                variant="caption"
                gutterBottom
                align="center"
              >
                Sample Google Colab ipynb Link
              </Typography>
            </a>
            <TextField
              defaultValue={activity && activity.problemURL}
              fullWidth
              label="Google Colab ipynb URL for this Activity"
              helperText="Make sure the ipynb's Link Sharing is on"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
            />
            <Typography
              variant="body2"
              gutterBottom
              style={{marginTop:30}}
            >
              Step 2: Get the Shareable Link of the Solution Notebook
            </Typography>
            <a
              href="https://colab.research.google.com/drive/1k-Q9j1AGx3MmQ9xxATlXXggwKo5CGC7C"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={JupyterNotebookStep2} alt="JupyterNotebookStep2" />
              <Typography
                variant="caption"
                gutterBottom
                align="center"
              >
                Sample Solution Google Colab ipynb Link
              </Typography>
            </a>
            <TextField
              defaultValue={(activityExampleSolution || {}).solutionURL || ""}
              fullWidth
              label="Another Google Colab ipynb URL for the Solution"
              helperText="just a sample solution from you is ok"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
            />
            <Typography
              variant="body2"
              gutterBottom
              style={{marginTop:30}}
            >
              Step 3: Select code block for solution input
            </Typography>
            <TextField
              defaultValue={activity && String(activity.code || "1")}
              fullWidth
              label="Index of Code Block Student Can Edit Solution (Index starts from 0)"
              margin="dense"
              onChange={e => this.onFieldChange("code", Number(e.target.value))}
              type="number"
            />
          </Fragment>
        );
      case ACTIVITY_TYPES.youtube.id:
        return (
          <Fragment>
            <TextField
              defaultValue={activity && activity.youtubeURL}
              fullWidth
              label="YouTube URL"
              margin="dense"
              helperText="The URL should be a clean '?v=<id>', without time start or playlist info (for example, 'https://www.youtube.com/watch?v=ZK3O402wf1c')"
              onChange={e => this.onFieldChange("youtubeURL", e.target.value)}
            />
            <FormControl
              component="fieldset"
              style={{
                marginTop: 24
              }}
              required
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
                            activity[questionType])
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
                  defaultValue={activity && activity.customText}
                  disabled={
                    this.state.questionCustom === undefined
                      ? !(activity && activity.questionCustom)
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
      case ACTIVITY_TYPES.game.id:
        return (
          <div>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-games">Select Game</InputLabel>
            <Select
              input={<Input id="select-games" />}
              margin="none"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              onChange={e => this.onFieldChange("game", e.target.value)}
              value={activity.game}
            >
              {Object.keys(APP_SETTING.games).map(id => (
                <MenuItem key={APP_SETTING.games[id].name} value={id}>
                  {APP_SETTING.games[id].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-mode">Select Play Mode</InputLabel>
            <Select
              input={<Input id="select-mode" />}
              margin="none"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              onChange={e => this.onFieldChange("playMode", e.target.value)}
              value={activity.playMode}
            >
              {[{ mode : 'manual control', label : 'Manual Control' },{ mode : 'custom code', label : 'Custom Code' }].map(key => (
                <MenuItem key={key.mode} value={key.mode}>
                  {key.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-level">Select minimum level game must be won at</InputLabel>
            <Select
              input={<Input id="select-level" />}
              margin="none"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              onChange={e => this.onFieldChange("levelsToWin", e.target.value)}
              value={activity.levelsToWin}
            >
              {[1,2,3].map(key => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
              defaultValue={0}
              value={activity.unitsPerSide}
              fullWidth
              type="number"
              label="Number of units each side will have in the game."
              margin="dense"
              onChange={e => this.onFieldChange("unitsPerSide", e.target.value)}
            />
          
          <TextField
            value={activity.scoreToWin}
            defaultValue={0}
            fullWidth
            label="Score to Win"
            margin="dense"
            type="number"
            onChange={e => this.onFieldChange("scoreToWin", e.target.value)}
          />
          <TextField
            id="time"
            label="Select the maximum time limit"
            type="time"
            value={convertSecondsToTimeStr(activity.gameTime)}
            style={{ width : '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 1,
            }}
            onChange={e => this.onFieldChange("gameTime", convertTimeStrToSecond(e.target.value))}
          />
          </div>
        );
      case ACTIVITY_TYPES.jest.id:
        return (
          <Fragment>
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
                onChange={e => this.onFieldChange("githubURL", e.target.value)}
                type="text"
                value={activity.githubURL || ""}
              />
            </FormControl>
            {this.state.files &&
              this.state.files.length > 0 && (
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
                {this.state.files.map(file =>
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
                ))}
              </Fragment>
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
      files: this.state.files.map(
        file =>
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

  onFieldChange = (field, value) => {
    const { activity } = this.props;
    // when edit/update
    if (activity && activity.id) {
      this.setState({
        isCorrectInput: true
      });
    }
    let state = {};
    if (field === "type" && [ACTIVITY_TYPES.jupyterInline.id,ACTIVITY_TYPES.jupyter.id].includes(value)) {
      state = {
        code: 1,
        frozen: 1
      };
    }
    if (field === "type" && value === 'game') {
      state = { ...gameDefaultData };
    }
    if(field==="level" &&  this.state.type === ACTIVITY_TYPES.codeCombat.id){
      state={
        name : APP_SETTING.levels[value].name,
        isCorrectInput: true
      }
    }
    // validate name input
    if (field === "name") {
      if (
        AddName.test(value) &&
        NoStartWhiteSpace.test(value)
      ) {
        this.setState({
          isCorrectInput: true
        });
      } else {
        this.setState({
          isCorrectInput: false,
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
      this.props.onCommit(this.props.pathId, {
        ...activity,
        type,
        name,
        githubURL: this.fetchedGithubURL,
        files: this.state.files
      });
    } else {
      this.props.onCommit(
        this.props.pathId,
        Object.assign(activity || {}, this.state, {
          type: this.state.type || (activity && activity.type) || "text"
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
      type: "text",
      isCorrectInput: false
    });
  };

  render() {
    const { activity, open } = this.props;
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
          <TextField
            autoFocus
            fullWidth
            error={!this.state.isCorrectInput}
            helperText={this.state.isCorrectInput
              ? ""
              : "Name should not be empty or too long or have invalid characters"}
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
            select
            value={this.state.type || (activity && activity.type) || "text"}
          >
            {Object.keys(ACTIVITY_TYPES).map(key => (
              <MenuItem key={key} value={key}>
                {ACTIVITY_TYPES[key].caption}
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
              !this.state.isCorrectInput ||
              !this.state.type ||
              (this.state.type === ACTIVITY_TYPES.jest.id &&
                !(this.state.files && this.state.files.length > 0))
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

const mapStateToProps = (state, ownProps) => {
  return {
    activityExampleSolution : (state.firebase.data.activityExampleSolutions || {})[(ownProps.activity || {}).id]
  }
};

export default compose(
  firebaseConnect((ownProps, store) => {
    if(!['jupyter','jupyterInline'].includes((ownProps.activity || {}).type)){
      return false; 
    }
    return [
      `/activityExampleSolutions/${ownProps.activity.id}`,
    ];
  }),
  connect(
    mapStateToProps,
  )
)(AddActivityDialog);