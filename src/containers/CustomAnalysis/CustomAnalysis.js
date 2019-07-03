/**
 * @file Custom Analysis container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 30.06.18
 */

import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, firestoreConnect } from "react-redux-firebase";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import {
  ANALYSE_FAIL,
  ANALYSE_SUCCESS,
  customAnalysisOpen,
  addCustomAnalysisRequest,
  deleteCustomAnalysisRequest,
  analyseRequest
} from "./actions";

// Import components
import CustomAnalysisMenu from "../../components/menus/CustomAnalysisMenu";
import AddCustomAnalysisDialog from "../../components/dialogs/AddCustomAnalysisDialog";
import DeleteCustomAnalysisDialog from "../../components/dialogs/DeleteCustomAnalysisDialog";
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

const styles = theme => ({
  activitySelection: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
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
  }
});

class CustomAnalysis extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    addCustomAnalysis: PropTypes.func,
    deleteCustomAnalysis: PropTypes.func,
    onAnalyse: PropTypes.func,
    onOpen: PropTypes.func,
    // uid: PropTypes.string,
    myPaths: PropTypes.object,
    myCourses: PropTypes.any,
    myActivities: PropTypes.any,
    myAssignments: PropTypes.any,
    myAnalysis: PropTypes.object,
    dialog: PropTypes.string,
    analysisResults: PropTypes.object
    // solutionsSelected: PropTypes.array
  };

  state = {
    type: "Path",
    pathID: "",
    courseID: "",
    activityID: "",
    assignmentID: "",
    analysisID: "",
    activityOptions: [],
    displayResponse: false
  };

  constructor(props) {
    super(props);

    this.listHandler = this.listHandler.bind(this);
    this.addCustomAnalysisHandler = this.addCustomAnalysisHandler.bind(this);
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
                courseID: ""
              }
            : {
                pathID: "",
                courseID: listValue.id
              };
        break;
      case "Activity":
        data =
          this.state.type === "Path"
            ? {
                activityID: listValue.id,
                assignmentID: ""
              }
            : {
                activityID: "",
                assignmentID: listValue.id
              };
        break;
      case "Analysis":
        data = { analysisID: listValue.id };
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

  handleChange = event => {
    this.resetState();
    this.setType(event.target.value);
  };

  handleSubmit = () => {
    this.setState({ ...this.state, displayResponse: true });
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
    this.resetState();
  };

  setType = type => {
    this.setState({ ...this.state, type: type });
  };

  setActivityOptions = options => {
    this.setState({ ...this.state, activityOptions: options });
  };

  getTaskInfo = (dialog, analysisResults) => {
    if (dialog === ANALYSE_SUCCESS && analysisResults) {
      let results = analysisResults.results
        ? analysisResults.results
        : analysisResults.result;
      let data = {
        response: {
          data: {
            isComplete: results.isComplete,
            jsonFeedback: results.jsonFeedback,
            htmlFeedback: results.htmlFeedback,
            textFeedback: results.textFeedback,
            ipynbFeedback: analysisResults.ipynb
          }
        }
      };
      return data;
    } else if (dialog === ANALYSE_FAIL && analysisResults) {
      return {
        response: {
          data: {
            isComplete: false,
            jsonFeedback: "",
            htmlFeedback: JSON.stringify(analysisResults),
            textFeedback: ""
          }
        }
      };
    } else {
      return {
        response: {
          data: {
            isComplete: false,
            jsonFeedback: "",
            htmlFeedback: "",
            textFeedback: ""
          }
        }
      };
    }
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
      activityOptions: [],
      displayResponse: false
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
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="left">Select activity type</TableCell>
              <TableCell align="left">Select {this.state.type}</TableCell>
              <TableCell align="left">
                Select {this.state.type === "Path" ? "Activity" : "Assignment"}
              </TableCell>
              <TableCell align="left" colSpan={2}>
                Select / Add Analysis
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
                  menuContent={this.state.type === "Path" ? myPaths : myCourses}
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
              <TableCell align="right">
                <AddCustomAnalysisDialog
                  classes={classes}
                  addCustomAnalysisHandler={this.addCustomAnalysisHandler}
                />
                <br />
                <DeleteCustomAnalysisDialog
                  classes={classes}
                  myAnalysis={myAnalysis}
                  listHandler={this.listHandler}
                  deleteCustomAnalysisHandler={this.deleteCustomAnalysisHandler}
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
              disabled={false}
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
        {(this.state.displayResponse &&
          this.props.dialog !== ANALYSE_SUCCESS &&
          this.props.dialog !== ANALYSE_FAIL && <LinearProgress />) ||
          (this.state.displayResponse && (
            <CustomTaskResponseForm
              taskInfo={this.getTaskInfo(
                this.props.dialog,
                this.props.analysisResults
              )}
            />
          ))}
      </div>
    );
  }
}
sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  myPaths: state.firebase.data.myPaths,
  myCourses: state.firebase.data.myCourses,
  myActivities: state.customAnalysis.myActivities,
  myAssignments: state.customAnalysis.myAssignments,
  myAnalysis: state.firestore.data.myAnalysis,
  dialog: state.customAnalysis.dialog,
  analysisResults: state.customAnalysis.analysisResults,
  solutionsSelected: state.customAnalysis.solutionsSelected
});

const mapDispatchToProps = {
  onOpen: customAnalysisOpen,
  addCustomAnalysis: addCustomAnalysisRequest,
  deleteCustomAnalysis: deleteCustomAnalysisRequest,
  onAnalyse: analyseRequest
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
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return firebaseAuth.isEmpty
      ? []
      : [
          {
            path: "/paths",
            storeAs: "myPaths",
            queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
          },
          {
            path: "/courses",
            storeAs: "myCourses",
            queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
          }
        ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CustomAnalysis);
