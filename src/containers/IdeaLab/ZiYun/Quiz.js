import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

class Quiz extends Component { 
    state = {
        index: 0,
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
                
                    { this.state.index<this.props.questions.length &&
                    <Grid container spacing={40} alignItems={'center'} 
                    justify={'space-between'}>
                        <Grid item xs={2}>
                            <Typography variant={'h6'}> Question {this.state.index + 1}: </Typography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}>
                            <StyledButton style={{width: 100, background: '#19237E', color: 'white', margin: '0 4 0 4'}}
                            onClick={() => {this.props.edit(true)}}
                            >
                                Edit</StyledButton>
                        </Grid>
                    </Grid>
                    }
                
                <div>
                    <AnswerContainer 
                        questions={(this.state.index<this.props.questions.length) ? (this.props.questions[this.state.index]): (null) } 
                        index={this.state.index} 
                        increment={this.increment} 
                        total={this.props.questions.length} />
                    
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
        if (this.props.value === this.props.correct){
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
                <Typography variant={'subtitle1'}> { questions.question } </Typography>
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
                {(this.state.answer && index<this.props.total-1) &&
                    <StyledButton style={{width: 120, background: '#19237E', color: 'white'}}
                    onClick={() => {this.props.increment(index+1); this.resetState()}}>Continue</StyledButton>
                }
                {
                    (this.state.answer && index===this.props.total-1) &&
                    <StyledButton style={{width: 120, background: '#19237E', color: 'white'}}
                    >Submit</StyledButton>
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