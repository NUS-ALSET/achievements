import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
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
  summaryNameEdit: { marginRight: 20, marginTop: 8 },
  summaryDescription: { paddingRight: "0.25rem", alignSelf: "center" },
  summaryDescriptionEdit: { marginTop: 8 }
});

export class JourneyForm extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.any,
    changed: PropTypes.bool,
    classes: PropTypes.shape({
      expandIcon: PropTypes.string,
      expanded: PropTypes.string,
      content: PropTypes.string,
      summary: PropTypes.string,
      summaryName: PropTypes.string,
      summaryNameEdit: PropTypes.string,
      summaryDescription: PropTypes.string,
      summaryDescriptionEdit: PropTypes.string
    }),
    completed: PropTypes.object,
    journey: PropTypes.object.isRequired,
    onAddActivityClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onDataUpdate: PropTypes.func,
    onDeleteActivityClick: PropTypes.func,
    onMoveActivityClick: PropTypes.func,
    onExpand: PropTypes.func,
    onRemoveClick: PropTypes.func,
    onSaveClick: PropTypes.func
  };

  state = {
    changes: {},
    inChange: false
  };

  onAddActivityClick = () =>
    this.props.onAddActivityClick(
      "ADD_JOURNEY_ACTIVITIES",
      this.props.journey.id
    );

  onSummaryClick = e => e.stopPropagation();

  onExpand = () =>
    !this.props.activities && this.props.onExpand(this.props.journey.id);

  onCancelClick = () => {
    this.setState({ changes: {} });
    this.props.onCancelClick(this.props.journey.id);
  };

  onChangeField = field => e =>
    this.setState({
      changes: { ...this.state.changes, [field]: e.target.value }
    });

  onChangingToggle = e => {
    if (this.state.inChange) {
      this.props.onDataUpdate(this.props.journey.id, {
        ...this.state.changes,
        id: this.props.journey.id
      });
    }
    this.setState({ inChange: !this.state.inChange });
    e.stopPropagation();
  };

  onSaveClick = () => this.props.onSaveClick(this.props.journey.id);

  render() {
    const {
      activities,
      changed,
      classes,
      completed,
      journey,
      onDeleteActivityClick,
      onMoveActivityClick,
      onRemoveClick
    } = this.props;
    const { changes, inChange } = this.state;
    const journeyData = { ...journey, ...changes };
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
            {inChange ? (
              <React.Fragment>
                <TextField
                  autoFocus
                  className={classes.summaryNameEdit}
                  fullWidth
                  onChange={this.onChangeField("name")}
                  onClick={this.onSummaryClick}
                  value={journeyData.name}
                />
                <TextField
                  className={classes.summaryDescriptionEdit}
                  fullWidth
                  multiline
                  onChange={this.onChangeField("description")}
                  onClick={this.onSummaryClick}
                  value={journeyData.description}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography className={classes.summaryName}>
                  {journeyData.name}
                </Typography>
                <Typography className={classes.summaryDescription}>
                  {journeyData.description}
                </Typography>
              </React.Fragment>
            )}
          </React.Fragment>
          <div style={{ minWidth: 150 }}>
            {inChange ? (
              <IconButton onClick={this.onChangingToggle}>
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton onClick={this.onChangingToggle}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              onClick={e => {
                onRemoveClick(journeyData.id);
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
              <JourneyActivitiesTable
                activities={activities}
                completed={completed}
                journeyId={journeyData.id}
                onDeleteActivityClick={onDeleteActivityClick}
                onMoveActivityClick={onMoveActivityClick}
              />
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
        <Divider />
        <ExpansionPanelActions>
          <Button disabled={!changed} onClick={this.onCancelClick} size="small">
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!changed}
            onClick={this.onSaveClick}
            size="small"
            variant={changed ? "contained" : "text"}
          >
            Save
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(JourneyForm);
