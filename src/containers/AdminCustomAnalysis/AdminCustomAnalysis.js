/**
 * @file Admin Custom Analysis container module
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 02.07.18
 */

import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { firestoreConnect } from "react-redux-firebase";

import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

import isEmpty from "lodash/isEmpty";

import {
  adminCustomAnalysisOpen,
  addAdminCustomAnalysisRequest,
  updateAdminCustomAnalysisRequest,
  deleteAdminCustomAnalysisRequest,
  adminAnalyseRequest
} from "./actions";

// Import components
import CustomAnalysisMenu from "../../components/menus/CustomAnalysisMenu";
import AddCustomAnalysisDialog from "../../components/dialogs/AddCustomAnalysisDialog";
import ModifyCustomAnalysisDialog from "../../components/dialogs/ModifyCustomAnalysisDialog";
import AddAdminCustomQueryDialog from "../../components/dialogs/AddAdminCustomQueryDialog";
import { CustomTaskResponseForm } from "../../components/forms/CustomTaskResponseForm";

//Import Material UI components
import { Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
  activitySelection: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  root: {
    width: "100%"
  },
  table: {
    backgroundColor: theme.palette.background.paper,
    overflowX: "auto",
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  hidden: {
    display: "none"
  }
});

class AdminCustomAnalysis extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    isAdmin: PropTypes.bool,
    onOpen: PropTypes.func,
    deleteAdminCustomAnalysis: PropTypes.func,
    addAdminCustomAnalysis: PropTypes.func,
    onAnalyse: PropTypes.func,
    adminAnalysis: PropTypes.object,
    analysisResponse: PropTypes.object
  };

  componentDidMount() {
    this.props.onOpen();

    this.listHandler = this.listHandler.bind(this);
    this.addAdminCustomAnalysisHandler = this.addAdminCustomAnalysisHandler.bind(
      this
    );
    this.updateAdminCustomAnalysisHandler = this.updateAdminCustomAnalysisHandler.bind(
      this
    );
    this.deleteAdminCustomAnalysisHandler = this.deleteAdminCustomAnalysisHandler.bind(
      this
    );
    this.addCustomQueryHandler = this.addCustomQueryHandler.bind(this);
  }

  state = {
    adminAnalysisID: "",
    query: {
      firebase: [],
      firestore: []
    },
    displayResponse: "Clear"
  };

  listHandler(listType, listValue) {
    let data = {};
    switch (listType) {
      case "Analysis":
        data = { adminAnalysisID: listValue.id };
        break;
      default:
        break;
    }
    this.setState({ ...this.state, ...data });
  }

  addAdminCustomAnalysisHandler(url, name) {
    this.props.addAdminCustomAnalysis(url, name);
  }

  deleteAdminCustomAnalysisHandler(analysisID) {
    this.props.deleteAdminCustomAnalysis(analysisID);
  }
  updateAdminCustomAnalysisHandler(analysisID) {
    this.props.updateAdminCustomAnalysis(analysisID);
  }

  addCustomQueryHandler(type, query) {
    let tempQuery = { ...this.state.query };
    switch (type) {
      case "Firebase":
        tempQuery.firebase.push(query);
        break;
      case "Firestore":
        tempQuery.firestore.push(query);
        break;
      default:
        break;
    }
    this.setState({ ...this.state, query: tempQuery });
  }

  handleClear = () => {
    this.setState({
      query: {
        firebase: [],
        firestore: []
      }
    });
  };

  handleSubmit = () => {
    this.setState({ displayResponse: "Loading" });
    this.props.onAnalyse(this.state.adminAnalysisID, this.state.query);
  };

  handleResponseClear = () => {
    this.setState({ displayResponse: "Clear" });
  };

  getTaskInfo = analysisResponse => {
    if (analysisResponse && !isEmpty(analysisResponse)) {
      let results = analysisResponse.results
        ? analysisResponse.results
        : analysisResponse.result;
      if (results) {
        return {
          response: {
            data: {
              isComplete: results.isComplete,
              jsonFeedback: results.jsonFeedback,
              htmlFeedback: results.htmlFeedback,
              textFeedback: results.textFeedback,
              ipynbFeedback: analysisResponse.ipynb
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
              ipynbFeedback: analysisResponse.ipynb
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
          textFeedback: "Sample Text Response"
        }
      }
    };
  };

  getCustomResponseForm = () => {
    if (this.props.analysisResponse && !isEmpty(this.props.analysisResponse)) {
      const taskInfo = this.getTaskInfo(this.props.analysisResponse);
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
    const { classes, isAdmin, adminAnalysis } = this.props;

    if (!isAdmin) {
      return (
        <Typography variant="body2" gutterBottom>
          Sorry! This page is only viewable by admins.
        </Typography>
      );
    }
    return (
      <div className={classes.root}>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Queries</Typography>
            <Typography className={classes.secondaryHeading}>
              Expand to view queries created
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <pre>{JSON.stringify(this.state.query, null, 2)}</pre>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1b-content"
            id="panel1b-header"
          >
            <Typography className={classes.heading}>
              Query and Analysis
            </Typography>
            <Typography className={classes.secondaryHeading}>
              Expand to view query and Analysis options
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Add/Clear Queries</TableCell>
                  <TableCell align="left">Select analysis</TableCell>
                  <TableCell align="left">Add/Delete Analysis</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key="menu-options">
                  <TableCell align="left">
                    <AddAdminCustomQueryDialog
                      classes={classes}
                      addCustomQueryHandler={this.addCustomQueryHandler}
                    />
                    <br />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={this.handleClear}
                    >
                      <DeleteIcon className={classes.deleteIcon} />
                      Clear all queries&nbsp;
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <CustomAnalysisMenu
                      classes={classes}
                      listHandler={this.listHandler}
                      type={""}
                      listType={"Analysis"}
                      menuContent={adminAnalysis}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <AddCustomAnalysisDialog
                      classes={classes}
                      addCustomAnalysisHandler={
                        this.addAdminCustomAnalysisHandler
                      }
                    />
                    <br />
                    <ModifyCustomAnalysisDialog
                      classes={classes}
                      myAnalysis={adminAnalysis}
                      listHandler={this.listHandler}
                      updateCustomAnalysisHandler={
                        this.updateAdminCustomAnalysisHandler
                      }
                      deleteCustomAnalysisHandler={
                        this.deleteAdminCustomAnalysisHandler
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
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
              onClick={this.handleResponseClear}
              color="default"
            >
              CLEAR RESPONSE
            </Button>
          </div>
        </div>
        <br />
        <div
          className={
            this.state.displayResponse === "Clear" ? classes.hidden : ""
          }
        >
          {this.getCustomResponseForm()}
        </div>
      </div>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  isAdmin: state.adminCustomAnalysis.isAdmin,
  adminAnalysis: state.firestore.data.adminAnalysis,
  analysisResponse: state.adminCustomAnalysis.analysisResponse
});

const mapDispatchToProps = {
  onOpen: adminCustomAnalysisOpen,
  addAdminCustomAnalysis: addAdminCustomAnalysisRequest,
  updateAdminCustomAnalysis: updateAdminCustomAnalysisRequest,
  deleteAdminCustomAnalysis: deleteAdminCustomAnalysisRequest,
  onAnalyse: adminAnalyseRequest
};

export default compose(
  withStyles(styles),
  firestoreConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return firebaseAuth.isEmpty
      ? []
      : [
          {
            collection: "adminCustomAnalysis",
            where: [["uid", "==", firebaseAuth.uid]],
            storeAs: "adminAnalysis"
          }
        ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AdminCustomAnalysis);
