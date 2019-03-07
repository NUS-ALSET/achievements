import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import { firebaseConnect } from "react-redux-firebase";
import LinearProgress from "@material-ui/core/LinearProgress";
// code-spliting
import Loadable from "react-loadable";

import { updateSelectedPath, fetchActivityAttempts } from "./actions";

const ReactFCLoad = Loadable({
  loader: () => import("./Ben/ReactFCLoad"),
  loading: () => <LinearProgress />
});

class ActivitiesAnalytics extends React.PureComponent {
  static propTypes = {
    fetchActivityAttempts: PropTypes.func,
    timeTakenChartDataSource: PropTypes.object,
    updateSelectedPath: PropTypes.func,
    ownerPaths: PropTypes.object,
    selectedPath: PropTypes.object,
    selectedpathActivities: PropTypes.object,
  };
  state = {
    anchorEl: null,
    anchorEl1: null,
    rangeGap: 10,
    selectedRange: 0,
    totalAttempttedActivities: 0,
    loading: true,
    selectedPathId: null,
    timeTakenChartDataSource: {
      chart: {
        caption: "Path Activities",
        subcaption: "Time taken to solve each activity",
        yaxisname: "Time (mins)",
        palettecolors: "#5D62B5, #979AD0",
        theme: "fusion",
        showlegend: "0",
        mediancolor: "#FFFFFF",
        plottooltext:
          '<b><u>Time taken to complete "$label"</u>:</b><br> <br> Max: $maxDataValue mins <br> Min: $minDataValue mins <br> <br> Mean: $mean mins <br>  Median: $median mins <br>'
      },
      categories: [
        {
          category: []
        }
      ],
      dataset: []
    },
    numOfAttemptsChartDataSource: {
      chart: {
        caption: "Path Activities",
        subcaption: "Number of attempts solve each activity",
        yaxisname: "Number of Attempts",
        palettecolors: "#5D62B5, #979AD0",
        theme: "fusion",
        showlegend: "0",
        mediancolor: "#FFFFFF",
        plottooltext:
          '<b><u>Number of attempts to complete "$label"</u>:</b><br> <br> Max: $maxDataValue mins <br> Min: $minDataValue mins <br> <br> Mean: $mean mins <br>  Median: $median mins <br>'
      },
      categories: [
        {
          category: []
        }
      ],
      dataset: []
    }
  };

  handleClick = (key, event) => {
    this.setState({ [key]: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, anchorEl1: null });
  };

  pathSelected = (path, key) => {
    path.id = key;
    this.setState({ selectedPathId: key, selectRangeText: '', selectedRange: 0 });
    this.props.updateSelectedPath(path, key);
    // get activityAttempts from DB
    this.props.fetchActivityAttempts(key);
  };

  renderDropdownItems = () => {
    const ownerPaths = this.props.ownerPaths;
    return (
      ownerPaths &&
      Object.keys(ownerPaths).map((key, i) => (
        <MenuItem
          key={key + i}
          onClick={() => {
            this.pathSelected(ownerPaths[key], key);
            this.handleClose();
          }}
        >
          {ownerPaths[key].name} - {key}
        </MenuItem>
      ))
    );
  };
  setActivityRange = (rangeIndex) => {
    this.setState({ selectedRange: rangeIndex});
    const attempts = this.getAttemptsFormRange(rangeIndex);
    this.createTimeTakenChartDataSource(attempts);
    this.createNumOfAttemptsChartDataSource(attempts);
  };

  getAttemptsFormRange = range => {
    const startIndex = range * this.state.rangeGap;
    const attempts = this.props.attempts;
    return Object.keys(attempts).reduce((result, id, index) => {
      if (index >= startIndex && index < (range + 1) * this.state.rangeGap) {
        result[id] = JSON.parse(JSON.stringify(attempts[id]));
      }
      return result;
    }, {});
  };

  renderDropdownRangeItems = () => {
    const attempts = this.props.attempts;
    const uniqueActivities = Object.keys(attempts).reduce((unique, id) => {
      unique[attempts[id].activityKey] = true;
      return unique;
    }, {});
    const totalAttempttedActivities = Object.keys(uniqueActivities).length;
    this.setState({ totalAttempttedActivities });
    const range = Math.ceil(totalAttempttedActivities / this.state.rangeGap);
    const rangeArray = new Array(range).fill(0);
    return rangeArray.map((key, i) => {
      const selectRangeText = `${i + 1} - ${Math.min(
        (i + 1) * this.state.rangeGap,
        totalAttempttedActivities
      )}`;
      return (
        <MenuItem
          key={key + i}
          onClick={() => {
            this.handleClose();
            this.setActivityRange(i, selectRangeText);
          }}
        >
          {selectRangeText}
        </MenuItem>
      );
    });
  };

  componentDidUpdate(prevProps) {
    const activityPath = (
      this.props.selectedpathActivities[
        Object.keys(this.props.selectedpathActivities)[0]
      ] || {}
    ).path;
    const prevActivityPath = (
      prevProps.selectedpathActivities[
        Object.keys(prevProps.selectedpathActivities)[0]
      ] || {}
    ).path;

    if (
      activityPath !== prevActivityPath ||
      JSON.stringify(this.props.attempts) !== JSON.stringify(prevProps.attempts)
    ) {
      this.createTimeTakenChartDataSource(this.props.attempts);
      this.createNumOfAttemptsChartDataSource(this.props.attempts);
    }
  }

