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
      allActivities: {
        ccTotal: 0,
        ccCompleted: 0,
        allTotal: 0,
        allCompleted: 0,
        jypTotal: 0,
        jypCompleted: 0
      },
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

    var allActivities = {
      ccTotal: 0,
      ccCompleted: 0,
      allTotal: 0,
      allCompleted: 0,
      jypTotal: 0,
      jypCompleted: 0
    };
    var queryCodeCombat = db
      .collection("logged_events")
      .where("uid", "==", uid)
      .where("type", "==", "PROBLEM_SOLUTION_ATTEMPT_REQUEST")
      .where("createdAt", ">=", last)
      .orderBy("createdAt", "desc")
      .limit(100);
    queryCodeCombat
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var otherActionData = JSON.parse(doc.data().otherActionData);
          if (otherActionData.payload.activityType === "codeCombat") {
            if (otherActionData.payload.completed === 1) {
              allActivities.ccCompleted += 1;
            }
            allActivities.ccTotal += 1;
          } else if (
            otherActionData.payload.activityType === "jupyterInline" ||
            otherActionData.payload.activityType === "jupyterLocal"
          ) {
            if (otherActionData.payload.completed === 1) {
              allActivities.jypCompleted += 1;
            }
            allActivities.jypTotal += 1;
          }
          if (otherActionData.payload.completed === 1) {
            allActivities.allCompleted += 1;
          }
          allActivities.allTotal += 1;
        });
        this.setState({
          allActivities: allActivities
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
            <Typography variant="h5">My Learning Summary- </Typography>
            <br />
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">
                      Learning since last week
                    </Typography>
                    <hr />
                    <div>
                      <Typography variant="subtitle1">Overall :</Typography>
                      <ul>
                        <li>
                          Attempted{" "}
                          <span style={{ ...stats }}>
                            {this.state.allActivities.allTotal}
                          </span>{" "}
                          activities.
                        </li>
                        <li>
                          Completed{" "}
                          <span style={{ ...stats }}>
                            {this.state.allActivities.allCompleted}
                          </span>{" "}
                          activities.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Typography variant="subtitle1">CodeCombat :</Typography>
                      <ul>
                        <li>
                          Attempted{" "}
                          <span style={{ ...stats }}>
                            {this.state.allActivities.ccTotal}
                          </span>{" "}
                          CodeCombat activities.
                        </li>
                        <li>
                          Completed{" "}
                          <span style={{ ...stats }}>
                            {this.state.allActivities.ccCompleted}
                          </span>{" "}
                          CodeCombat activities.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Typography variant="subtitle1">Python :</Typography>
                      <ul>
                        <li>
                          Attempted{" "}
                          <span style={{ ...stats }}>
                            {this.state.allActivities.jypTotal}
                          </span>{" "}
                          Jupyter Notebook activities.
                        </li>
                        <li>
                          Completed{" "}
                          <span style={{ ...stats }}>
                            {this.state.allActivities.jypCompleted}
                          </span>{" "}
                          Jupyter Notebook activities.
                        </li>
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
              </Grid>
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
