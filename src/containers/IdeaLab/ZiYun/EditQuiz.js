import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography, Divider, FormLabel } from "@material-ui/core";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@material-ui/core";

const defaultOptions = [
    'true', 
    'false', 
    'increasing', 
    'decreasing', 
    'larger', 
    'smaller', 
    'frequently', 
    'rarely'
]

const defaultQ = ''

class EditQuiz extends Component {
    state = {
        prevQuestions: this.props.questions,
        questions: []
    }
    addQues = () => {
        this.setState(state => {
            const questions = state.questions.concat({
                question: defaultQ,
                options: defaultOptions,
                correct: 'true'
            })

            return {questions}
        })
    }
    editQuest = (type, i, event) => {
        event.persist();
        if (type==="new") {
            this.setState(state => {
                const questions = state.questions.map((obj, j)=>{
                    if (j===i){
                        return {
                            question: event.target.value,
                            options: obj.options,
                            correct: obj.correct
                        }
                    }
                    else { return obj }
                })
                return {questions}
            })
        }
        else {
            this.setState(state => {
                const prevQuestions = state.prevQuestions.map((obj, j)=>{
                    if (j===i){
                        return {
                            question: event.target.value,
                            options: obj.options,
                            correct: obj.correct
                        }
                    }
                    else { return obj }
                })
                return {prevQuestions}
            })
        }
    }
    removeQues = (type, i) => {
        if (type==="new"){
            this.setState(state => {
                const questions = state.questions.filter((item, j) => i!==j);
                return {questions}
            })
        } else {
            this.setState(state => {
                const prevQuestions = state.prevQuestions.filter((item, j) => i!==j);
                return {prevQuestions}
            })
        }
    }
    editOpt = (type, i, j, event) => { // i=index of question obj, j=index of option in array
        event.persist();
        if (type==="new"){
            this.setState(state => {
                const questions = state.questions.map((obj, m) => {
                    if (m===i){
                        const options = obj.options.map((item, n) => {
                            if (n===j){ return event.target.value }
                            else { return item }
                        })
                        return {
                            question: obj.question,
                            options: options,
                            correct: obj.correct
                        }
                    } else {return obj}
                })
                return {questions}
            })
        } else {
            this.setState(state => {
                const prevQuestions = state.prevQuestions.map((obj, m) => {
                    if (m===i){
                        const options = obj.options.map((item, n) => {
                            if (n===j){ return event.target.value }
                            else { return item }
                        })
                        return {
                            question: obj.question,
                            options: options,
                            correct: obj.correct
                        }
                    } else {return obj}
                })
                return {prevQuestions}
            })
        }
    }
    removeOpt = (type, i, j) => {
        if (type==="new"){
            this.setState(state => {
                const questions = state.questions.map((obj, m) => {
                    if (m===i){
                        const options = obj.options.filter((item, n) => j!==n);
                        return {
                            question: obj.question,
                            options: options,
                            correct: obj.correct
                        }
                    } else {return obj}
                })
                return {questions}
            })
        } else {
            this.setState(state => {
                const prevQuestions = state.prevQuestions.map((obj, m) => {
                    if (m===i){
                        const options = obj.options.filter((item, n) => j!==n);
                        return {
                            question: obj.question,
                            options: options,
                            correct: obj.correct
                        }
                    } else {return obj}
                })
                return {prevQuestions}
            })
        }
    }
    addOption = (type, i) => {
        if (type==="new") {
            this.setState(state => {
                const questions = state.questions.map((obj, m) => {
                    if (m===i){
                        const options = obj.options.concat('new option');
                        return {
                            question: obj.question,
                            options: options,
                            correct: obj.correct
                        }
                    }
                    else {return obj}
                })
                return {questions}
            })
        } else {
            this.setState(state => {
                const prevQuestions = state.prevQuestions.map((obj, m) => {
                    if (m===i){
                        const options = obj.options.concat('new option');
                        return {
                            question: obj.question,
                            options: options,
                            correct: obj.correct
                        }
                    }
                    else {return obj}
                })
                return {prevQuestions}
            })
        }
    }
    setCorrect = (type, i, event) => {
        event.persist();
        if (type==="new"){
            this.setState(state => {
                const questions = state.questions.map((obj, j) => {
                    if (i===j){
                        const correct = event.target.value;
                        return {
                            question: obj.question,
                            options: obj.options,
                            correct: correct
                        }
                    }
                    else {return obj}
                })
                return {questions}
            })
        } else {
            this.setState(state => {
                const prevQuestions = state.prevQuestions.map((obj, j) => {
                    if (i===j){
                        const correct = event.target.value;
                        return {
                            question: obj.question,
                            options: obj.options,
                            correct: correct
                        }
                    }
                    else {return obj}
                })
                return {prevQuestions}
            })
        }
    }
    render(){
        return (
            <Fragment>
                <Typography variant={'h6'}>
                    This is in edit view. Only content 
                    creators should be able to see this.
                </Typography>
                { this.state.prevQuestions.map(function(obj, i) {
                    return ( 
                        <div key={i}>
                            <Question 
                                index={i}
                                type={"old"}
                                question={obj.question}
                                options={obj.options}
                                editOpt={this.editOpt}
                                removeOpt={this.removeOpt}
                                addOption={this.addOption}
                                editQuest={this.editQuest}
                                removeQues={this.removeQues} />
                            <RadioButtonsGroup 
                                index={i}
                                type={"old"}
                                options={obj.options}
                                correct={obj.correct}
                                setCorrect={this.setCorrect}
                            />
                        </div>
                    )
                }, this) }
                { this.state.questions.map(function(obj, i) {
                    return ( 
                        <div key={i}>
                            <Question key={i}
                                index={i}
                                type={"new"}
                                question={obj.question}
                                options={obj.options}
                                editOpt={this.editOpt}
                                removeOpt={this.removeOpt}
                                addOption={this.addOption}
                                editQuest={this.editQuest}
                                removeQues={this.removeQues} />
                            <RadioButtonsGroup 
                                index={i}
                                type={"new"}
                                options={obj.options}
                                correct={obj.correct}
                                setCorrect={this.setCorrect}
                            />
                        </div>
                    )
                }, this) }
                <div>
                    <StyledButton onClick={this.addQues}> 
                        Add Question 
                    </StyledButton>

                    <StyledButton onClick={() => {this.props.saved(this.state.prevQuestions, this.state.questions)}}> 
                        Save
                    </StyledButton>
                </div>
            </Fragment>
        )
    }
}

