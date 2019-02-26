import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
// code-spliting
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Typography } from "@material-ui/core";
import { firebaseConnect } from "react-redux-firebase";
import ReactFusioncharts from "react-fusioncharts";

import {
  changePathKeyJupSol,
  initAnalyticsData,
  filterAnalyticsData,
  updateSelectedPath,
  fetchActivityAttempts
} from "./actions";
import { selectDataset } from "./reducer";

class PathAnalytics extends React.PureComponent {
  static propTypes = {
    fetchActivityAttempts: PropTypes.func,
    pathData: PropTypes.object,
    updateSelectedPath: PropTypes.func,
    ownerPaths: PropTypes.object
  };
  state = {
    anchorEl: null,
    loading: true
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  renderDropdownItems = () => {
    const ownerPaths = this.props.ownerPaths;
    return ownerPaths && Object.keys(ownerPaths).map((key, i) => (
      <MenuItem
        key={key+i}
        onClick={() => {
          this.pathSelected(ownerPaths[key], key);
          this.handleClose();
        }}
      >
        {ownerPaths[key].name} - {key}
      </MenuItem>
    ))
  }

  pathSelected = (path, key) => {
    this.props.updateSelectedPath(path, key);
    // get activityAttempts from DB
    this.props.fetchActivityAttempts(key);
  }

  getFirstElement = obj => {
    const isObjectEmpty = Object.entries(obj).length === 0 && obj.constructor === Object;
    return !isObjectEmpty ? obj[Object.keys(obj || {})[0]] : "";
  }

  render() {
    const {
      anchorEl
    } = this.state;
    const {
      ownerPaths,
      pathData
    } = this.props;


    // eslint-disable-next-line no-unused-expressions
    !this.props.selectedPath && Object.keys(ownerPaths || {}).length > 0 && this.props.updateSelectedPath(this.getFirstElement(ownerPaths || {}), Object.keys(ownerPaths)[0]);
    
    const { usersCompletedActivities, activities } = pathData;

    const xLabels = Object.keys(activities).map((id, index)=>({ label: String(index+1)}));
    const totalUsers = Object.keys(usersCompletedActivities).length;
    const dataSet1 = xLabels.map(ele=>{
      const usersCount = Object.keys(usersCompletedActivities).reduce((count, userId)=>{
        return usersCompletedActivities[userId] >= Number(ele.label) ? ++count : count
      },0);
      return {
        value : totalUsers > 0 ? (usersCount / totalUsers) * 100 : 0
      }
    })
    const dataSource = {
      "chart": {
        "caption": "Path Analytics",
        "yaxisname": "% of users",
        "subcaption": "How far along a path users are progressing",
        "showhovereffect": "1",
        "numbersuffix": "%",
        "drawcrossline": "1",
        "plottooltext": "<b>$dataValue</b> of users completed in $seriesName",
        // "theme": "fusion"
      },
      "categories": [
        {
          "category": xLabels
        }
      ],
      "dataset":[
        {
          seriesname: "All time",
          data: dataSet1
        }
      ]
    };
    return (
      <Fragment>
        <Fragment>
            <Fragment>
              <div style={{ display: "flex" }}>
                <Typography style = {{ flexDirection: "column" }} variant="h5">
                  Path Analysis
                </Typography>
              </div>

              <Button
                aria-haspopup="true"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                color="primary"
                onClick={this.handleClick}
                variant="contained"
              >
                Select PathKey to fetch
              </Button>
              <Menu
                anchorEl={anchorEl}
                id="simple-menu"
                onClose={this.handleClose}
                open={Boolean(anchorEl)}
              >
                {this.renderDropdownItems()}
              </Menu>
              <hr />
            </Fragment>
        </Fragment>
        <div style={{ height : "300px"}}>
        <ReactFusioncharts
          dataFormat = "JSON"
          dataSource = {dataSource}
          height = '100%'
          type = "msline"
          width = '100%'
        />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ownerPaths: state.firebase.data.ownerPaths,
  selectedPath: state.CRUDdemo.selectedPath,
  pathData: selectDataset(state)
});

const mapDispatchToProps = {
  updateSelectedPath,
  fetchActivityAttempts
};

export default compose(
  firebaseConnect((ownProps, store) => {
    const firebaseAuthUser = store.getState().firebase.auth;
    return [
      {
        path: "/paths",
        storeAs: "ownerPaths",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuthUser.uid}`]
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PathAnalytics);
