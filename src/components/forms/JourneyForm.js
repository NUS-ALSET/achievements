import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import withStyles from "@material-ui/core/styles/withStyles";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";
import JourneyActivitiesTable from "../tables/JourneyActivitiesTable";

const styles = () => ({
  expandIcon: {
    position: "relative",
    top: "1.5rem"
  },
  expanded: {
    justifyContent: "space-between"
  },
  content: {
    justifyContent: "space-between"
  },
  summary: { flexDirection: "row-reverse" },
  summaryName: {
    paddingRight: "0.25rem",
    fontWeight: 550,
    alignSelf: "center"
  },
  summaryDescription: { paddingRight: "0.25rem", alignSelf: "center" }
});
export class JourneyForm extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.any,
    classes: PropTypes.shape({
      expandIcon: PropTypes.string,
      summary: PropTypes.string,
      summaryName: PropTypes.string
    }),
    journey: PropTypes.object.isRequired,
    onAddActivityClick: PropTypes.func,
    onExpand: PropTypes.func,
    onRemoveClick: PropTypes.func
  };

  onAddActivityClick = () =>
    this.props.onAddActivityClick(
      "ADD_JOURNEY_ACTIVITIES",
      this.props.journey.id
    );

  onExpand = () =>
    !this.props.activities && this.props.onExpand(this.props.journey.id);

  render() {
    const { activities, classes, journey, onRemoveClick } = this.props;
    return (
      <ExpansionPanel onChange={this.onExpand}>
        <ExpansionPanelSummary
          classes={{
            expanded: classes.expanded,
            content: classes.content,
            expandIcon: classes.expandIcon
          }}
          className={classes.summary}
          expandIcon={<ExpandMoreIcon />}
        >
          <React.Fragment>
            <Typography className={classes.summaryName}>
              {journey.name}
            </Typography>
            <Typography className={classes.summaryDescription}>
              {journey.description}
            </Typography>
          </React.Fragment>
          <div>
            {journey.editable ? (
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              onClick={e => {
                onRemoveClick(journey.id);
                e.stopPropagation();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
            <Grid item xs={12}>
              <JourneyActivitiesTable activities={activities} />
            </Grid>
            <Grid item xs={12}>
              <Toolbar>
                <Button color="primary" onClick={this.onAddActivityClick}>
                  Add activity
                </Button>
              </Toolbar>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(JourneyForm);
