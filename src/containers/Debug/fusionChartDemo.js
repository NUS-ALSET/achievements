import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";

// Charting packages from fusionChart
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import powerCharts from 'fusioncharts/fusioncharts.powercharts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";

ReactFC.fcRoot(FusionCharts, Charts,powerCharts, FusionTheme);


class fusionChartDemo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          actIndex: 0,  // For us to cycle through the activities
        };
    }

    // Method to increment counter to cycle through activities
    updateActIndex = increment => () => {
        const newIndex = this.state.actIndex + (increment ? 1 : -1);
        const actIndex =
            newIndex < 0 ? myDataSource.categories[0].category.length -1 : newIndex >= myDataSource.categories[0].category.length ? 0 : newIndex;
        this.setState({
            actIndex
        });
    };

    render(){
        return (
            <Fragment>
                <Typography variant="h5">This page will be shown after user click on the "Analytics" button in their
                     respective paths.</Typography>
                <Typography variant="h5">This is the main chart. Useful to compare statistics across all activities</Typography>
                <ReactFC {...chartConfigs} />   


                <Typography variant="h5">Secondary chart. Allow users to view their charts activity
                     by activity to reduce cluttering.</Typography>
                {/*Object must be placed here to force re-render*/}
                <ReactFC {...{
                    type: 'boxandwhisker2d',
                    width: '50%',
                    height: 500,
                    dataFormat: 'json',
                    dataSource: {
                        "chart": myDataSource.chart,
                        "categories": [
                            {
                            "category": [
                                myDataSource.categories[0].category[this.state.actIndex]
                            ]
                            }
                        ],
                        "dataset": [
                            {
                            "seriesname": "Interquartile Range",
                            "data": [
                                myDataSource.dataset[0].data[this.state.actIndex]
                            ]
                            }
                        ]
                    },
                }} />
                <br></br>

                {/*Button at the bottom of the page for users to cycle through their box and whiskers*/}
                <Typography variant="h6">
                    <Button size="small" disabled={this.state.actIndex === 0} variant="outlined" color="primary"
                     onClick={this.updateActIndex(false)}> Previous activity </Button>

                        {` ${myDataSource.categories[0].category[this.state.actIndex].label} `}
                        
                    <Button size="small" disabled={this.state.actIndex === 7} variant="outlined" color="secondary"
                     onClick={this.updateActIndex(true)}> Next activity </Button> 
                </Typography>
                
            </Fragment>
        );
    }
}


// Function to seperate the outliers from the list of data
const calcOutlier = (data,type) => {
    data.sort(function(a,b){return a-b});

    var l = data.length;

    var sum=0;     // stores sum of elements
    for(var i=0;i<data.length;i++) {
        sum+=data[i];
    }
    var mean = sum/l; 

    var median = data[Math.round(l/2)];
    var LQ = data[Math.round(l/4)];
    var UQ = data[Math.round(3*l/4)];
    var IQR = UQ-LQ;
    var wantedValues = [];
    var outliers = [];
    for(var j=0;j<data.length;j++) {
        if(data[j]> median - 3 * IQR && data[j] < mean + 3 * IQR){
            wantedValues.push(data[j]);
        } else {
            outliers.push(data[j]);
        }
    }
    if (type === "value"){
        return wantedValues.toString();
    } else {
        return outliers.toString();
    }
}

