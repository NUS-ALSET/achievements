import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";

import {XYPlot, XAxis, YAxis, VerticalBarSeries, LabelSeries, HorizontalGridLines, VerticalGridLines} from 'react-vis';
//import {BarChart, Bar, CartesianGrid} from 'recharts';

import Quiz from './Quiz.js';

class ZiYun extends React.PureComponent {
  // constructor(props){
  //     super(props);
  // }
  state = {
    name: 'Zi Yun',
    header: 'Hello There! :)',
    data: [
      { "y": 100, "x": "Jan" },
      { "y": 112, "x": "Feb" },
      { "y": 230, "x": "Mar" },
      { "y": 268, "x": "Apr" },
      { "y": 300, "x": "May" },
      { "y": 310, "x": "Jun" },
      { "y": 315, "x": "Jul" },
      { "y": 340, "x": "Aug" },
      { "y": 388, "x": "Sep" },
      { "y": 404, "x": "Oct" },
      { "y": 442, "x": "Nov" },
      { "y": 447, "x": "Dec" }
    ],
    data2: [
      { y: 100, x: 1 },
      { y: 112, x: 2 },
      { y: 230, x: 3 },
      { y: 268, x: 4 },
      { y: 300, x: 5 },
      { y: 310, x: 6 },
      { y: 315, x: 7 },
      { y: 340, x: 8 },
      { y: 388, x: 9 },
      { y: 404, x: 10 },
      { y: 442, x: 11 },
      { y: 447, x: 12 }
    ],
    textValue: '',
    fruit: ['choose']
  }
  handleSubmit = (event) => {
    //console.log(event);
    var name = this.state.textValue;
    var fruit = this.state.fruit;
    alert('Thank you '+name+'! Your chosen fruit is '+fruit);
    //this.setState({ name: event.target.value });
    event.preventDefault();
  }
  handleChange = (event) => {
    if (event.target.id === 'fruit'){
      var options = event.target.options;
      var value = [];
      for (var i = 0; i<options.length; i++){
        if (options[i].selected){
          value.push(options[i].value);
        }
      }
      this.setState({ [event.target.id]: value });
    }
    else {
      this.setState({ [event.target.id] : event.target.value });
    }
  }
  /*
  handleTextChange = (event) => {
    this.setState({textValue: event.target.value });
  }
  handleSelectChange = (event) => {
    var options = event.target.options;
    var value = [];
    for (var i = 0; i<options.length; i++){
      if (options[i].selected){
        value.push(options[i].value);
      }
    }
    this.setState({ fruit: value });
  }
  */
  render() {
    return (
      <Fragment>
        <h1> { this.state.header } </h1>
        <div>This is { this.state.name }'s hidden route! :) </div>
        <h4>Sample Quiz: </h4>
        <Quiz />
        <h4> Sample Form: </h4>
        <form onSubmit={ this.handleSubmit }> 
          <label>
            Please enter your name. <br />
            <input id='textValue' type='text' onChange={ this.handleChange } placeholder='name' ></input> 
          </label> 
          <br />
          <label>
            Please select your favourite fruit(s). <br />
            <select id='fruit' multiple={true} type='checkbox' value={this.state.fruit} onChange={ this.handleChange }>
              <option value='choose' disabled>Choose fruit</option>
              <option value='apple'>Apple</option>
              <option value='coconut'>Coconut</option>
              <option value='grapefruit'>Grapefruit</option>
              <option value='mango'>Mango</option>
            </select>
          </label>
          <br />
          <input type='submit'></input>
        </form>
        <h4> Sample charts: </h4> 
        <XYPlot
          xType='ordinal'
          width={800}
          height={500}
          yDomain={[0, 500]}>
          <VerticalBarSeries
            data={this.state.data}/>
          <XAxis />
          <YAxis />
          <LabelSeries
            data={this.state.data.map(obj => {
              return { ...obj, label: obj.y.toString() }
            })}
            labelAnchorX="middle"
            labelAnchorY="text-after-edge"
            />
          </XYPlot> 
        {/* <BarChart width={800} height={500} data={this.state.data2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" type='category' />
          <YAxis dataKey='y' />
          <Bar fill="#8884d8" />
        </BarChart>  */}
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  uid: state.firebase.auth.uid,
  completedActivities: state.firebase.ordered.completedActivities,
  publicPaths: state.firebase.ordered.publicPaths,
  unsolvedPublicActivities: state.problem.unsolvedPublicActivities || [],
  publicActivitiesFetched: state.problem.publicActivitiesFetched
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
        path: "/ziyun",
        storeAs: "ziyunpath",
        queryParams: ["orderByChild=owner", `equalTo=${firebaseAuth.uid}`]
      }
    ];
  }),
  connect(mapStateToProps)
)(ZiYun);
