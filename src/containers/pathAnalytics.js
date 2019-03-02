import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

// code-spliting
import Loadable from "react-loadable";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

import { firebaseConnect } from "react-redux-firebase";

import {
  changePathKeyJupSol,
  initAnalyticsData,
  filterAnalyticsData
} from "../containers/IdeaLab/";

const ReactFCLoad = Loadable({
  loader: () => import("./ReactFCLoad"),
  // eslint-disable-next-line react/display-name
  loading: () => <LinearProgress />
});

class PathAnalytics extends React.PureComponent {
  static propTypes = {
    analyticsData: PropTypes.object,
    changePathKeyJupSol: PropTypes.func,
    filterAnalyticsData: PropTypes.func,
    filteredAnalytics: PropTypes.array,
    initAnalyticsData: PropTypes.func,
    jupyterAnalyticsPathKey: PropTypes.string,
    activitiesData: PropTypes.object
  };
  state = {
    anchorEl: null,
    loading: true,
    timeTakenArray: [],
    numAttemptsArray: [],
    userProgressArray: []
  };

  componentDidUpdate(prevProps) {
    if (prevProps.analyticsData !== this.props.analyticsData) {
      this.props.initAnalyticsData(this.props.analyticsData);
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeKey = pathKey => {
    this.props.changePathKeyJupSol(pathKey);
  };

  filterByPathKey = (analyticsData, pathKey) => {
    this.props.filterAnalyticsData(analyticsData, pathKey);
  };

  calcOutlier = (data, type) => {
    data.sort((a, b) => a - b);
    let l = data.length;

    if (l <= 2 && type === "value") {
      return data.toString();
    } else if (l <= 2 && type === "outlier") {
      return "";
    }

    let sum = data.reduce((a, b) => a + b, 0);
    let mean = sum / l;
    let median = data[Math.round(l / 2)];
    let LQ = data[Math.round(l / 4)];
    let UQ = data[Math.round((3 * l) / 4)];
    let IQR = UQ - LQ;
    let notOutliers = [];
    let outliers = [];
    data.map(item => {
      item > median - 1.5 * IQR && item < mean + 1.5 * IQR
        ? notOutliers.push(item)
        : outliers.push(item);
      return item;
    });
    if (type === "value") {
      return notOutliers.toString();
    } else {
      return outliers.toString();
    }
  };

  processDataUserProgress = (
    analyticsData,
    filteredAnalytics,
    activitiesData
  ) => {
    let filteredProm = Promise.resolve(filteredAnalytics);
    let analyticsProm = Promise.resolve(analyticsData);
    let activitiesProm = Promise.resolve(activitiesData);
    let thisVar = this;
    Promise.all([filteredProm, analyticsProm, activitiesProm]).then(function([
      filteredResponse,
      analyticsResponse,
      activitiesResponse
    ]) {
      if (activitiesResponse && analyticsResponse && filteredResponse) {
        let arrayUserKey = Object.keys(filteredResponse)
          .map(item => ({
            value: [
              analyticsResponse[filteredResponse[item]].userKey,
              activitiesResponse[
                analyticsResponse[filteredResponse[item]].activityKey
              ].name,
              analyticsResponse[filteredResponse[item]].time,
              activitiesResponse[
                analyticsResponse[filteredResponse[item]].activityKey
              ].orderIndex,
              analyticsResponse[filteredResponse[item]].pathKey
            ]
          }))
          .sort((a, b) => a.value[3] - b.value[3]);

        let arrayByActivity = Array.from(
          new Set(arrayUserKey.map(item => item.value[1]))
        ).map(label => arrayUserKey.filter(item => item.value[1] === label));

        let currDateUnix = new Date().getTime();
        let finalArray = [[], [], [], []];
        arrayByActivity.map(el => {
          let allTime = [];
          let lastWeek = [];
          let twoWeek = [];
          let threeWeek = [];
          el.map(elem => {
            if (!allTime.includes(elem.value[0])) {
              allTime.push(elem.value[0]);
            }
            if (
              currDateUnix - elem.value[2] <= 1000 * 3600 * 24 * 7 &&
              !lastWeek.includes(elem.value[0])
            ) {
              lastWeek.push(elem.value[0]);
            }
            if (
              currDateUnix - elem.value[2] <= 1000 * 3600 * 24 * 7 * 2 &&
              !twoWeek.includes(elem.value[0])
            ) {
              twoWeek.push(elem.value[0]);
            }
            if (
              currDateUnix - elem.value[2] <= 1000 * 3600 * 24 * 7 * 3 &&
              !threeWeek.includes(elem.value[0])
            ) {
              threeWeek.push(elem.value[0]);
            }
            return elem;
          });
          finalArray[0].push(allTime.length);
          finalArray[1].push(lastWeek.length);
          finalArray[2].push(twoWeek.length);
          finalArray[3].push(threeWeek.length);
          return finalArray;
        });

        thisVar.setState({
          userProgressArray: [
            {
              seriesname: "All Time",
              data: finalArray[0].toString()
            },
            {
              seriesname: "Since Last Week",
              data: finalArray[1].toString()
            },
            {
              seriesname: "Since 2 Weeks Ago",
              data: finalArray[2].toString()
            },
            {
              seriesname: "Since 3 Weeks Ago",
              data: finalArray[3].toString()
            }
          ],
          loading: false
        });
      }
    });
  };

  processDataTime = (analyticsData, filteredAnalytics, activitiesData) => {
    let filteredProm = Promise.resolve(filteredAnalytics);
    let analyticsProm = Promise.resolve(analyticsData);
    let activitiesProm = Promise.resolve(activitiesData);
    let thisVar = this;
    Promise.all([filteredProm, analyticsProm, activitiesProm]).then(function([
      filteredResponse,
      analyticsResponse,
      activitiesResponse
    ]) {
      if (activitiesResponse && analyticsResponse && filteredResponse) {
        let myArray = Object.keys(filteredResponse)
          .map(item => ({
            value: [
              (analyticsResponse[filteredResponse[item]].time -
                analyticsResponse[filteredResponse[item]].open) /
                60000,
              activitiesResponse[
                analyticsResponse[filteredResponse[item]].activityKey
              ].name,
              activitiesResponse[
                analyticsResponse[filteredResponse[item]].activityKey
              ].orderIndex
            ]
          }))
          .sort((a, b) => a.value[2] - b.value[2]);
        thisVar.setState({
          timeTakenArray: Array.from(
            new Set(myArray.map(item => item.value[1]))
          ).map(label => ({
            value: thisVar.calcOutlier(
              myArray
                .filter(item => item.value[1] === label)
                .map(item => item.value[0]),
              "value"
            ),
            outliers: thisVar.calcOutlier(
              myArray
                .filter(item => item.value[1] === label)
                .map(item => item.value[0]),
              "outlier"
            )
          })),
          loading: false
        });
      }
    });
  };

  processDataAttempts = (analyticsData, filteredAnalytics, activitiesData) => {
    let filteredProm = Promise.resolve(filteredAnalytics);
    let analyticsProm = Promise.resolve(analyticsData);
    let activitiesProm = Promise.resolve(activitiesData);
    let thisVar = this;
    Promise.all([filteredProm, analyticsProm, activitiesProm]).then(function([
      filteredResponse,
      analyticsResponse,
      activitiesResponse
    ]) {
      if (activitiesResponse && analyticsResponse && filteredResponse) {
        let arrayCompletedZero = Object.keys(filteredResponse)
          // .filter(
          //   item => analyticsResponse[filteredResponse[item]].completed === 0
          // )
          .map(item => ({
            value: [
              analyticsResponse[filteredResponse[item]].completed,
              analyticsResponse[filteredResponse[item]].userKey,
              activitiesResponse[
                analyticsResponse[filteredResponse[item]].activityKey
              ].name,
              activitiesResponse[
                analyticsResponse[filteredResponse[item]].activityKey
              ].orderIndex
            ]
          }))
          .sort((a, b) => a.value[3] - b.value[3]);

        let arrayByActivity = Array.from(
          new Set(arrayCompletedZero.map(item => item.value[2]))
        ).map(label =>
          arrayCompletedZero.filter(item => item.value[2] === label)
        );

        let finalArray = [];
        arrayByActivity.map(el => {
          let users = [];
          let score = [];
          let isCompleted = [];
          el.map(elem => {
            if (!users.includes(elem.value[1])) {
              users.push(elem.value[1]);
              score.push(1);
              elem.value[0] === 1
                ? isCompleted.push(true)
                : isCompleted.push(false);
            } else {
              if (!isCompleted[users.indexOf(elem.value[1])]) {
                score[users.indexOf(elem.value[1])] += 1;
                if (elem.value[0] === 1) {
                  isCompleted[users.indexOf(elem.value[1])] = true;
                }
              }
            }
            return elem;
          });
          finalArray.push({
            value: thisVar.calcOutlier(score, "value"),
            outliers: thisVar.calcOutlier(score, "outlier")
          });
          return finalArray;
        });

        thisVar.setState({
          numAttemptsArray: finalArray,
          loading: false
        });
      }
    });
  };

  render() {
    const {
      anchorEl,
      loading,
      timeTakenArray,
      numAttemptsArray,
      userProgressArray
    } = this.state;
    const {
      analyticsData,
      filteredAnalytics,
      jupyterAnalyticsPathKey,
      activitiesData
    } = this.props;
    return (
      <Fragment>
        <Fragment>
          {analyticsData ? (
            <Fragment>
              <div style={{ display: "flex" }}>
                <Typography variant="h5" style={{ flexDirection: "column" }}>
                  Analysis of
                </Typography>
                <Typography
                  variant="h5"
                  color="error"
                  style={{ marginLeft: 10, flexDirection: "column" }}
                >
                  user progression
                </Typography>
                <Typography
                  variant="h5"
                  style={{ marginLeft: 10, flexDirection: "column" }}
                >
                  along Jupyter Notebook Activities
                </Typography>
              </div>

              <Button
                aria-haspopup="true"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                color="primary"
                onClick={this.handleClick}
                variant="contained"
              >
                Select PathKey to fetch from jupyterSolutions
              </Button>
              <Menu
                anchorEl={anchorEl}
                id="simple-menu"
                onClose={this.handleClose}
                open={Boolean(anchorEl)}
              >
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LIHcRLK2Ql9Fva5uERe");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LIHcRLK2Ql9Fva5uERe");
                  }}
                >
                  pathKey1: -LIHcRLK2Ql9Fva5uERe
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LMfAB4SNR25AyoFLmN5");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LMfAB4SNR25AyoFLmN5");
                  }}
                >
                  pathKey2: -LMfAB4SNR25AyoFLmN5
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LLd7A7XpcbQiQ9pzAIX");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LLd7A7XpcbQiQ9pzAIX");
                  }}
                >
                  pathKey3: -LLd7A7XpcbQiQ9pzAIX
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LT0hGj19DXTh4WvJYiI");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LT0hGj19DXTh4WvJYiI");
                  }}
                >
                  pathKey4: -LT0hGj19DXTh4WvJYiI
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-L9JVgROKkDUhZs08WWp");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-L9JVgROKkDUhZs08WWp");
                  }}
                >
                  pathKey5: -L9JVgROKkDUhZs08WWp
                </MenuItem>
              </Menu>
              <hr />

              {loading ? (
                this.processDataUserProgress(
                  analyticsData,
                  filteredAnalytics,
                  activitiesData
                )
              ) : (
                <ReactFCLoad
                  {...{
                    type: "zoomline",
                    width: "100%",
                    height: 550,
                    dataFormat: "json",
                    dataSource: {
                      chart: {
                        caption: "Jupyter Notebook Activities",
                        subcaption: "Number of unique users along a path",
                        yaxisname: "Unique Users",
                        xaxisname: "Activitiy",
                        pixelsPerPoint: "0",
                        pixelsPerLabel: "30",
                        lineThickness: "1",
                        compactdatamode: "1",
                        dataseparator: ",",
                        labelHeight: "30",
                        theme: "fusion"
                      },
                      categories: [
                        {
                          category:
                            filteredAnalytics &&
                            activitiesData &&
                            analyticsData &&
                            Array.from(
                              new Set(
                                Object.keys(filteredAnalytics)
                                  .sort(
                                    (a, b) =>
                                      activitiesData[
                                        analyticsData[filteredAnalytics[a]]
                                          .activityKey
                                      ].orderIndex -
                                      activitiesData[
                                        analyticsData[filteredAnalytics[b]]
                                          .activityKey
                                      ].orderIndex
                                  )
                                  .map(item => ({
                                    label:
                                      activitiesData[
                                        analyticsData[filteredAnalytics[item]]
                                          .activityKey
                                      ].name
                                  }))
                                  .map(s => s.label)
                              )
                            ).map(label => ({
                              label: label
                            }))
                        }
                      ],
                      dataset: userProgressArray
                    }
                  }}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              <Typography variant="h5">
                Fetching from /analytics/activityAttempts
              </Typography>
              <Typography variant="h6">
                Data with pathKey = {jupyterAnalyticsPathKey}:
              </Typography>
              <Typography variant="h6">Loading...</Typography>
            </Fragment>
          )}
        </Fragment>

        <br />
        <hr />
        <hr />

        <Fragment>
          {analyticsData ? (
            <Fragment>
              <div style={{ display: "flex" }}>
                <Typography variant="h5" style={{ flexDirection: "column" }}>
                  Analysis of
                </Typography>
                <Typography
                  variant="h5"
                  color="error"
                  style={{ marginLeft: 10, flexDirection: "column" }}
                >
                  time taken
                </Typography>
                <Typography
                  variant="h5"
                  style={{ marginLeft: 10, flexDirection: "column" }}
                >
                  to solve Jupyter Notebook Activities
                </Typography>
              </div>

              <Button
                aria-haspopup="true"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                color="primary"
                onClick={this.handleClick}
                variant="contained"
              >
                Select PathKey to fetch from jupyterSolutions
              </Button>
              <Menu
                anchorEl={anchorEl}
                id="simple-menu"
                onClose={this.handleClose}
                open={Boolean(anchorEl)}
              >
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LIHcRLK2Ql9Fva5uERe");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LIHcRLK2Ql9Fva5uERe");
                  }}
                >
                  pathKey1: -LIHcRLK2Ql9Fva5uERe
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LMfAB4SNR25AyoFLmN5");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LMfAB4SNR25AyoFLmN5");
                  }}
                >
                  pathKey2: -LMfAB4SNR25AyoFLmN5
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LLd7A7XpcbQiQ9pzAIX");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LLd7A7XpcbQiQ9pzAIX");
                  }}
                >
                  pathKey3: -LLd7A7XpcbQiQ9pzAIX
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LT0hGj19DXTh4WvJYiI");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LT0hGj19DXTh4WvJYiI");
                  }}
                >
                  pathKey4: -LT0hGj19DXTh4WvJYiI
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-L9JVgROKkDUhZs08WWp");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-L9JVgROKkDUhZs08WWp");
                  }}
                >
                  pathKey5: -L9JVgROKkDUhZs08WWp
                </MenuItem>
              </Menu>
              <hr />

              {loading ? (
                this.processDataTime(
                  analyticsData,
                  filteredAnalytics,
                  activitiesData
                )
              ) : (
                <ReactFCLoad
                  {...{
                    type: "boxandwhisker2d",
                    width: "100%",
                    height: 550,
                    dataFormat: "json",
                    dataSource: {
                      chart: {
                        caption: "Jupyter Notebook Activities",
                        subcaption: "Time taken to solve each activity",
                        toolTipBgAlpha: "100",
                        sshowvalues: "0",
                        palettecolors: "#5D62B5, #979AD0",
                        yaxisname: "Time (mins)",
                        showmean: "1",
                        meanIconRadius: "10",
                        showmedianvalues: "0",
                        theme: "fusion",
                        meaniconshape: "polygon",
                        meaniconsides: "2",
                        meaniconradius: "2",
                        showalloutliers: "1",
                        outliericonsides: "20",
                        outliericonalpha: "40",
                        outliericonshape: "triangle",
                        outliericonradius: "4",
                        plotspacepercent: "60",
                        plottooltext:
                          '<b><u>Time taken to complete "$label"</u>:</b><br> <br> Max: $maxDataValue mins <br> Min: $minDataValue mins <br> <br> Mean: $mean mins <br> <br> Q3: $Q3 mins <br> Median: $median mins <br> Q1: $Q1 mins'
                      },
                      categories: [
                        {
                          category:
                            filteredAnalytics &&
                            activitiesData &&
                            analyticsData &&
                            Array.from(
                              new Set(
                                Object.keys(filteredAnalytics)
                                  .sort(
                                    (a, b) =>
                                      activitiesData[
                                        analyticsData[filteredAnalytics[a]]
                                          .activityKey
                                      ].orderIndex -
                                      activitiesData[
                                        analyticsData[filteredAnalytics[b]]
                                          .activityKey
                                      ].orderIndex
                                  )
                                  .map(item => ({
                                    label:
                                      activitiesData[
                                        analyticsData[filteredAnalytics[item]]
                                          .activityKey
                                      ].name
                                  }))
                                  .map(s => s.label)
                              )
                            ).map(label => ({
                              label: label
                            }))
                        }
                      ],
                      dataset: [
                        {
                          seriesname: "Interquartile Range",
                          data: timeTakenArray
                        }
                      ]
                    }
                  }}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              <Typography variant="h5">
                Fetching from /analytics/activityAttempts
              </Typography>
              <Typography variant="h6">
                Data with pathKey = {jupyterAnalyticsPathKey}:
              </Typography>
              <Typography variant="h6">Loading...</Typography>
            </Fragment>
          )}
        </Fragment>

        <br />
        <hr />
        <hr />

        <Fragment>
          {analyticsData ? (
            <Fragment>
              <div style={{ display: "flex" }}>
                <Typography variant="h5" style={{ flexDirection: "column" }}>
                  Analysis of
                </Typography>
                <Typography
                  variant="h5"
                  color="error"
                  style={{ marginLeft: 10, flexDirection: "column" }}
                >
                  number of attempts
                </Typography>
                <Typography
                  variant="h5"
                  style={{ marginLeft: 10, flexDirection: "column" }}
                >
                  to solve Jupyter Notebook Activities
                </Typography>
              </div>

              <Button
                aria-haspopup="true"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                color="primary"
                onClick={this.handleClick}
                variant="contained"
              >
                Select PathKey to fetch from jupyterSolutions
              </Button>
              <Menu
                anchorEl={anchorEl}
                id="simple-menu"
                onClose={this.handleClose}
                open={Boolean(anchorEl)}
              >
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LIHcRLK2Ql9Fva5uERe");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LIHcRLK2Ql9Fva5uERe");
                  }}
                >
                  pathKey1: -LIHcRLK2Ql9Fva5uERe
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LMfAB4SNR25AyoFLmN5");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LMfAB4SNR25AyoFLmN5");
                  }}
                >
                  pathKey2: -LMfAB4SNR25AyoFLmN5
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LLd7A7XpcbQiQ9pzAIX");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LLd7A7XpcbQiQ9pzAIX");
                  }}
                >
                  pathKey3: -LLd7A7XpcbQiQ9pzAIX
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-LT0hGj19DXTh4WvJYiI");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-LT0hGj19DXTh4WvJYiI");
                  }}
                >
                  pathKey4: -LT0hGj19DXTh4WvJYiI
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.handleChangeKey("-L9JVgROKkDUhZs08WWp");
                    this.handleClose();
                    this.filterByPathKey(analyticsData, "-L9JVgROKkDUhZs08WWp");
                  }}
                >
                  pathKey5: -L9JVgROKkDUhZs08WWp
                </MenuItem>
              </Menu>
              <hr />

              {loading ? (
                this.processDataAttempts(
                  analyticsData,
                  filteredAnalytics,
                  activitiesData
                )
              ) : (
                <ReactFCLoad
                  {...{
                    type: "boxandwhisker2d",
                    width: "100%",
                    height: 550,
                    dataFormat: "json",
                    dataSource: {
                      chart: {
                        caption: "Jupyter Notebook Activities",
                        subcaption: "Number of attempts to solve each activity",
                        toolTipBgAlpha: "100",
                        sshowvalues: "0",
                        palettecolors: "#5D62B5, #979AD0",
                        yaxisname: "Number of attempts",
                        showmean: "1",
                        meanIconRadius: "10",
                        showmedianvalues: "0",
                        theme: "fusion",
                        meaniconshape: "polygon",
                        meaniconsides: "2",
                        meaniconradius: "2",
                        showalloutliers: "1",
                        outliericonsides: "20",
                        outliericonalpha: "40",
                        outliericonshape: "triangle",
                        outliericonradius: "4",
                        plotspacepercent: "60",
                        plottooltext:
                          '<b><u>Number of attemtps taken to complete "$label"</u>:</b><br> <br> Max: $maxDataValue<br> Min: $minDataValue<br> <br> Mean: $mean<br> <br> Q3: $Q3<br> Median: $median<br> Q1: $Q1'
                      },
                      categories: [
                        {
                          category:
                            filteredAnalytics &&
                            activitiesData &&
                            analyticsData &&
                            Array.from(
                              new Set(
                                Object.keys(filteredAnalytics)
                                  .sort(
                                    (a, b) =>
                                      activitiesData[
                                        analyticsData[filteredAnalytics[a]]
                                          .activityKey
                                      ].orderIndex -
                                      activitiesData[
                                        analyticsData[filteredAnalytics[b]]
                                          .activityKey
                                      ].orderIndex
                                  )
                                  .map(item => ({
                                    label:
                                      activitiesData[
                                        analyticsData[filteredAnalytics[item]]
                                          .activityKey
                                      ].name
                                  }))
                                  .map(s => s.label)
                              )
                            ).map(label => ({
                              label: label
                            }))
                        }
                      ],
                      dataset: [
                        {
                          seriesname: "Interquartile Range",
                          data: numAttemptsArray
                        }
                      ]
                    }
                  }}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              <Typography variant="h5">
                Fetching from /analytics/activityAttempts
              </Typography>
              <Typography variant="h6">
                Data with pathKey = {jupyterAnalyticsPathKey}:
              </Typography>
              <Typography variant="h6">Loading...</Typography>
            </Fragment>
          )}
        </Fragment>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  analyticsData: state.firebase.data.analyticsData,
  filteredAnalytics: state.CRUDdemo.filteredAnalytics,
  jupyterAnalyticsPathKey: state.CRUDdemo.jupyterAnalyticsPathKey,
  activitiesData: state.firebase.data.activitiesData
});

const mapDispatchToProps = {
  changePathKeyJupSol,
  initAnalyticsData,
  filterAnalyticsData
};

export default compose(
  firebaseConnect((ownProps, store) => {
    return [
      {
        path: "/analytics/activityAttempts",
        storeAs: "analyticsData",
        queryParams: ["orderByChild=activityType", "equalTo=jupyterInline"]
      },
      {
        path: "/activities",
        storeAs: "activitiesData"
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PathAnalytics);
