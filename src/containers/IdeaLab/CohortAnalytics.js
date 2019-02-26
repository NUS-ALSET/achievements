
import React, { Fragment } from "react";
import PropTypes from "prop-types";

import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import { withStyles } from '@material-ui/core/styles';

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { cohortAnalyticsDataRequest } from "../Cohort/actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";

charts(FusionCharts);



const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


class CohortAnalytics extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    cohortsAnalyticsData: PropTypes.object,
    cohorts: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      dataSource: {
        chart: {
          caption: "User Path Completion Percentage vs Activities Completed",
          yaxisname: "User Path Completion Progress",
          subcaption: "",
          showhovereffect: "1",
          numbersuffix: "%",
          drawcrossline: "1",
          plottooltext: "<b>$dataValue</b> progress in $seriesName"
        },
        categories: [
          {
            category: []
          }
        ],
        dataset: []
      },
      cohortsRequests: {},
      selectedCohortId: null
    };
  }
  addCohortRequestId = cohortId => {
    const cohortsRequests = this.state.cohortsRequests || {};
    cohortsRequests[cohortId] = true;
    this.setState({
      cohortsRequests
    });
  };
  selectCohortId = cohortId => {
    this.setState({ selectedCohortId: cohortId });
    if (!this.state.cohortsRequests[cohortId]) {
      this.requestCohortData(cohortId);
    }else{
      this.createDataSource(cohortId);
    }
  };
  requestCohortData = cohortId => {
    this.setState({ selectedCohortId: cohortId });
    if (this.props.auth.uid) {
      this.addCohortRequestId(cohortId);
      this.props.cohortAnalyticsDataRequest(cohortId);
    }
    return true;
  };

  changeCaption = (cohortId) => {
    const dataSource = this.state.dataSource;
    dataSource.chart.subcaption = (this.props.cohorts[cohortId] || {}).name || cohortId;
    this.setState({
      dataSource
    });
  }
  
  componentDidUpdate(prevProps) {
    if (
      this.props.cohortsAnalyticsData[this.state.selectedCohortId] &&
      !prevProps.cohortsAnalyticsData[this.state.selectedCohortId]
    ) {
      this.createDataSource(this.state.selectedCohortId);
    }
  }

  createDataSource = (selectedCohortId) => {
    const { cohortsAnalyticsData } = this.props;
    const selectedCohortData =
      cohortsAnalyticsData[selectedCohortId].studentsPathProgress || {};
    const maxNumOfActivities = Math.max(
      ...Object.keys(selectedCohortData).map(pathId => {
        const studentProgress = selectedCohortData[pathId].studentProgress;
        return Math.max(
          ...Object.keys(studentProgress).map(stdId => studentProgress[stdId])
        );
      }),
      0
    );
    const xLabels = [];
    for (let index = 0; index <= maxNumOfActivities; index++) {
      xLabels.push({
        label: String(index + 1),
        numberOfCompletedActivities: index + 1
      });
    }
    const dataset = [];
    Object.keys(selectedCohortData).forEach(pathId => {
      const path = selectedCohortData[pathId];
      const data = [];
      const totalUsers = Object.keys(path.studentProgress).length;
      xLabels.forEach(element => {
        const usersCount = Object.keys(path.studentProgress).reduce(
          (count, stdId) =>
            path.studentProgress[stdId] >= element.numberOfCompletedActivities
              ? ++count
              : count,
          0
        );
        data.push({
          value: totalUsers > 0 ? (usersCount / totalUsers) * 100 : 0
        });
      });
      dataset.push({
        seriesname: path.name,
        data
      });
    });
    this.changeCaption(selectedCohortId);
    this.setState({
      dataSource: {
        ...this.state.dataSource,
        categories: [
          {
            category: xLabels
          }
        ],
        dataset
      }
    });
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { auth, cohorts } = this.props;
    const { dataSource, anchorEl, selectedCohortId } = this.state;
    if(!auth.uid){
      return "Please login first."
    }
    return (
      <Fragment>
        <Button
          aria-haspopup="true"
          aria-owns={anchorEl ? "simple-menu" : undefined}
          color="primary"
          onClick={this.handleClick}
          variant="contained"
        >
          { selectedCohortId ? `Selected Cohort: ${dataSource.chart.subcaption}`: 'Please Select A Cohort'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="simple-menu"
          onClose={this.handleClose}
          open={Boolean(anchorEl)}
        >
          {Object.keys(cohorts).map(cohortId => (
            <MenuItem
              key={cohortId}
              onClick={() => {
                this.selectCohortId(cohortId);
                this.handleClose();
              }}
            >
              {cohorts[cohortId].name || cohortId}
            </MenuItem>
          ))}
        </Menu>
        <br/>
        { selectedCohortId && 
            <div style={{ height: "500px" }}>
            <ReactFusioncharts
              type="msline"
              width="100%"
              height="100%"
              dataFormat="JSON"
              dataSource={this.state.dataSource}
            />
          </div>
        }
      
      </Fragment>
    );
  }
}

// inject saga to the main saga
sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  cohortsAnalyticsData: state.cohort.cohortsAnalytics || {},
  cohorts: state.firebase.data.cohorts || {}
});

const mapDispatchToProps = {
  cohortAnalyticsDataRequest
};

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return firebaseAuth.isEmpty
      ? []
      : [
          {
            path: "/cohorts"
          }
        ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CohortAnalytics);