  createTimeTakenChartDataSource(attempts) {
    const { timeTakenChartDataSource, selectedPathId } = this.state;
    const uniqueActivities = {};
    Object.keys(attempts).forEach(id => {
      const data = attempts[id];
      if (data.completed === 1) {
        const activityId = data.activityKey;
        const timeTakenToSolveActivityInMin = Math.round(
          (data.time - data.open) / (1000 * 60)
        );
        if (uniqueActivities[activityId]) {
          uniqueActivities[activityId].push(timeTakenToSolveActivityInMin);
        } else {
          uniqueActivities[activityId] = [timeTakenToSolveActivityInMin];
        }
      }
    });
    const xLabels = Object.keys(uniqueActivities).map(activityId => ({
      label: this.getActivityName(activityId)
    }));
    const dataset = Object.keys(uniqueActivities).map(activityId => ({
      value: uniqueActivities[activityId].join(", ")
    }));

    this.setState({
      timeTakenChartDataSource: {
        ...timeTakenChartDataSource,
        categories: [
          {
            category: xLabels
          }
        ],
        dataset: [
          {
            seriesname: selectedPathId,
            data: dataset
          }
        ]
      }
    });
  }
  createNumOfAttemptsChartDataSource(attempts) {
    const { numOfAttemptsChartDataSource, selectedPathId } = this.state;
    const uniqueActivities = {};
    Object.keys(attempts).forEach(id => {
      const data = attempts[id];
      const activityId = data.activityKey;
      if (uniqueActivities[activityId]) {
        uniqueActivities[activityId] += 1;
      } else {
        uniqueActivities[activityId] = 1;
      }
    });
    const xLabels = Object.keys(uniqueActivities).map(activityId => ({
      label: this.getActivityName(activityId)
    }));
    const dataset = Object.keys(uniqueActivities).map(activityId => ({
      value: String(uniqueActivities[activityId])
    }));
    this.setState({
      numOfAttemptsChartDataSource: {
        ...numOfAttemptsChartDataSource,
        categories: [
          {
            category: xLabels
          }
        ],
        dataset: [
          {
            seriesname: selectedPathId,
            data: dataset
          }
        ]
      }
    });
  }
  getActivityName = activityId => {
    return (
      (this.props.selectedpathActivities[activityId] || {}).name || activityId
    );
  };
  render() {
    const {
      anchorEl,
      anchorEl1,
      timeTakenChartDataSource,
      numOfAttemptsChartDataSource,
      selectedPathId,
      totalAttempttedActivities,
      rangeGap
    } = this.state;
    const { ownerPaths, selectedpathActivities, attempts } = this.props;
    return (
      <Fragment>
        <div style={{ display: "flex" }}>
          <Typography style={{ flexDirection: "column" }} variant="h5">
            Path Activities Analysis
          </Typography>
        </div>
        <Button
          aria-haspopup="true"
          aria-owns={anchorEl ? "simple-menu" : undefined}
          color="primary"
          onClick={e => this.handleClick("anchorEl", e)}
          variant="contained"
        >
          {selectedPathId
            ? `Selected Path: ${ownerPaths[selectedPathId].name}`
            : "Please select a Path"}
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="simple-menu"
          onClose={this.handleClose}
          open={Boolean(anchorEl)}
        >
          {this.renderDropdownItems()}
        </Menu>
        &nbsp; &nbsp;
        {selectedPathId && (
          <Fragment>
            <Button
              aria-haspopup="true"
              aria-owns={anchorEl1 ? "simple-menu1" : undefined}
              color="primary"
              onClick={e => this.handleClick("anchorEl1", e)}
              variant="contained"
            >
              Selected Range: {totalAttempttedActivities >0 ? `1 - ${Math.min(
            rangeGap,
            totalAttempttedActivities
          )}` : "0 - 0"}
            </Button>
            <Menu
              anchorEl={anchorEl1}
              id="simple-menu1"
              onClose={this.handleClose}
              open={Boolean(anchorEl1)}
            >
              {this.renderDropdownRangeItems()}
            </Menu>
            <Typography variant="h6">
              Total Activities in Path: {Object.keys(selectedpathActivities).length}{" "}
              &nbsp; Total Attempts By Users: {Object.keys(attempts).length}
            </Typography>
            <Typography variant="h6">
              Total Completed Attempts: {Object.keys(attempts).map(id => attempts[id].completed === 1).length}&nbsp;
              Total Attempted Activities: {totalAttempttedActivities}
            </Typography>
          </Fragment>
        )}

        <Paper style={{ marginTop: "20px" }}>
          <ReactFCLoad
            type="boxandwhisker2d"
            width="100%"
            height={500}
            dataFormat="JSON"
            dataSource={timeTakenChartDataSource}
          />
        </Paper>
        <Paper style={{ marginTop: "50px" }}>
          <ReactFCLoad
            type="boxandwhisker2d"
            width="100%"
            height={500}
            dataFormat="JSON"
            dataSource={numOfAttemptsChartDataSource}
          />
        </Paper>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ownerPaths: state.firebase.data.ownerPaths,
  selectedPath: state.CRUDdemo.selectedPath,
  attempts: state.CRUDdemo.attempts || {},
  selectedpathActivities: state.firebase.data.selectedpathActivities || {}
});

const mapDispatchToProps = {
  updateSelectedPath,
  fetchActivityAttempts
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firebaseConnect((ownProps, store) => {
    const firebaseAuthUser = store.getState().firebase.auth;
    const selectedpathActivities = [];
    const selectedPath = store.getState().CRUDdemo.selectedPath;
    if (selectedPath && selectedPath.id) {
      selectedpathActivities.push({
        path: "/activities",
        storeAs: "selectedpathActivities",
        queryParams: ["orderByChild=path", `equalTo=${selectedPath.id}`]
      });
    }
    return [
      {
        path: "/paths",
        storeAs: "ownerPaths",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuthUser.uid}`]
      },
      ...selectedpathActivities
    ];
  })
)(ActivitiesAnalytics);
