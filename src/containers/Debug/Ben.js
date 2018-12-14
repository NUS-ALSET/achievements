import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";
import { ScatterChart, Scatter, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend} from 'recharts';


class Ben extends React.PureComponent {
    // constructor(props){
    //     super(props);
    // }

    render(){
        return (
            <Fragment>
                <h1>Ben's route</h1>
				<h2><a href="https://moduscreate.com/blog/ext-js-to-react-charting/">Reference</a></h2>

				<h3> This is a line chart</h3>
				<LineChart width={730} height={250} data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Legend />
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
					<Scatter name='Category1 / Category2' data={data} fill='#8884d8'/>
				</ScatterChart>
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
          path: "/ben",
          storeAs: "benPath",
          queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
        }
      ];
    }),
    connect(mapStateToProps)
  )(Ben)