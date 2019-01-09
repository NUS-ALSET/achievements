import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";

import { Typography } from "@material-ui/core";

import Quiz from './Quiz.js';
import EditQuiz from './EditQuiz.js';

class ZiYun extends React.PureComponent {
  state = {
    editView: false,
    questions: [{
      question: 'How many times do you use Achievements per week?',
      options: [
          'true', 
          'false', 
          'increasing', 
          'decreasing', 
          'larger', 
          'smaller', 
          'frequently', 
          'rarely'
      ],
      correct: 'frequently',
      answer: false},
      {
      question: 'How many times do you use Facebook per week?',
      options: [
          'true', 
          'false', 
          'increasing', 
          'decreasing', 
          'larger', 
          'smaller', 
          'frequently', 
          'rarely'
      ],
      correct: 'larger',
      answer: false}
    ]
  }
  edit = (i) => {
    this.setState({editView: i})
  }
  saved = (oldQ, newQ) => {
    this.setState( state => {
      const questions = oldQ.concat(newQ)
      return {
        questions, 
        editView:false
      }
    })
  }
  render() {
    return (
      <Fragment>
        <Typography variant={'h6'}> Quiz: </Typography>
        { this.state.editView===false &&
          <Quiz edit={this.edit} questions={this.state.questions} /> 
        }

        { this.state.editView===true && 
          <EditQuiz 
            questions={this.state.questions} 
            saved={this.saved}
          /> 
        }
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
