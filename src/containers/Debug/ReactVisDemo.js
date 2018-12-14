import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";
import { Boxplot, computeBoxplotStats, } from 'react-boxplot';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalGridLines, VerticalBarSeries, MarkSeries,
    Crosshair} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';

class ReactVisDemo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          crosshairValues: []
        };
      }

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