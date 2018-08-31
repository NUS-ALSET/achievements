/**
 * @file ViewDestination container module
 * @created 30.08.18
 */

import React from 'react';

import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Skills from './Skills';

const styles = theme => ({
  root: {
    width: '100%',
  }
});



function ViewDestination(props) {
  const { classes, destination ={} } = props;
  return (
    <div className={classes.root}>
    <Typography className={classes.heading} variant={'display1'}>
      Destination : 
    </Typography>
    <Typography className={classes.heading} style={{ marginTop : '30px'}} variant={'subheading'}>
      Name : {destination.title}
    </Typography>
    <Typography className={classes.heading} variant={'subheading'}>
      Updated On  : {destination.updatedOn}
    </Typography>
    <Typography className={classes.heading} variant={'subheading'}>
      Source Type  : {(destination.sourceType || '')}
    </Typography>
    <Typography className={classes.heading} variant={'subheading'}>
      Skills : 
    </Typography>
      {
        Object.keys(destination.skills || {}).length > 0 
        ?  <Skills  skills={destination.skills} />
        : <Typography className={classes.heading} variant={'title'}>No Skills.</Typography>
      }
    </div>
  );
}

ViewDestination.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    destination: (state.firebase.data.destinations || {})[ownProps.match.params.destinationId],
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps),
  firebaseConnect((ownProps, store) => {
    const destinationId = ownProps.match.params.destinationId
    return [`/destinations/${destinationId}`];
  })
)(ViewDestination);

