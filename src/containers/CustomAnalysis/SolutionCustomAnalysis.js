/**
 * @file Solution Custom Analysis container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 01.08.19
 */

import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

import isEmpty from "lodash/isEmpty";

import {
  customAnalysisOpen,
  solutionClearRequest,
  addCustomAnalysisRequest,
  updateCustomAnalysisRequest,
  deleteCustomAnalysisRequest,
  analyseRequest
} from "./actions";

// Import components
import CustomAnalysisMenu from "../../components/menus/CustomAnalysisMenu";
import AddCustomAnalysisDialog from "../../components/dialogs/AddCustomAnalysisDialog";
import ModifyCustomAnalysisDialog from "../../components/dialogs/ModifyCustomAnalysisDialog";
import { CustomTaskResponseForm } from "../../components/forms/CustomTaskResponseForm";

// Import MaterialUI components
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
  activitySelection: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #d3d4d5"
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  buttonContainer: {
    textAlign: "center"
  },
  analyseButton: {
    display: "inline-block"
  },
  analysisTypeSelection: {
    marginLeft: 10
  },
  hidden: {
    display: "none"
  }
});

class SolutionCustomAnalysis extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    addCustomAnalysis: PropTypes.func,
    deleteCustomAnalysis: PropTypes.func,
    onAnalyse: PropTypes.func,
    onOpen: PropTypes.func,
    myPaths: PropTypes.object,
    myCourses: PropTypes.any,
    myActivities: PropTypes.any,
    myAssignments: PropTypes.any,
    myAnalysis: PropTypes.object,
    analysisResults: PropTypes.object,
    solutionsSelected: PropTypes.array
  };

  state = {
    type: "Path",
    pathID: "",
    courseID: "",
    activityID: "",
    assignmentID: "",
    analysisID: "",
    pathName: "",
    courseName: "",
    activityName: "",
    assignmentName: "",
    analysisName: "",
    activityOptions: [],
    displayResponse: "Clear"
  };

  constructor(props) {
    super(props);

    this.listHandler = this.listHandler.bind(this);
    this.addCustomAnalysisHandler = this.addCustomAnalysisHandler.bind(this);
    this.updateCustomAnalysisHandler = this.updateCustomAnalysisHandler.bind(
      this
    );
    this.deleteCustomAnalysisHandler = this.deleteCustomAnalysisHandler.bind(
      this
    );
  }

  componentDidMount() {
    this.props.onOpen();
  }

  listHandler(listType, listValue) {
    let data = {};
    switch (listType) {
      case "Type":
        data =
          this.state.type === "Path"
            ? {
                pathID: listValue.id,
                pathName: listValue.name,
                courseID: ""
              }
            : {
                pathID: "",
                courseID: listValue.id,
                courseName: listValue.name
              };
        break;
      case "Activity":
        data =
          this.state.type === "Path"
            ? {
                activityID: listValue.id,
                activityName: listValue.name,
                assignmentID: ""
              }
            : {
                activityID: "",
                assignmentID: listValue.id,
                assignmentName: listValue.name
              };
        break;
      case "Analysis":
        data = { analysisID: listValue.id, analysisName: listValue.name };
        break;
      default:
        break;
    }
    this.setState({ ...this.state, ...data }, () =>
      this.setActivityOptions(this.calcActivityOptions())
    );
  }

  addCustomAnalysisHandler(url, name) {
    this.props.addCustomAnalysis(url, name);
  }

  deleteCustomAnalysisHandler(analysisID) {
    this.props.deleteCustomAnalysis(analysisID);
  }
  updateCustomAnalysisHandler(analysisID) {
    this.props.updateCustomAnalysis(analysisID);
  }

  handleChange = event => {
    this.resetState();
    this.setType(event.target.value);
  };

  handleSubmit = () => {
    this.setState({ ...this.state, displayResponse: "Loading" });
    switch (this.state.type) {
      case "Path":
        this.props.onAnalyse(
          this.state.type,
          this.state.pathID,
          this.state.activityID,
          this.state.analysisID
        );
        break;
      case "Course":
        this.props.onAnalyse(
          this.state.type,
          this.state.courseID,
          this.state.assignmentID,
          this.state.analysisID
        );
        break;
      default:
        break;
    }
  };
  handleClear = () => {
    this.setState({ displayResponse: "Clear" });
    this.props.onClear();
  };

  setType = type => {
    this.setState({ ...this.state, type: type });
  };

  setActivityOptions = options => {
    this.setState({ ...this.state, activityOptions: options });
  };

  getTaskInfo = analysisResults => {
    if (analysisResults && !isEmpty(analysisResults)) {
      let results = analysisResults.results
        ? analysisResults.results
        : analysisResults.result;
      if (results) {
        return {
          response: {
            data: {
              isComplete: results.isComplete,
              jsonFeedback: results.jsonFeedback,
              htmlFeedback: results.htmlFeedback,
              textFeedback: results.textFeedback,
              ipynbFeedback: analysisResults.ipynb,
              analysisInput: this.props.solutionsSelected
            }
          }
        };
      } else {
        return {
          response: {
            data: {
              isComplete: false,
              jsonFeedback: "",
              htmlFeedback: "Please write into results.json file.",
              textFeedback: "",
              ipynbFeedback: analysisResults.ipynb,
              analysisInput: this.props.solutionsSelected
            }
          }
        };
      }

      //this.setState({ displayResponse: "Loaded" });
    }
    return {
      response: {
        data: {
          isComplete: false,
          jsonFeedback: { dummyKey: "dummyValue" },
          htmlFeedback: "<h1>Sample HTML Response</h1>",
          textFeedback: "Sample Text Response",
          analysisInput: this.props.solutionsSelected
        }
      }
    };
  };

  resetState = () => {
    this.setState({
      ...this.state,
      type: "Path",
      pathID: "",
      courseID: "",
      activityID: "",
      assignmentID: "",
      analysisID: "",
      activityOptions: []
    });
  };

  calcActivityOptions = () => {
    if (this.state.type === "Path") {
      if (this.state.pathID) {
        for (let key in this.props.myActivities) {
          if (this.state.pathID === this.props.myActivities[key].id) {
            return this.props.myActivities[key].activities;
          }
        }
        return [];
      } else {
        return [];
      }
    } else {
      if (this.state.courseID) {
        for (let key in this.props.myAssignments) {
          if (this.state.courseID === this.props.myAssignments[key].id) {
            return this.props.myAssignments[key].assignments;
          }
        }
        return [];
      } else {
        return [];
      }
    }
  };
  getCustomResponseForm = () => {
    if (this.props.analysisResults && !isEmpty(this.props.analysisResults)) {
      const taskInfo = this.getTaskInfo(this.props.analysisResults);
      return <CustomTaskResponseForm taskInfo={taskInfo} />;
    } else {
      return (
        <LinearProgress
          className={
            this.state.displayResponse === "Loading"
              ? ""
              : this.props.classes.hidden
          }
        />
      );
    }
  };

  changeTabIndex = (event, tabIndex) => this.setState({ tabIndex });

  isValid = () => {
    let check = false;
    switch (this.state.type) {
      case "Path":
        check =
          this.state.pathID && this.state.activityID && this.state.analysisID
            ? true
            : false;
        break;
      case "Course":
        check =
          this.state.courseID &&
          this.state.assignmentID &&
          this.state.analysisID
            ? true
            : false;
        break;
      default:
        check = false;
        break;
    }
    return check;
  };

  render() {
    const {
      classes,
      myPaths,
      myCourses,
      //myActivities,
      //myAssignments,
      myAnalysis
    } = this.props;
    return (
      <div>
        <div>
          <Table className={classes.table} size="small" padding="checkbox">
            <TableHead>
              <TableRow>
                <TableCell>Type*</TableCell>
                <TableCell align="left">Select activity type*</TableCell>
                <TableCell align="left">Select {this.state.type}*</TableCell>
                <TableCell align="left">
                  Select{" "}
                  {this.state.type === "Path" ? "Activity*" : "Assignment*"}
                </TableCell>
                <TableCell align="left" colSpan={2}>
                  Select / Add Analysis*
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="menu-options">
                <TableCell component="th" scope="row">
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <RadioGroup
                      aria-label="Type"
                      name="type1"
                      className={classes.group}
                      value={this.state.type}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel
                        value="Path"
                        control={<Radio />}
                        label="Path"
                      />
                      <FormControlLabel
                        value="Course"
                        control={<Radio />}
                        label="Course"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <RadioGroup
                      aria-label="activity type"
                      name="activity type"
                      className={classes.group}
                      value={this.state.type}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel
                        value="Path"
                        control={<Radio color="primary" />}
                        label="Activity"
                      />
                      <FormControlLabel
                        value="Course"
                        control={<Radio color="primary" />}
                        label="Assignment"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <CustomAnalysisMenu
                    classes={classes}
                    listHandler={this.listHandler}
                    type={this.state.type}
                    listType={"Type"}
                    menuContent={
                      this.state.type === "Path" ? myPaths : myCourses
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <CustomAnalysisMenu
                    classes={classes}
                    listHandler={this.listHandler}
                    type={this.state.type}
                    listType={"Activity"}
                    menuContent={this.state.activityOptions}
                  />
                </TableCell>
                <TableCell align="right">
                  <CustomAnalysisMenu
                    classes={classes}
                    listHandler={this.listHandler}
                    type={this.state.type}
                    listType={"Analysis"}
                    menuContent={myAnalysis}
                  />
                </TableCell>
                <TableCell align="left">
                  <AddCustomAnalysisDialog
                    classes={classes}
                    addCustomAnalysisHandler={this.addCustomAnalysisHandler}
                  />
                  <br />
                  <ModifyCustomAnalysisDialog
                    classes={classes}
                    myAnalysis={myAnalysis}
                    listHandler={this.listHandler}
                    updateCustomAnalysisHandler={
                      this.updateCustomAnalysisHandler
                    }
                    deleteCustomAnalysisHandler={
                      this.deleteCustomAnalysisHandler
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <div>
            <div className={classes.buttonContainer}>
              <Button
                className={classes.analyseButton}
                color="primary"
                disabled={!this.isValid()}
                onClick={this.handleSubmit}
                variant="contained"
              >
                ANALYSE
              </Button>
              &nbsp;&nbsp;
              <Button
                className={classes.analyseButton}
                variant="contained"
                onClick={this.handleClear}
                color="default"
              >
                CLEAR
              </Button>
            </div>
          </div>
          <br />
          <div
            className={
              this.state.displayResponse === "Clear" ? classes.hidden : ""
            }
          >
            <div>
              <Chip
                label={"Type : " + this.state.type}
                color="primary"
                className={classes.chip}
              />
              &nbsp;&nbsp;
              <Chip
                label={
                  this.state.type === "Path"
                    ? "Path : " + this.state.pathName
                    : "Course : " + this.state.courseName
                }
                color="primary"
                className={classes.chip}
              />
              &nbsp;&nbsp;
              <Chip
                label={
                  this.state.type === "Path"
                    ? "Activity : " + this.state.activityName
                    : "Assignment : " + this.state.assignmentName
                }
                color="primary"
                className={classes.chip}
              />
              &nbsp;&nbsp;
              <Chip
                label={"Analysis : " + this.state.analysisName}
                color="primary"
                className={classes.chip}
              />
            </div>
            <br />
            <div>{this.getCustomResponseForm()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  myPaths: state.customAnalysis.myPaths,
  myCourses: state.customAnalysis.myCourses,
  myActivities: state.customAnalysis.myActivities,
  myAssignments: state.customAnalysis.myAssignments,
  myAnalysis: state.firestore.data.myAnalysis,
  analysisResults: state.customAnalysis.analysisResults,
  solutionsSelected: state.customAnalysis.solutionsSelected
});

const mapDispatchToProps = {
  onOpen: customAnalysisOpen,
  addCustomAnalysis: addCustomAnalysisRequest,
  updateCustomAnalysis: updateCustomAnalysisRequest,
  deleteCustomAnalysis: deleteCustomAnalysisRequest,
  onAnalyse: analyseRequest,
  onClear: solutionClearRequest
};

export default compose(
  withStyles(styles),
  firestoreConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return firebaseAuth.isEmpty
      ? []
      : [
          {
            collection: "customAnalysis",
            where: [["uid", "==", firebaseAuth.uid]],
            storeAs: "myAnalysis"
          }
        ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SolutionCustomAnalysis);
