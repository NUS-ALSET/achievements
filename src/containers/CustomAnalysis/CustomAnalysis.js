/**
 * @file Custom Analysis container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 22.02.18
 */

import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
//import { sagaInjector } from "../../services/saga";

// Import components
import CustomAnalysisMenu from "../../components/menus/CustomAnalysisMenu";
import AddCustomAnalysisDialog from "../../components/dialogs/AddCustomAnalysisDialog";
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
  }
});

//DONE
const pathOptions = ["Python Basics", "Path 2", "Path 3"];
const courseOptions = ["BT3103", "Course 2", "Course 3"];

//TODO
const activityOptions = ["Python Dictionary", "Activity 2", "Activity 3"];
const assignmentOptions = [
  "Submit your Lambda URL",
  "Assignment 2",
  "Assignment 3"
];
const analysisOptions = ["Default", "My new analysis"];

class CustomAnalysis extends React.PureComponent {
  constructor(props) {
    super(props);

    this.listHandler = this.listHandler.bind(this);
  }
  listHandler(key, val) {
    switch (key) {
      case "Type":
        this.setState({ ...this.state, typeID: val });
        break;
      case "Activity":
        this.setState({ ...this.state, activityID: val });
        break;
      case "Analysis":
        this.setState({ ...this.state, analysisID: val });
        break;
      default:
        break;
    }
  }

  static propTypes = {
    classes: PropTypes.object,
    myPaths: PropTypes.object,
    myCourses: PropTypes.any
  };

  state = {
    type: "Path",
    typeID: "",
    activityID: "",
    analysisID: "",
    displayResponse: false
  };

  handleChange = event => {
    this.setType(event.target.value);
  };

  setType = type => {
    this.setState({ ...this.state, type: type });
  };

  handleSubmit = () => {
    this.setState({ ...this.state, displayResponse: true });
    console.log("Submitted");
  };
  handleClear = () => {
    this.setState({ ...this.state, displayResponse: false });
  };

  getTaskInfo = () => ({
    response: {
      data: {
        isComplete: false,
        jsonFeedback:
          '{  "results": [    {      "correct": "True",      "score": "40",      "text": "Machine Learning"    },    {      "correct": "True",      "score": "30",      "text": "Artificial Intelligence"    },    {      "correct": "True",      "score": "20",      "text": "Data Structure"    },    {      "correct": "True",      "score": "10",      "text": "Web Development"    } ]}',
        htmlFeedback:
          '<!DOCTYPE html><html><head><style>#customers {  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;  border-collapse: collapse;  width: 100%;}#customers td, #customers th {  border: 1px solid #ddd;  padding: 8px;}#customers tr:nth-child(even){background-color: #f2f2f2;}#customers tr:hover {background-color: #ddd;}#customers th {  padding-top: 12px;  padding-bottom: 12px;  text-align: left;  background-color: #4CAF50;  color: white;}</style></head><body><h1>Analysis of Text Solutions : </h1><br/><h3>Which topic did you find most challenging ? </h3><br/><table id="customers">  <tr>    <th>Score</th>    <th>Topic</th>  </tr>  <tr>    <td>30</td>    <td>Machine Learning</td>  </tr>  <tr>    <td>40</td>    <td>Artificial Intelligence</td>  </tr>  <tr>    <td>20</td>    <td>Data Structures</td>  </tr>  <tr>    <td>10</td>    <td>Web Development</td>  </tr></table></body></html>',
        textFeedback:
          "All tests passed: True\n\n40% of the students found Machine Learning topic to be challenging.\n\n30% of the students found Artificial Intelligence topic to be challenging.\n\n20% of the students found Data Structures topic to be challenging.\n\n10% of the students found Web Development topic to be challenging.\n\n"
      }
    }
  });

  render() {
    const { classes } = this.props;
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
                  optionsToDisplay={
                    this.state.type === "Path" ? pathOptions : courseOptions
                  }
                />
              </TableCell>
              <TableCell align="right">
                <CustomAnalysisMenu
                  classes={classes}
                  listHandler={this.listHandler}
                  type={this.state.type}
                  listType={"Activity"}
                  optionsToDisplay={
                    this.state.type === "Path"
                      ? activityOptions
                      : assignmentOptions
                  }
                />
              </TableCell>
              <TableCell align="right">
                <CustomAnalysisMenu
                  classes={classes}
                  listHandler={this.listHandler}
                  type={this.state.type}
                  listType={"Analysis"}
                  optionsToDisplay={analysisOptions}
                />
              </TableCell>
              <TableCell align="right">
                <AddCustomAnalysisDialog classes={classes} />
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
              ANALYZE
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
        {this.state.displayResponse && (
          <CustomTaskResponseForm taskInfo={this.getTaskInfo()} />
        )}
      </div>
    );
  }
}
//sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  myPaths: state.firebase.data.myPaths,
  myCourses: state.firebase.data.myCourses
});

const mapDispatchToProps = dispatch => ({});

export default compose(
  withStyles(styles),
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
