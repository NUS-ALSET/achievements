/**
 * @file Destinations container module
 * @created 30.08.18
 */

import React from 'react';
import { Link } from "react-router-dom"

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

import { notificationShow } from '../Root/actions';
import Skills from "../../components/lists/Skills";

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }
});

function copyToClipBoard(event, destinationId, dispatch){
  event.preventDefault();
  event.stopPropagation();
  const inputEl = document.createElement("input");
  inputEl.setAttribute('value',`${window.location.origin}/#/destinations/${destinationId}`)
  document.body.appendChild(inputEl);
  inputEl.focus();
  inputEl.select();
  document.execCommand("copy");
  document.body.removeChild(inputEl);
  dispatch(notificationShow(`Link Copied`))
}

function Destinations(props) {
  const { classes, destinations = [],dispatch } = props;
  return (
    <div className={classes.root}>
      {
        destinations.map((dest, index) =>
          <ExpansionPanel key={dest.key}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div style={{ width: '100%', display: 'flex', justifyContent: "space-between" }}>
                <Link to={`/destinations/${dest.key}`}>
                  <Typography className={classes.heading}>{dest.value.title}</Typography>
                </Link>
                <Button className={classes.button} onClick={(e)=>copyToClipBoard(e, dest.key, dispatch)}>Copy Link</Button>
              
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display : 'flex', flexDirection : "column", width : '100%'}}>
              <Typography className={classes.heading} variant={'subheading'}>
                Updated On  : {dest.value.updatedOn}
              </Typography>
              <Typography className={classes.heading} variant={'subheading'}>
                Source Type  : {(dest.value.sourceType || '')}
              </Typography>
              
              {
                Object.keys(dest.value.skills || {}).length > 0
                  ? <Skills skills={dest.value.skills}  />
                  : <Typography className={classes.heading} variant={'display2'}>No Skills.</Typography>
              }
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
    </div>
  );
}

Destinations.propTypes = {
  classes: PropTypes.object.isRequired,
  destinations: PropTypes.array
};



export default withStyles(styles)(Destinations);
