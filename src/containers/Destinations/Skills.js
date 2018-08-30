/**
 * @file Destinations container module
 * @created 30.08.18
 */

import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
    fontSize: '20px'
  },
  heading1: {
    margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px`,
    fontSize: '17px'
  },
  message: {
    margin: '10px auto',
    width: '100%'
  }
});


function InteractiveList(props) {
  const { classes, data, name } = props;
  const dense = true;
  return (
    <Grid>
      <Typography variant="title" className={classes.heading1}>
        {name}
      </Typography>
      <div className={classes.demo}>
        <List dense={dense}>
          {Object.keys(data).map(key =>
            <ListItem key={key}>
              <ListItemText
                primary={key}
              />
            </ListItem>
          )
          }
        </List>
      </div>
    </Grid>
  );
}



function Skills(props) {
  const { classes, skills } = props;
  return (
    <div className={classes.root}>
    <Typography variant="subheading" className={classes.heading1}>
        Skills
        <Divider />
      </Typography>
      <Grid container spacing={8} justify="space-around">
        {
          Object.keys(skills || {}).map(key =>
            <InteractiveList
              key={key}
              name={key}
              data={skills[key]}
              classes={classes}
            />
          )
        }
      </Grid>
    </div>
  );
}

Skills.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default withStyles(styles)(Skills);
