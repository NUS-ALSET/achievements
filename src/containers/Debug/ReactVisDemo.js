import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalGridLines, VerticalBarSeries, MarkSeries,
    Crosshair, LabelSeries} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import { Button} from 'react-bootstrap';

class ReactVisDemo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          crosshairValues: [],
          modeIndex: 0,
          actIndex: 0,
        };
      }
    
    // Method to calculate the average number of attempts for each activity
    calculateAvg = (actData) => {
        let totalTemp = 0;
        let totalY = 0;

		for (let i = 0; i < actData.length; i++){
            totalTemp += actData[i].x * actData[i].y;
            totalY += actData[i].y;
        }

        return [{x:totalTemp/totalY ,y:0, size: 50}];
    }
    
    // Method to increment counter to cycle through paths
    updateModeIndex = increment => () => {
        const newIndex = this.state.modeIndex + (increment ? 1 : -1);
        const modeIndex =
          newIndex < 0 ? PATHS.length - 1 : newIndex >= PATHS.length ? 0 : newIndex;
        this.setState({
          modeIndex
        });
      };

    updateActIndex = increment => () => {
    const newIndex = this.state.actIndex + (increment ? 1 : -1);
    const actIndex =
        newIndex < 0 ? ACTS.length - 1 : newIndex >= ACTS.length ? 0 : newIndex;
    this.setState({
        actIndex
    });
    };

    render(){
        return (
            <Fragment>
                <h1>Demonstration of <a href="http://uber.github.io/react-vis/">react-vis</a></h1>

				<h3>Trying out <a href="https://github.com/uber/react-vis">react-vis</a> by Uber</h3>
				<XYPlot
                    onMouseLeave={() => this.setState({crosshairValues: []})}
					width={300}
					height={300}>
                    <VerticalGridLines />
					<HorizontalGridLines />
					<LineSeries	onNearestX={(value, {index}) =>
                        this.setState({crosshairValues: data.map(d => d[index])})} 
                        data={data[0]}/>
                    <Crosshair values={this.state.crosshairValues}/>
					<XAxis />
					<YAxis />
				</XYPlot>

                <hr></hr>

                <h3>This is a scatter chart</h3>
                <XYPlot
                    width={300}
                    height={300}
                    color="orange">
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <MarkSeries data={data[0]}/>
                    <XAxis />
                    <YAxis />
                </XYPlot>

                
                <hr></hr>

                <h3>You can even combine 2 charts into 1</h3>
                <XYPlot
					width={300}
					height={300}>
                    <VerticalGridLines />
					<HorizontalGridLines />
					<VerticalBarSeries data={data[0]} color="blue"/>
                    <LineSeries	data={data[0]} color="red"/>
					<XAxis />
					<YAxis />
				</XYPlot>

                <hr></hr>

                <h3>Interactive chart to show the average number of attempts per activity on a path</h3>
                Explaination: X axis shows the number of attempts.<br></br>
                The red dot refers to the average number of attempts.<br></br>
                We can cycle through the chart for different paths such as "Vue","React","Firebase" and for each
                path we can cycle through each activities such as  "Vue 1","Vue 2","Vue 3".
                <br></br><br></br>
                <div className="centered-and-flexed">
                    <div className="centered-and-flexed-controls">
                        <Button onClick={this.updateModeIndex(false)}> PREV </Button>
                        <b> {`Path type: ${PATHS[this.state.modeIndex]}`} </b>
                        <Button onClick={this.updateModeIndex(true)}> NEXT </Button>
                    </div>
                </div>

                <XYPlot
					width={800}
					height={500}>
                    <VerticalGridLines />
					<HorizontalGridLines />
					<VerticalBarSeries data={dataAll[parseInt(`${ACTS[this.state.actIndex]}`)-1]} color="blue"/>
                    <MarkSeries data={this.calculateAvg(dataAll[parseInt(`${ACTS[this.state.actIndex]}`)-1])}  color="red"/>
					<XAxis />
					<YAxis />
				</XYPlot>

                <div className="centered-and-flexed">
                    <div className="centered-and-flexed-controls">
                        <Button onClick={this.updateActIndex(false)}> PREV </Button>
                        <b> {`${PATHS[this.state.modeIndex]} ${ACTS[this.state.actIndex]}`} </b>
                        <Button onClick={this.updateActIndex(true)}> NEXT </Button>
                    </div>
                </div>
                
            </Fragment>
        );
    }
}

// This is where you store your data for your reactVis charts
const data = [
    [{x: 0, y: 8},
    {x: 1, y: 5},
    {x: 2, y: 4},
    {x: 3, y: 9},
    {x: 4, y: 1},
    {x: 5, y: 7},
    {x: 6, y: 6},
    {x: 7, y: 3},
    {x: 8, y: 2},
    {x: 9, y: 0}],
];

const dataAll = [
    [{x: 3, y: 8},
    {x: 4, y: 5},
    {x: 5, y: 4},
    {x: 6, y: 9},
    {x: 7, y: 1},
    {x: 8, y: 7}],

    [{x: 3, y: 12},
    {x: 4, y: 15},
    {x: 5, y: 14},
    {x: 6, y: 94},
    {x: 7, y: 12},
    {x: 8, y: 73}],

    [{x: 3, y: 55},
    {x: 4, y: 44},
    {x: 5, y: 33},
    {x: 6, y: 77},
    {x: 7, y: 22},
    {x: 8, y: 88}],

    [{x: 3, y: 152},
    {x: 4, y: 153},
    {x: 5, y: 134},
    {x: 6, y: 224},
    {x: 7, y: 192},
    {x: 8, y: 173}],

    [{x: 3, y: 2},
    {x: 4, y: 5},
    {x: 5, y: 4},
    {x: 6, y: 24},
    {x: 7, y: 2},
    {x: 8, y: 3}],
];

const PATHS = ["Vue","React","Firebase"];   // A list of paths
const ACTS = ["1","2","3","4","5"]; // A list of activities for each path



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
          path: "/ReactVisDemo",
          storeAs: "ReactVisDemoPath",
          queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
        }
      ];
    }),
    connect(mapStateToProps)
  )(ReactVisDemo)