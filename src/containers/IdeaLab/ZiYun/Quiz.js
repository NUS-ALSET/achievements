import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

class Quiz extends Component { 
    state = {
        index: 0,
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
            correct: 6,
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
                correct: 4,
                answer: false}
        ]
    }
    increment = (index) => {
        //console.log(index);
        this.setState({
            index: index
        })
    }
    render() {
        //console.log("rendered Quiz");
        return (
            <div>
                <div>
                    { this.state.index<this.state.questions.length &&
                    <h3> Question {this.state.index + 1}: </h3>}
                </div>
                <div>
                    <AnswerContainer questions={(this.state.index<this.state.questions.length) ? (this.state.questions[this.state.index]): (null) } 
                    index={this.state.index} increment={this.increment}/>
                </div>
            </div>
        )
    }
}

class Answer extends Component {
    state = { 
        color: this.props.color, // grey
    }
    handleClick = (e) => {
        //e.persist();
        //console.log(this.props.value)
        this.props.clicked(this.props._id);
        if (this.props._id === this.props.correct){
            console.log(this.props.value, 'is the correct answer.');
            this.setState({
                color: '#58D68D' // green
            })
            this.props.answer(true);
        }
        else {
            console.log('You chose',this.props.value,'which is wrong. Try again');
            this.setState({
                color: '#EC7063' // red
            })
            this.props.answer(false);
        }
        //console.log(e);
    }
    render(){
        //console.log("rendered Answer");
        //console.log(this)
        return (
            <div>
                <StyledButton onClick={ this.handleClick } 
                style={ {background: ((this.props.click===this.props._id) ? (this.state.color) : ('#BDC3C7')) } }>
                    {this.props.value}
                </StyledButton>
            </div>
        )
    }
}

class AnswerContainer extends Component {
    state = {answer:false, clicked: null, color: '#BDC3C7'}
    constructor(props){
        super(props)
        this.state = this.getInitialState()
    }
    getInitialState(){
        const initialState = {answer:false, clicked: null, color: '#BDC3C7', reset: false}
        return initialState;
    }
    resetState = () =>{
        this.setState({reset: true});
        this.setState(this.getInitialState());
    }
    answer = (ans) =>{
        this.setState({
            answer: ans
        })
    }
    clicked = (id) => {
        this.setState({clicked: id})
    }
    render(){
        const { questions, index } = this.props;
        //console.log(index);
        //console.log('rendered AnswerContainer');
        return (
            <div>
            { questions && 
                <div>
                <h3> { questions.question } </h3>
                { questions.options.map(function(obj, i) {
                    return (
                        <div key={i}>
                            <Answer value={ obj } _id={i} correct={ questions.correct } 
                            answer={this.answer} 
                            clicked={this.clicked} click={this.state.clicked}
                            color={this.state.color}
                            /> 
                        </div>
                    )
                }, this) }
                {this.state.answer &&
                    <StyledButton style={{width: 120, background: '#19237E', color: 'white'}}
                    onClick={() => {this.props.increment(index+1); this.resetState()}}>Continue</StyledButton>
                }
                </div>
            }
            {questions===null && 
                <div>
                    <h3>Quiz Completed!</h3>
                    <Button>Submit</Button>
                </div>
            }
            </div>
        
        )
    }
}

const StyledButton = withStyles({
    root: {
      background: '#BDC3C7',
      borderRadius: 3,
      border: 0,
      color: 'default',
      height: 48,
      width: 500,
      padding: '0 30px',
      margin: '2px'
      //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
      textTransform: 'capitalize',
    },
  })(({ classes, color, ...other }) => <Button className={classes.root} {...other} />);;

export default Quiz;