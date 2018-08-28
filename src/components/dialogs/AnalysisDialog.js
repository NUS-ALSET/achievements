import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider';


const skillsLabels = {
  'userSkills' : 'User Skills',
  'skillsDifference' : 'Skills Difference',
  'defaultSolutionSkills' : 'Default Solution Skills' 
}



const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
    fontSize : '20px'
  },
  heading : {
    margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px`, 
    fontSize : '17px'
  },
  skills : {
    marginLeft : '10px'
  }
});


function InteractiveList(props) {
  const { classes, data, name } = props;
  const dense = true;
  const secondary = false;
  return (
    <Grid item xs={8} md={4} className={classes.skills}>
      <Typography variant="title" className={classes.heading}>
        {name}
      </Typography>
      <div className={classes.demo}>
        <List dense={dense}>
          {Object.keys(data).map(key =>
            <ListItem key={key}>
              <ListItemText
                primary={key}
                secondary={secondary ? 'Secondary text' : null}
              />
            </ListItem>
          )
          }
        </List>
      </div>
    </Grid>
  );
}


const AnalysisDialog = (props) => {
  const { classes, skills, open, handleClose, name } = props;
  const title = "Jupter Problem Analysis "  + (name ? `for ${name}` : '');
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <div className={classes.root}>
          {Object.keys(skills).map(key =>{
            if(Object.keys(skills[key]).length===0){
              return ''
            }
            return (
              <Fragment key={key}>
              <Typography variant="title" className={classes.title}>
                {skillsLabels[key] || key}
              </Typography>
              <Grid container spacing={16}>
                {
                  Object.keys(skills[key]).map(subKey =>
                    <InteractiveList key={`${key}_${subKey}`} name={subKey} data={skills[key][subKey]} classes={classes} />
                  )
                }
              </Grid>
            </Fragment>
            )
          }
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Close
            </Button>
      </DialogActions>
    </Dialog>
  )
}


AnalysisDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  skills: PropTypes.object.isRequired,
  name: PropTypes.string
};

export default withStyles(styles)(AnalysisDialog);