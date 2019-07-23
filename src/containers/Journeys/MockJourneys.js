import React, { Fragment } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Divider from "@material-ui/core/Divider";

import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckboxBlankCircle from "@material-ui/icons/RadioButtonUnchecked";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowUpIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownIcon from "@material-ui/icons/ArrowDownward";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import SaveIcon from "@material-ui/icons/Save";
import FilterIcon from "@material-ui/icons/FilterList";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const ExpansionPanelSummary = withStyles({
  expandIcon: {
    position: "relative",
    top: "1.5rem"
  },
  expanded: {
    justifyContent: "space-between"
  },
  content: {
    justifyContent: "space-between"
  }
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = "ExpansionPanelSummary";

class MockJourneys extends React.PureComponent {
  state = {
    journeys: [
      {
        name: "Basic Web Server",
        id: 143432432,
        description: "Build your first simple web server using Python",
        activities: [
          {
            status: true,
            name: "Hello World",
            description: "basic python 1",
            pathName: "Python basics by ALSET"
          },
          {
            status: false,
            name: "Hello pandas",
            description: "basic python 2",
            pathName: "Python basics by ALSET"
          }
        ],
        editable: false,
        nameDuringEdit: "Basic Web Server",
        descriptionDuringEdit: "Build your first simple web server using Python"
      },
      {
        name: "Database Ops",
        id: 34643635434,
        description: "Learn some firebase tricks",
        activities: [
          {
            status: true,
            name: "Firebase Intro",
            description: "Watch an overview of Firebase",
            pathName: "Firebase basics by ALSET"
          },
          {
            status: false,
            name: "Create firestore",
            description: "Initialise firestore in your app",
            pathName: "Firebase basics by ALSET"
          },
          {
            status: false,
            name: "Firebase Auth",
            description: "Allow your app to authenticate visitors",
            pathName: "Firebase basics by ALSET"
          }
        ],
        editable: false,
        nameDuringEdit: "Database Ops",
        descriptionDuringEdit: "Learn some firebase tricks"
      }
    ],
    deleteJourneydialogOpen: false,
    deleteDialogJourneyId: "",
    addJourneyDialogOpen: false,
    newJourneyName: "",
    newJourneyDescription: "",
    newJourneySelectedPath: "",
    newJourneySelectedPathActivitiesTracker: {},
    newJourneySelectedPathActivities: {},
    mockPaths: [
      {
        name: "Machine learning",
        id: 124213213,
        description: "Learn machine learning",
        activities: [
          {
            status: true,
            id: 123,
            name: "Introduction",
            description: "Watch a video on an overview of Machine Learning"
          },
          {
            status: false,
            id: 124,
            name: "Basic python for ML",
            description: "Some python to get started"
          },
          {
            status: false,
            id: 125,
            name: "Basic tools for ML",
            description: "Get acquainted with tools for ML"
          }
        ]
      },
      {
        name: "Database Ops",
        id: 34643635434,
        description: "Learn some firebase tricks",
        activities: [
          {
            status: true,
            id: 131,
            name: "Firebase Intro",
            description: "Watch an overview of Firebase"
          },
          {
            status: false,
            id: 132,
            name: "Create firestore",
            description: "Initialise firestore in your app"
          },
          {
            status: false,
            id: 133,
            name: "Firebase Auth",
            description: "Allow your app to authenticate visitors"
          }
        ]
      }
    ]
  };

  moveActivityUp = (event, journeyIndex, activityIndex) => {
    const clonedJourneys = [...this.state.journeys];
    const { activities } = clonedJourneys[journeyIndex];
    const journeyActivities = [...activities];

    // stores baseState to revert back to original state if user cancels changes
    if (!this.state.baseState) {
      this.setState({
        baseState: [...this.state.journeys]
      });
    }

    if (activityIndex !== 0) {
      const temp = JSON.parse(
        JSON.stringify(journeyActivities[activityIndex - 1])
      );
      journeyActivities[activityIndex - 1] = journeyActivities[activityIndex];
      journeyActivities[activityIndex] = temp;

      const updatedJourney = {
        ...clonedJourneys[journeyIndex],
        activities: journeyActivities
      };
      clonedJourneys[journeyIndex] = updatedJourney;
      this.setState({
        journeys: clonedJourneys
      });
    }
  };

  moveActivityDown = (event, journeyIndex, activityIndex, totalActivities) => {
    const clonedJourneys = [...this.state.journeys];
    const { activities } = clonedJourneys[journeyIndex];
    const journeyActivities = [...activities];

    if (!this.state.baseState) {
      this.setState({
        baseState: [...this.state.journeys]
      });
    }

    // totalActivities -1 because lowest activityIndex is 0 whereas lowest totalActivity is 1
    if (activityIndex < totalActivities - 1) {
      const temp = JSON.parse(
        JSON.stringify(journeyActivities[activityIndex + 1])
      );
      journeyActivities[activityIndex + 1] = journeyActivities[activityIndex];
      journeyActivities[activityIndex] = temp;

      const updatedJourney = {
        ...clonedJourneys[journeyIndex],
        activities: journeyActivities
      };
      clonedJourneys[journeyIndex] = updatedJourney;
      this.setState({
        journeys: clonedJourneys
      });
    }
  };

  deleteActivity = (event, journeyIndex, activityName, activityDescription) => {
    const clonedJourneys = [...this.state.journeys];
    const { activities } = clonedJourneys[journeyIndex];
    const journeyActivities = [...activities];

    if (!this.state.baseState) {
      this.setState({
        baseState: [...this.state.journeys]
      });
    }

    const arrayWithRemovedActivity = journeyActivities.filter(
      activity =>
        activity.name !== activityName &&
        activity.description !== activityDescription
    );

    const updatedJourney = {
      ...clonedJourneys[journeyIndex],
      activities: arrayWithRemovedActivity
    };
    clonedJourneys[journeyIndex] = updatedJourney;
    this.setState({
      journeys: clonedJourneys
    });
  };

  editJourney = (event, journeyIndex) => {
    const clonedJourneys = [...this.state.journeys];
    const updatedJourney = {
      ...clonedJourneys[journeyIndex],
      editable: true
    };

    clonedJourneys[journeyIndex] = updatedJourney;
    this.setState({
      journeys: clonedJourneys
    });
  };

  editJourneyName = (event, journeyIndex, value) => {
    const clonedJourneys = [...this.state.journeys];
    const updatedJourney = {
      ...clonedJourneys[journeyIndex],
      nameDuringEdit: value
    };

    clonedJourneys[journeyIndex] = updatedJourney;
    this.setState({
      journeys: clonedJourneys
    });
  };

  editJourneyDescription = (event, journeyIndex, value) => {
    const clonedJourneys = [...this.state.journeys];
    const updatedJourney = {
      ...clonedJourneys[journeyIndex],
      descriptionDuringEdit: value
    };

    clonedJourneys[journeyIndex] = updatedJourney;
    this.setState({
      journeys: clonedJourneys
    });
  };

  saveJourney = (event, journeyIndex) => {
    const clonedJourneys = [...this.state.journeys];
    const updatedJourney = {
      ...clonedJourneys[journeyIndex],
      name: clonedJourneys[journeyIndex].nameDuringEdit,
      description: clonedJourneys[journeyIndex].descriptionDuringEdit,
      editable: false
    };

    clonedJourneys[journeyIndex] = updatedJourney;
    this.setState({
      journeys: clonedJourneys
    });
  };

  deleteJourney = (event, journeyId) => {
    const clonedJourneys = [...this.state.journeys];
    const updatedJourneysAfterDelete = clonedJourneys.filter(
      journey => journey.id !== journeyId
    );
    this.setState({
      journeys: updatedJourneysAfterDelete
    });
  };

  handleDeleteDialogOpen = journeyToBeDeletedId => {
    this.setState({
      deleteJourneyDialogOpen: true,
      deleteDialogJourneyId: journeyToBeDeletedId
    });
  };

  handleAddJourneyDialogOpen = () => {
    this.setState({
      addJourneyDialogOpen: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      deleteJourneyDialogOpen: false,
      addJourneyDialogOpen: false
    });
  };

  handleAddJourneyName = e => {
    this.setState({
      newJourneyName: e.target.value
    });
  };

  handleAddJourneyDescription = e => {
    this.setState({
      newJourneyDescription: e.target.value
    });
  };

  handleAddJourneyPath = e => {
    this.setState({
      newJourneySelectedPath: e.target.value
    });
  };

  handleAddJourneyActivities = (event, isChecked, item) => {
    const clonedActivitiesTracker = this.state
      .newJourneySelectedPathActivitiesTracker;
    clonedActivitiesTracker[item.name] = isChecked;
    const clonedActivities = this.state.newJourneySelectedPathActivities;
    clonedActivities[item.id] = item;
    this.setState({
      newJourneySelectedPathActivitiesTracker: JSON.parse(
        JSON.stringify(clonedActivitiesTracker)
      ),
      newJourneySelectedPathActivities: JSON.parse(
        JSON.stringify(clonedActivities)
      )
    });
  };

  handleAddNewJourney = () => {
    this.state.journeys.push({
      name: this.state.newJourneyName,
      id: 14332313,
      description: this.state.newJourneyDescription,
      activities: Object.values(this.state.newJourneySelectedPathActivities),
      editable: false,
      nameDuringEdit: this.state.newJourneyName,
      descriptionDuringEdit: this.state.newJourneyDescription
    });
    this.setState({
      newJourneyName: "",
      newJourneyDescription: "",
      newJourneySelectedPathActivities: {},
      newJourneySelectedPath: ""
    });
  };

  render() {
    return (
      <Fragment>
        <Breadcrumbs paths={[{ label: "Journeys" }]} />
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Button
              color="primary"
              onClick={this.handleAddJourneyDialogOpen}
              variant="contained"
            >
              Add new journey
            </Button>
          </Grid>
          {this.state.journeys.map((journey, journeyIndex) => (
            <Grid item key={journey.name} xs={12}>
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  style={{ flexDirection: "row-reverse" }}
                >
                  {!journey.editable && (
                    <Fragment>
                      <Typography
                        style={{
                          paddingRight: "0.25rem",
                          fontWeight: 550,
                          alignSelf: "center"
                        }}
                      >
                        {journey.name}
                      </Typography>
                      <Typography
                        style={{ paddingRight: "0.25rem", alignSelf: "center" }}
                      >
                        {journey.description}
                      </Typography>
                    </Fragment>
                  )}
                  {journey.editable && (
                    <Fragment>
                      <Input
                        onChange={e =>
                          this.editJourneyName(e, journeyIndex, e.target.value)
                        }
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        // Prevent clicks on input field to trigger accordion expansion / contraction
                        value={journey.nameDuringEdit}
                      />
                      <Input
                        multiline={true}
                        onChange={e =>
                          this.editJourneyDescription(
                            e,
                            journeyIndex,
                            e.target.value
                          )
                        }
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        // Prevent clicks on input field to trigger accordion expansion / contraction
                        value={journey.descriptionDuringEdit}
                      />
                    </Fragment>
                  )}
                  <div>
                    {journey.editable ? (
                      <IconButton
                        onClick={e => {
                          this.saveJourney(e, journeyIndex);
                          e.stopPropagation();
                        }}
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={e => {
                          this.editJourney(e, journeyIndex);
                          e.stopPropagation();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={e => {
                        this.handleDeleteDialogOpen(journey.id);
                        e.stopPropagation();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={8}>
                    {[
                      { name: "No", gridSpace: 1 },
                      {
                        name: (
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            Status
                            <FilterIcon />
                          </span>
                        ),
                        gridSpace: 1
                      },
                      { name: "Name", gridSpace: 2 },
                      { name: "Path", gridSpace: 2 },
                      { name: "Description", gridSpace: 4 },
                      { name: "Actions", gridSpace: 2 }
                    ].map(headerField => (
                      <Grid
                        item
                        key={headerField.name}
                        style={{ fontWeight: 550 }}
                        xs={headerField.gridSpace}
                      >
                        {headerField.name}
                      </Grid>
                    ))}
                    {journey.activities.map(
                      (activity, activityIndex, activitiesArray) => (
                        <Fragment key={activity.name}>
                          <Grid item style={{ alignSelf: "center" }} xs={1}>
                            {activityIndex + 1}
                          </Grid>
                          <Grid item style={{ alignSelf: "center" }} xs={1}>
                            {activity.status ? (
                              <CheckCircleIcon
                                style={{ color: "forestgreen" }}
                              />
                            ) : (
                              <CheckboxBlankCircle />
                            )}
                          </Grid>
                          <Grid item style={{ alignSelf: "center" }} xs={2}>
                            {activity.name}
                          </Grid>
                          <Grid item style={{ alignSelf: "center" }} xs={2}>
                            {activity.pathName}
                          </Grid>
                          <Grid item style={{ alignSelf: "center" }} xs={4}>
                            {activity.description}
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={e =>
                                this.moveActivityUp(
                                  e,
                                  journeyIndex,
                                  activityIndex
                                )
                              }
                            >
                              <ArrowUpIcon />
                            </IconButton>
                            <IconButton
                              onClick={e =>
                                this.moveActivityDown(
                                  e,
                                  journeyIndex,
                                  activityIndex,
                                  activitiesArray.length
                                )
                              }
                            >
                              <ArrowDownIcon />
                            </IconButton>
                            <IconButton
                              onClick={e =>
                                this.deleteActivity(
                                  e,
                                  journeyIndex,
                                  activity.name,
                                  activity.description
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Fragment>
                      )
                    )}
                    <Grid>
                      <Button color="primary" xs={12}>
                        Add new activity
                      </Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                  <Button
                    onClick={() => {
                      // only allow user to save if he has made changes
                      if (this.state.baseState) {
                        this.setState({
                          journeys: this.state.baseState
                        });
                      }
                    }}
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      if (this.state.baseState) {
                        window.alert("saved!");
                        this.setState({
                          baseState: null
                        });
                      }
                    }}
                    size="small"
                  >
                    Save
                  </Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            </Grid>
          ))}
        </Grid>
        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClick={e => e.stopPropagation()}
          onClose={this.handleDialogClose}
          open={this.state.deleteJourneyDialogOpen || false}
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete this journey?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Note: this step is irreversible...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleDialogClose}>
              Disagree
            </Button>
            <Button
              autoFocus
              color="primary"
              onClick={e => {
                this.handleDialogClose();
                this.deleteJourney(e, this.state.deleteDialogJourneyId);
                this.setState({ deleteDialogJourneyId: "" });
                e.stopPropagation();
              }}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClick={e => e.stopPropagation()}
          onClose={this.handleDialogClose}
          open={this.state.addJourneyDialogOpen || false}
        >
          <DialogTitle id="alert-dialog-title">{"Add new journey"}</DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Name:</InputAdornment>
                )
              }}
              onChange={e => this.handleAddJourneyName(e)}
              value={this.state.newJourneyName}
            />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Description:</InputAdornment>
                )
              }}
              multiline={true}
              onChange={e => this.handleAddJourneyDescription(e)}
              value={this.state.newJourneyDescription}
            />
            <TextField
              helperText="Choose a path"
              label="Select"
              margin="normal"
              onChange={e => this.handleAddJourneyPath(e)}
              select
              value={this.state.newJourneySelectedPath}
            >
              {this.state.mockPaths.map(path => (
                <MenuItem key={path.name} value={path.id}>
                  {path.name}
                </MenuItem>
              ))}
            </TextField>
            {this.state.newJourneySelectedPath && (
              <TextField
                helperText="Choose activities from the path"
                label="Select"
                margin="normal"
                select
                value=""
              >
                <FormControl style={{ padding: "1rem", outline: "none" }}>
                  <FormLabel component="legend">Path Activities</FormLabel>
                  <FormGroup>
                    {this.state.mockPaths
                      .find(
                        path => path.id === this.state.newJourneySelectedPath
                      )
                      .activities.map(item => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                this.state
                                  .newJourneySelectedPathActivitiesTracker[
                                  item.name
                                ] || false
                              }
                              onChange={(e, isInputChecked) =>
                                this.handleAddJourneyActivities(
                                  e,
                                  isInputChecked,
                                  item
                                )
                              }
                              value={item.name}
                            />
                          }
                          key={item.name}
                          label={item.name}
                        />
                      ))}
                  </FormGroup>
                  <FormHelperText style={{ whiteSpace: "pre-line" }}>
                    {
                      "Multiple activities can be added. \nYou can select a different path from menu above \nto add activities from it."
                    }
                  </FormHelperText>
                </FormControl>
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleDialogClose}>
              Cancel
            </Button>
            <Button
              autoFocus
              color="primary"
              onClick={e => {
                this.handleAddNewJourney(e);
                this.handleDialogClose();
                e.stopPropagation();
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default MockJourneys;