/* 
takes in and displays one set of question and answers
*/
const Question = (props) => {
    //console.log(props);
    return (
            <div> 
                <Divider />
                <Typography variant={'body1'}>
                    <label>
                        Question: 
                        <input value={props.question}
                            onChange={(e) => {props.editQuest(props.type, props.index, e)}} /> 
                    </label> 

                    <Button onClick={() => {props.removeQues(props.type, props.index)}}>Remove Question</Button>
                </Typography> 
                <br />

                {props.options.map(function(obj, i){
                    return (
                        <div key={i}>
                            <label>
                                <Typography variant={'body1'}> Option {i+1}: 
                                    <input name={obj} value={obj} 
                                    onChange={(e) => {props.editOpt(props.type, props.index, i, e)}} />

                                    <Button onClick={() => props.removeOpt(props.type, props.index, i)}> 
                                        X 
                                    </Button>

                                    {props.options.length===i+1 && 
                                    <Button onClick={(e) => {props.addOption(props.type, props.index)}}> 
                                        + 
                                    </Button>
                                    }

                                </Typography>
                            </label>
                        </div>
                    )
                }, this)}

            </div>
    )
}

class RadioButtonsGroup extends React.Component{
    render(){
        return (
            <FormControl>
                <FormLabel>Correct Answer</FormLabel>
                <RadioGroup value={this.props.correct} 
                    onChange={(e) => this.props.setCorrect(this.props.type, this.props.index, e)} >

                    {this.props.options.map(function(obj, i){
                        //console.log(obj)
                        return (
                            <FormControlLabel key={i} value={obj} control={<Radio />} label={obj} />
                        )
                    })}
                </RadioGroup>
            </FormControl>
        )
    }
}

const StyledButton = withStyles({
    root: {
      background: '#19237E',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      width: 200,
      padding: '0 30px',
      margin: '2px'
      //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
      textTransform: 'capitalize',
    },
  })(({ classes, color, ...other }) => <Button className={classes.root} {...other} />);

export default EditQuiz;