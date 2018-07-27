/**
 * @file AddJestSolutionDialog container module
 * @created 26:07:18
 */


import PropTypes from "prop-types";
import React from "react";

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import JestRunner from '../jest-runner';

const styles = {
    root: {
        backgroundColor: '#252a31'
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddJestSolutionDialog extends React.PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onCommit: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        solution: PropTypes.any,
        taskId: PropTypes.string,
        classes: PropTypes.object.isRequired
    };

    state = {
        solution: "",
        open: true,
    };

    onChangeSolution = event => {
        this.setState({
            solution: event.target.value
        });
    };
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.onClose();
    };

    catchReturn = event =>
        event.key === "Enter" &&
        this.props.onCommit(this.state.solution, this.props.taskId);

    render() {
        const { 
            // onClose, onCommit,  solution, taskId, 
            open, classes, problem } = this.props;

        return (
            <Dialog
                fullScreen
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Transition}
                className={classes.root}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {problem && problem.name}
                        </Typography>
                        <Typography variant="title" color="inherit">
                             ALSET Editor
                        </Typography>
                    </Toolbar>
                </AppBar>
                {open && problem && <JestRunner files={problem.files} problem={problem} />}
            </Dialog>
        );
    }
}

export default withStyles(styles)(AddJestSolutionDialog);

