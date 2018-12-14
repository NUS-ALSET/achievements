import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";
import { ScatterChart, Scatter, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip} from 'recharts';
import { Boxplot, computeBoxplotStats, } from 'react-boxplot'


class rechartDemo extends React.PureComponent {
    // constructor(props){
    //     super(props);
    // }

    render(){
        return (
            <Fragment>
                <h1>Demonstration of <a href="http://recharts.org/en-US/">Rechart</a></h1>
				<h2><a href="https://moduscreate.com/blog/ext-js-to-react-charting/">Reference</a></h2>

				<h3> This is a line chart</h3>
				<LineChart width={730} height={250} data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Legend />
					<Tooltip />
					<Line type="monotone" dataKey="Category1" stroke="#8884d8" />
					<Line type="monotone" dataKey="Category2" stroke="#82ca9d" />
				</LineChart>

				<hr></hr>

				<h3>This is a bar chart</h3> 
				<BarChart width={730} height={250} data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Legend />
					<Tooltip />
					<Bar dataKey="Category1" fill="#8884d8" />
					<Bar dataKey="Category2" fill="#82ca9d" />
				</BarChart>

				<hr></hr>

				<h3>This is a scatter chart</h3> 
				<ScatterChart width={730} height={250}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="Category1" />
					<YAxis dataKey="Category2" />
					<Legend />
					<Tooltip />
					<Scatter name='Category1 / Category2' data={data} fill='#8884d8'/>
				</ScatterChart>

				<hr></hr>

				<h3>This is a box and whisker plot from <a href="https://www.npmjs.com/package/react-boxplot">react-boxplot</a>.
				Useful to find outliers and IQR in data</h3>
				The values are 14,15,16,16,17,17,17,17,17,18,18,18,18,18,18,19,19,19,20,20,20,20,20,
				20,21,21,22,23,24,24,29.<br></br>
				<u>Issue: I do not think this library allows us to label our chart</u>
				<br></br>
				<br></br>
				<Boxplot
					width={400}
					height={20}
					orientation="horizontal"
					min={0}
					max={30}
					stats={computeBoxplotStats(boxPlotValues)}
				/>
            </Fragment>
        );
    }
}

// This is where you store your data for your rechart charts
const data = [
	{name: 'A', Category1: 4000, Category2: 2400},
	{name: 'B', Category1: 3000, Category2: 1398},
	{name: 'C', Category1: 2000, Category2: 9800},
	{name: 'D', Category1: 2780, Category2: 3908},
	{name: 'E', Category1: 1890, Category2: 4800},
	{name: 'F', Category1: 2390, Category2: 3800},
	{name: 'G', Category1: 3490, Category2: 4300}
	];

const boxPlotValues = [14,15,16,16,17,17,17,17,17,18,18,18,18,18,18,19,19,19,20,20,20,20,20,
	20,21,21,22,23,24,24,29,]
  
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
          path: "/rechartDemo",
          storeAs: "rechartDemoPath",
          queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
        }
      ];
    }),
    connect(mapStateToProps)
  )(rechartDemo)