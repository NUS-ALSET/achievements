import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

const styles = {
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  container:{
    padding : "15px"
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ViewActivitySolutionDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    displayName: PropTypes.string,
    children: PropTypes.node
  };

  state = {
    selectedFile: null
  };

  onSelected = file => {
    this.setState({ selectedFile: file });
  };

  render() {
    const { classes, handleClose, open, displayName } = this.props;
    return (
      <div>
        <Dialog
          fullScreen
          onClose={handleClose}
          open={open}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                aria-label="Close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Typography className={classes.flex} color="inherit" variant="h6">
                Solution by <i>{displayName}</i>
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            {this.props.children}
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ViewActivitySolutionDialog);
