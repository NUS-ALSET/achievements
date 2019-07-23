/* ---------------------- */
/**
 * @file MyLearning container module
 * @created 15.05.2019
 */

import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as firebase from "firebase";
import "firebase/firestore";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class MyLearning extends React.Component {
  static propTypes = {
    id: PropTypes.string
  };
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.getMyLearning(this.props.id);
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      codeAnalysis: 0,
      skillsUsed: [],
      funDef: 0,
      completedActivities: 0,

      createdPaths: {
        lastWeek: [{ name: "helloWorld", date: 1557893183000 }],
        lastMonth: [
          { name: "helloWorld", date: 1557893183000 },
          { name: "helloPython", date: 1557461183000 },
          { name: "helloPython2", date: 1557374783000 }
        ],
        allTime: [
          { name: "helloWorld", date: 1557893183000 },
          { name: "helloPython", date: 1557461183000 },
          { name: "helloPython2", date: 1557374783000 },
          { name: "helloPython3", date: 1554782783000 }
        ]
      },
      createdActivities: { lastWeek: 10, lastMonth: 23, allTime: 67 },
      numSolversCreatedPaths: [
        {
          name: "helloWorld",
          solvers: { lastWeek: 10, lastMonth: 23, allTime: 67 }
        },
        {
          name: "helloPython",
          solvers: { lastWeek: 11, lastMonth: 40, allTime: 110 }
        }
      ],
      pathsExplored: {
        lastWeek: [
          { name: "Jupyter", attemptedActivities: 10, attempts:16, timeSpent:25, completed:true, additionalActivitiesRequested:true },
          { name: "Serverless", attemptedActivities: 12, attempts:13, timeSpent:30, completed:false, additionalActivitiesRequested:true }
        ],
        lastMonth: [
          { name: "Jupyter", attemptedActivities: 13,attempts:16, timeSpent:70, completed:false, additionalActivitiesRequested:false },
          { name: "Serverless", attemptedActivities: 17,attempts:20, timeSpent:80, completed:false, additionalActivitiesRequested:true }
        ],
        allTime: [
          { name: "Jupyter", attemptedActivities: 20,attempts:30, timeSpent:120, completed:false, additionalActivitiesRequested:false },
          { name: "Serverless", attemptedActivities: 23,attempts:28, timeSpent:100, completed:false, additionalActivitiesRequested:false }
        ]
      },
      publicCloudServices:{lastWeek: ["AWS S3", "AWS Lambda"], lastMonth: ["AWS S3", "AWS Lambda", "Azure Functions"], allTime: ["AWS S3", "AWS Lambda", "Azure Functions", "Azure Storage", "Firebase Functions", "Google Functions"]}, 
      codeCombatMultiplayerLevels: {lastWeek: ["King of the Hill"], lastMonth: ["King of the Hill", "Queen of the Desert"], allTime: ["King of the Hill", "Queen of the Desert", "Tesla Tesoro"]}, 
      codeCombatLevels: {lastWeek: 7, lastMonth: 10, allTime: 20},
      jupyterNotebookActivities: {lastWeek: 11, lastMonth: 20, allTime: 48},
      recommendedActivitiesClick:{lastWeek: 5, lastMonth: 9, allTime: 10},
      visitsToMyLearning:{lastWeek: 3, lastMonth: 10, allTime: 12},
      personalDataDownload: true,


      BarChartOptions: {
        chart: {
          type: "column"
        },
        title: {
          text: "Skills Distribution"
        },
        xAxis: {
          categories: ["FuncDef", "Functions", "Import", "Statements"],
          crosshair: true
        },
        yAxis: {
          min: 0
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key} : </span><table>',
          pointFormat: "<tr><b>{point.y}</b></td></tr>",
          footerFormat: "</table>",
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        }
      }
    };
  }
  getMyLearning = uid => {
    let days = 7; // Days you want to subtract
    let date = new Date();
    let last = new Date(
      date.getTime() - days * 24 * 60 * 60 * 100
    ).getMilliseconds();
    let codeAnalysis = 0;
    let skillsUsed = [];
    let FuncDef = 0;
    let Functions = 0;
    let Import = 0;
    let Statements = 0;

    let completedActivities = 0;

    let db = firebase.firestore();
    let query = db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "CODE_ANALYSIS")
      .where("createdAt", ">=", last)
      .orderBy("createdAt", "desc")
      .limit(100);
    query
      .get()
      .then(querySnapshot => {
        codeAnalysis = querySnapshot.size;
        querySnapshot.forEach(doc => {
          skillsUsed.push(doc.data().difference);
          if (doc.data().difference) {
            if (
              doc.data().difference.constructs &&
              doc.data().difference.constructs.FunctionDef
            ) {
              FuncDef += doc.data().difference.constructs.FunctionDef;
            }
            if (doc.data().difference.statements) {
              Object.keys(doc.data().difference.statements).map(
                key => (Statements += doc.data().difference.statements[key])
              );
            }
            if (doc.data().difference.functions) {
              Object.keys(doc.data().difference.functions).map(
                key => (Functions += doc.data().difference.functions[key])
              );
            }
            if (doc.data().difference.imports) {
              Object.keys(doc.data().difference.imports).map(
                key => (Import += doc.data().difference.imports[key])
              );
            }
          }
        });
        this.setState({
          codeAnalysis: codeAnalysis,
          skillsUsed: skillsUsed,
          funDef: FuncDef,
          BarChartOptions: {
            series: [
              {
                data: [FuncDef, Functions, Import, Statements],
                color: "#4caf50"
              }
            ]
          }
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    var queryActivities = db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "PATH_FETCH_PROBLEMS_SOLUTIONS_SUCCESS")
      .where("createdAt", ">=", last)
      .orderBy("createdAt", "desc")
      .limit(100);
    queryActivities
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          completedActivities = querySnapshot.size;
        });
        this.setState({
          completedActivities: completedActivities
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  };

  render() {
    let stats = {
      color: "#4caf50",
      fontWeight: "bold"
    };
    return (
      <Fragment>
        {!this.props.id ? (
          <Fragment>
            Loading Learning Summary...
            <LinearProgress />
          </Fragment>
        ) : (
          <Fragment>
            <Typography variant="h5">My Learning Summary </Typography>
            <br />
            <Grid container spacing={24}>
            <Grid item xs={12}>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}>
                  hello
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    hi
                  </ExpansionPanelDetails>
            </ExpansionPanel>
            </Grid>
              {/* <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">
                      Learning since last week
                    </Typography>
                    <hr />
                    <div>
                      <ul>
                        <li>
                          Submmited{" "}
                          <span style={{ ...stats }}>
                            {this.state.codeAnalysis}
                          </span>{" "}
                          Jupyter Notebook activity solutions.
                        </li>
                        <li>
                          Completed{" "}
                          <span style={{ ...stats }}>
                            {this.state.completedActivities}
                          </span>{" "}
                          activities.
                        </li>
                      </ul>
                    </div>
                    <Typography variant="subtitle1">Skills:</Typography>

                    <div>
                      <ul>
                        <li>
                          Skills demonstrated :
                          <br />
                          <span style={{ ...stats }}>
                            {JSON.stringify(this.state.skillsUsed)}
                          </span>
                        </li>
                        <li>
                          Functions Defined :{" "}
                          <span style={{ ...stats }}>{this.state.funDef}</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={this.state.BarChartOptions}
                />
              </Grid>*/}
            </Grid> 
          </Fragment>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  id: state.firebase.auth.uid
});
export default connect(mapStateToProps)(MyLearning);
