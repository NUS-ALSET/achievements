import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/mode/jsx";
import "brace/mode/css";
import "brace/mode/typescript";
import "brace/mode/scss";
import "brace/theme/github";

const extensions = {
  js: "jsx", // becuase in react javascript is reactive javascript
  py: "python",
  ts: "typescript"
};

const styles = {
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  activeFile: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#3f51b5",
      color: "#fff"
    }
  },
  body: {
    borderTop: "15px solid #d8d8d8",
    borderBottom: "15px solid #d8d8d8"
  },
  list:{
    paddingTop: "0px",
    minWidth: "max-content"
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ViewActivityJestSolutionDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    solution: PropTypes.object,
    activity: PropTypes.object,
    student: PropTypes.object
  };

  state = {
    selectedFile: null
  };

  onSelected = file => {
    this.setState({ selectedFile: file });
  };

  render() {
    const { classes, handleClose, open, student, solution, activity } = this.props;

    if (!open || (activity || {}).type !=="jest") {
      return "";
    }

    const selectedFile = this.state.selectedFile || solution.solvedFiles[0];
    const exts = selectedFile.path.split(".");
    let ext = exts[exts.length - 1];
    ext = extensions[ext] ? extensions[ext] : ext;

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
                Solution by <i>{student.displayName}</i>
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid className={classes.body} container spacing={0}>
            <Grid item style={{ overflowX: "auto"}} xs={2}>
              <List className={classes.list} component="nav">
                <ListItem>
                  <ListItemText primary={"Solution Files"} />
                  <ListItemIcon>
                    <ExpandMore />
                  </ListItemIcon>
                </ListItem>
                {((solution || {}).solvedFiles || []).map(file => {
                  return (
                    <ListItem
                      button
                      className={
                        file.path === selectedFile.path
                          ? classes.activeFile
                          : ""
                      }
                      key={file.path}
                      onClick={() => this.onSelected(file)}
                    >
                      <ListItemText
                        primary={file.path}
                        primaryTypographyProps={{
                          className:
                            file.path === selectedFile.path
                              ? classes.activeFile
                              : ""
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={10}>
              <AceEditor
                editorProps={{ $blockScrolling: true }}
                fontSize={16}
                height={"calc(100vh - 94px)"}
                mode={ext}
                name="alsetEditor"
                readOnly={true}
                showPrintMargin={false}
                theme="github"
                value={selectedFile.code}
                width={"100%"}
              />
            </Grid>
          </Grid>
        </Dialog>
      </div>
    );
  }
}


export default withStyles(styles)(ViewActivityJestSolutionDialog);
