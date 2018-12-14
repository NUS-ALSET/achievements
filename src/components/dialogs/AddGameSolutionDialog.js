/**
 * @created 11:10:18
 */


import PropTypes from "prop-types";
import React from "react";

import { withStyles } from "@material-ui/core/styles";
// import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import GameActivity from "../activityViews/GameActivity";
import { APP_SETTING } from "../../achievementsApp/config";

const styles = {
    root: {
        backgroundColor: "#252a31"
    },
    appBar: {
        position: "relative"
    },
    flex: {
        flex: 1,
        textTransform: "capitalize"
    }
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddGameSolutionDialog extends React.PureComponent {
    static propTypes = {
        onClose: PropTypes.func,
        onCommit: PropTypes.func,
        onChange: PropTypes.func,
        open: PropTypes.bool,
        solution: PropTypes.any,
        taskId: PropTypes.string,
        classes: PropTypes.object.isRequired,
        readOnly : PropTypes.bool
    };

    state = {
        solution: null,
        open: true
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

    handleSubmit = solution =>{
        const finalSolution ={
            solvedFiles : solution.files.filter(f=>!f.readOnly),
            testResult : solution.output
        };
        if (this.props.onChange){
            this.props.onCommit({ type : "SOLUTION", solution : finalSolution});
        } else {
            this.props.onCommit(this.props.taskId, finalSolution );
        }
        this.setState({ open : false});
        this.handleClose();
    }
    render() {
        const {
            // onClose, onCommit, taskId, solution
            open, classes, problem, readOnly, ...rest } = this.props;

        if (!(["game", "gameTournament"]).includes((problem || {}).type)) {
            return "";
        }
        const heading = `${APP_SETTING.games[(problem || {}).game].name || ""} Game Level${problem.levelsToWin} ${problem.unitsPerSide === 1 ? "Single Unit" : `${problem.unitsPerSide} Units`} ${problem.playMode}`;

        return (
            <div>
                <Dialog
                    className={classes.root}
                    fullScreen
                    onClose={this.handleClose}
                    open={open}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton aria-label="Close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon />
                            </IconButton>
                            <Typography className={classes.flex} color="inherit" variant="h6">
                                {heading} {readOnly ? "( Read Only )" : ""}
                            </Typography>
                            <Typography color="inherit" variant="h6">
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {open && problem &&
                        <GameActivity
                            {...rest}
                            problem={problem}
                        />
                    }
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AddGameSolutionDialog);