// Static data for charting purpose. To be replaced with automated data retrieval in the future.
const myDataSource = {
    "chart": {
        "caption": "Intro to React",
        "subcaption": "Time taken to solve each activity",
        "toolTipBgAlpha": "100", //Opacity of tooltip
        "sshowvalues": "0",
        "palettecolors": "#5D62B5, #979AD0",
        "yaxisname": "Time (mins)",
        "showmean": "1",
        "meanIconRadius": "10",
        "showmedianvalues": "0",
        "theme": "fusion",
        "meaniconshape": "polygon",
        "meaniconsides": "2",
        "meaniconradius": "2",
        "showalloutliers": "1",
        "outliericonsides": "20",
        "outliericonalpha": "40",
        "outliericonshape": "triangle",
        "outliericonradius": "4",
        "plotspacepercent": "60",
        "plottooltext": "<b><u>Time taken to complete \"$label\"</u>:</b><br> <br> Max: $maxDataValue mins <br> Min: $minDataValue mins <br> <br> Mean: $mean mins <br> <br> Q3: $Q3 mins <br> Median: $median mins <br> Q1: $Q1 mins"
    },
    "categories": [
        {
        "category": [
            {
            "label": "1. Introduction"
            },
            {
            "label": "2. Setup"
            },
            {
            "label": "3. Props"
            },
            {
            "label": "4. Components"
            },
            {
            "label": "5. Redux"
            },
            {
            "label": "6. DOM Events"
            },
            {
            "label": "7. Conditional Output"
            },
            {
            "label": "8. CSS Files"
            }
        ]
        }
    ],
    "dataset": [
        {
        "seriesname": "Interquartile Range",
        "data": [
            {
            "value": calcOutlier([5, 10, 8, 6, 7, 9, 13, 5, 17, 100],"value"),   // Both uses the same list of data
            "outliers": calcOutlier([5, 10, 8, 6, 7, 9, 13, 5, 17, 100],"outlier")
            },
            {
            "value": calcOutlier([2, 4, 2, 5, 3, 6, 4, 5, 30],"value"),
            "outliers": calcOutlier([2, 4, 2, 5, 3, 6, 4, 5, 3],"outlier")
            },
            {
            "value": calcOutlier([21, 20, 26, 27, 30, 40, 50, 35, 10, 70],"value"),
            "outliers": calcOutlier([21, 20, 26, 27, 30, 40, 50, 35, 10, 70],"outlier")
            },
            {
            "value": calcOutlier([23, 25, 21, 32, 36, 29, 31, 29, 29, 46], "value"),
            "outliers": calcOutlier([23, 25, 21, 32, 36, 29, 31, 29, 29, 46], "outlier")
            },
            {
            "value": calcOutlier([60, 70, 67, 65, 80, 66, 62, 22, 120, 100],"value"),
            "outliers": calcOutlier([60, 70, 67, 65, 80, 66, 62, 22, 120, 100],"outlier")
            },
            {
            "value": calcOutlier([33, 37, 39, 29, 52, 47, 32, 35, 5, 90],"value"),
            "outliers": calcOutlier([33, 37, 39, 29, 52, 47, 32, 35, 5, 90],"outlier")
            },
            {
            "value": calcOutlier([55, 57, 59, 59, 42, 47, 42, 45, 60, 59],"value"),
            "outliers": calcOutlier([55, 57, 59, 59, 42, 47, 42, 45, 60, 59],"outlier")
            },
            {
            "value": calcOutlier([70, 77, 79, 89, 72, 87, 72, 75, 20, 120],"value"),
            "outliers": calcOutlier([70, 77, 79, 89, 72, 87, 72, 75, 20, 120],"outlier")
            }
        ]
        }
    ]
};

const chartConfigs = {  // chartConfig is for the first main chart you see
    type: 'boxandwhisker2d',
    width: '100%',
    height: 500,
    dataFormat: 'json',
    dataSource: myDataSource,
};  


const mapStateToProps = (state, ownProps) => ({
    uid: state.firebase.auth.uid,
    completedActivities : state.firebase.ordered.completedActivities,
    publicPaths : state.firebase.ordered.publicPaths,
    unsolvedPublicActivities : state.problem.unsolvedPublicActivities || [],
    publicActivitiesFetched : state.problem.publicActivitiesFetched
  });


export default compose(
    firebaseConnect((ownProps, store) => {
      const state = store.getState();
      const firebaseAuth = state.firebase.auth;

      if (!firebaseAuth.uid) {
        return [];
      }

      return [
        {
          path: "/fusionChartDemo",
          storeAs: "fusionChartDemoPath",
          queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
        }
      ];
    }),
    connect(mapStateToProps)
  )(fusionChartDemo)