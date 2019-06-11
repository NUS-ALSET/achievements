import * as React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import PathsSelector from "../selectors/PathsSelector";

export class AddJourneyActivitiesDialog extends React.PureComponent {
  static propTypes = {
    journeyId: PropTypes.string,
    onClose: PropTypes.func,
    onCommit: PropTypes.func,
    onPathSelect: PropTypes.func,
    open: PropTypes.bool,
    pathActivities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    ),
    paths: PropTypes.shape({
      myPaths: PropTypes.object,
      publicPaths: PropTypes.object
    })
  };

  state = {
    activities: [],
    path: ""
  };

  onChangePath = e => {
    this.setState({ path: e.target.value });
    this.props.onPathSelect(e.target.value);
  };

  onSelectActivity = e => this.setState({ activities: e.target.value });

  onCommit = () =>
    this.props.onCommit(this.props.journeyId, this.state.activities);

  render() {
    const { onClose, open, pathActivities, paths } = this.props;
    const { activities, path } = this.state;

    return (
      <Dialog
        aria-describedby="this dialog will create new or edit existing journey"
        aria-labelledby="add-journey-activities-dialog"
        fullWidth
        onClose={onClose}
        open={open}
      >
        <DialogTitle id="add-journey-activities-dialog">
          Add Activities
        </DialogTitle>
        <DialogContent>
          <PathsSelector
            allowMultiple={false}
            onChange={this.onChangePath}
            paths={paths}
            value={path}
          />
          <TextField
            fullWidth
            label="Activity"
            onChange={this.onSelectActivity}
            select
            SelectProps={{
              multiple: true
            }}
            value={activities}
          >
            {pathActivities.length ? (
              pathActivities.map(activity => (
                <MenuItem key={activity.id} value={activity.id}>
                  {activity.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem />
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onCommit} variant="contained">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
