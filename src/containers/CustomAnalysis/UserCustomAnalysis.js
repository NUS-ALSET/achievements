/**
 * @file Log Custom Analysis container module
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
  addCustomAnalysisRequest,
  userLogsClearRequest,
  updateCustomAnalysisRequest,
  deleteCustomAnalysisRequest,
  userAnalyseRequest
} from "./actions";

// Import components
import CustomAnalysisMenu from "../../components/menus/CustomAnalysisMenu";
import AddCustomAnalysisDialog from "../../components/dialogs/AddCustomAnalysisDialog";
import ModifyCustomAnalysisDialog from "../../components/dialogs/ModifyCustomAnalysisDialog";
import { CustomTaskResponseForm } from "../../components/forms/CustomTaskResponseForm";

// Import MaterialUI components
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

class UserCustomAnalysis extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    addCustomAnalysis: PropTypes.func,
    deleteCustomAnalysis: PropTypes.func,
    onAnalyse: PropTypes.func,
    myAnalysis: PropTypes.object,
    analysisResults: PropTypes.object,
    userLogsSelected: PropTypes.array
  };

  state = {
    analysisID: "",
    analysisName: "",
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

  listHandler(listType, listValue) {
    let data = {};
    switch (listType) {
      case "Analysis":
        data = { analysisID: listValue.id, analysisName: listValue.name };
        break;
      default:
        break;
    }
    this.setState({ ...this.state, ...data });
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

  handleSubmit = () => {
    this.setState({ ...this.state, displayResponse: "Loading" });
    this.props.onAnalyse(this.state.analysisID);
  };
  handleClear = () => {
    this.setState({ displayResponse: "Clear" });
    this.props.onClear();
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
              analysisInput: this.props.userLogsSelected
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
              analysisInput: this.props.userLogsSelected
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
          analysisInput: this.props.userLogsSelected
        }
      }
    };
  };

  resetState = () => {
    this.setState({
      ...this.state,
      analysisID: ""
    });
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

  render() {
    const { classes, myAnalysis } = this.props;
    return (
      <div>
        <Table className={classes.table} size="small" padding="checkbox">
          <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={2}>
                Select / Add Analysis*
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key="menu-options">
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
                  updateCustomAnalysisHandler={this.updateCustomAnalysisHandler}
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
        <div
          className={
            this.state.displayResponse === "Clear" ? classes.hidden : ""
          }
        >
          <div>
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
    );
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  myAnalysis: state.firestore.data.myAnalysis,
  analysisResults: state.customAnalysis.userAnalysisResults,
  userLogsSelected: state.customAnalysis.userLogsSelected
});

const mapDispatchToProps = {
  addCustomAnalysis: addCustomAnalysisRequest,
  updateCustomAnalysis: updateCustomAnalysisRequest,
  deleteCustomAnalysis: deleteCustomAnalysisRequest,
  onAnalyse: userAnalyseRequest,
  onClear: userLogsClearRequest
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
)(UserCustomAnalysis);
