/**
 * @created 17:10:18
 */

import React from "react";
import PropTypes from "prop-types";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

import { APP_SETTING } from '../../achievementsApp/config'

const TOURNAMENTS_GAMES = APP_SETTING.games;

const TOURNAMENT_GAMES = {
  game1_a1: 'Game1_a1',
  game2_a2: 'Game2_a2',
  game3_a3: 'Game3_a3',
  game4_a4: 'Game4_a4',
}

const TOURNAMENT_STYLES = {
  'singleElimination': 'Single Elimination',
  'doubleElimination': 'Double Elimination',
  'multiLevel': 'Multi Level',
  'poolPlay': 'Pool Play',
  'ladderPlay': 'Ladder Play',
  'roundRobin': 'Round Robin'
}


const styles = theme => ({
  root: {
    backgroundColor: '#ebebeb',
  },
  gridRoot: {
    flexGrow: 1,
    padding: '10px',
    marginTop: '10px'
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '10px'
  },
  listItem: {
    margin: '2px 0px', padding: '0px', paddingLeft: '15px'
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AddGameSolutionDialog extends React.Component {
  constructor(props) {
    super(props);
    const {
      id = '',
      name = '',
      game = '',
      tournamentStyle = '',
      agents = {},
    } = props.activity || {}
    this.state = {
      solution: null,
      open: true,
      submited: false,
      activity: {
        name,
        game,
        tournamentStyle,
        agents,
      }
    };
  }

  onActivityChange = (field, value) => {
    if (field === 'agents') {
      const { agents } = this.state.activity;
      if (agents[value]) {
        delete agents[value];
      } else {
        agents[value] = true;
      }
      this.setState({ activity: { ...this.state.activity, agents } })
    } else {
      this.setState({ activity: { ...this.state.activity, [field]: value } })
    }
  }

  handleAgentsSelector = () => {
    let { agents } = this.state.activity;
    if (Object.keys(agents).length === Object.keys(TOURNAMENT_GAMES).length) {
      agents = {};
    } else {
      Object.keys(TOURNAMENT_GAMES).forEach(key => agents[key] = true);
    }
    this.setState({ activity: { ...this.state.activity, agents } })
  }

  static propTypes = {
    onClose: PropTypes.func,
    onCommit: PropTypes.func,
    onChange: PropTypes.func,
    open: PropTypes.bool,
    solution: PropTypes.any,
    taskId: PropTypes.string,
    classes: PropTypes.object.isRequired,
    readOnly: PropTypes.bool
  };



  handleClose = () => {
    this.setState({ open: false });
    this.props.onClose();
  };

  handleSubmit = () => {
    this.setState({ submited: true });
    if (!this.checkErrors()) {
      this.props.onCommit(this.props.pathId, {
        type: 'gameTournament',
        ...(this.props.activity || {}),
        ...this.state.activity
      })
    }

  }
  checkErrors = () => {
    const { activity } = this.state;
    if (Object.keys(activity.agents).length === 0) {
      return true;
    }
    Object.keys(activity).forEach(key => {
      if (!activity[key]) {
        return true;
      }
    });
    return false;
  }
  render() {
    const {
      // onClose, onCommit, taskId, solution, problem, readOnly
      open, classes } = this.props;
    const { activity, submited } = this.state;
    return (
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
          className={classes.root}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Game Tournament Activity
                </Typography>
              <Typography variant="title" color="inherit">

              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.gridRoot}>
            <Grid container spacing={24}>
              <Grid item xs={3}>
                <Card className={classes.paper} title="Tournament Name">
                  {
                    submited && !activity.name &&
                    <Typography variant="body1" color="inherit" style={{ color: '#f44336' }}>
                      Name is required.
                    </Typography>
                  }

                  <TextField
                    margin="normal"
                    value={activity.name}
                    placeholder="Enter Tournament Name"
                    onChange={(e) => this.onActivityChange('name', e.target.value)}
                    style={{ width: '100%', padding: '0px 15px' }}
                  />
                </Card>
                <Card className={classes.paper} title="Game Selector">
                  {
                    submited && !activity.game &&
                    <Typography variant="body1" color="inherit" style={{ color: '#f44336' }}>
                      Please select a game.
                  </Typography>
                  }
                  <List component="nav">
                    {
                      Object.keys(TOURNAMENTS_GAMES).map(key =>
                        <CustomList
                          key={key}
                          active={key === activity.game}
                          classes={classes}
                          title={TOURNAMENTS_GAMES[key].name}
                          onClick={() => this.onActivityChange('game', key)}
                        />
                      )
                    }
                  </List>
                </Card>
                <Card className={classes.paper} title="Tournament Style">
                  {
                    submited && !activity.tournamentStyle &&
                    <Typography variant="body1" color="inherit" style={{ color: '#f44336' }}>
                      Please select a tournament style.
                    </Typography>
                  }
                  <List component="nav">
                    {
                      Object.keys(TOURNAMENT_STYLES).map(key =>
                        <CustomList
                          key={key}
                          active={key === activity.tournamentStyle}
                          classes={classes}
                          title={TOURNAMENT_STYLES[key]}
                          onClick={() => this.onActivityChange('tournamentStyle', key)}
                        />
                      )
                    }
                  </List>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <Paper className={classes.paper} style={{ height: '500px' }}></Paper>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    className={classes.paper}
                    title="Agent Selector"
                    actionComponent={
                      <Checkbox
                        style={{ backgroundColor: 'white' }}
                        onChange={() => this.handleAgentsSelector()}
                        checked={Object.keys(activity.agents).length === Object.keys(TOURNAMENT_GAMES).length}
                      />
                    }>
                    {
                      submited && Object.keys(activity.agents).length === 0 &&
                      <Typography variant="body1" color="inherit" style={{ color: '#f44336' }}>
                        Please select atleast one agent.
                      </Typography>
                    }
                    <List component="nav">
                      {
                        Object.keys(TOURNAMENT_GAMES).map(key =>
                          <CustomList
                            classes={classes}
                            key={key}
                            active={activity.agents[key]}
                            title={TOURNAMENT_GAMES[key]}
                            onClick={() => this.onActivityChange('agents', key)}
                          />
                        )
                      }
                    </List>
                  </Card>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Card className={classes.paper} title="Tournament Details">
                  <List component="nav">
                    <CustomList button={false} classes={classes} title={`Name : ${activity.name}`} />
                    <CustomList button={false} classes={classes} title={`Game : ${(TOURNAMENTS_GAMES[activity.game] || {}).name || ''}`} />
                    <CustomList button={false} classes={classes} title={`Bots : ${Object.keys(activity.agents).length}`} />
                    <CustomList button={false} classes={classes} title={`Format : ${TOURNAMENT_STYLES[activity.tournamentStyle] || ''}`} />
                  </List>
                </Card>
                <Button variant="contained" color="primary" onClick={this.handleSubmit} style={{ width: '100%', backgroundColor: 'green' }} >{(this.props.activity || {}).id ? 'Update' : 'Create'} Tournament</Button>
              </Grid>
            </Grid>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AddGameSolutionDialog);


const Card = props => {
  return (<Paper className={props.className}>
    <List style={{ width: '100%', backgroundColor: '#1a2c58' }}>
      <ListItem dense >
        <ListItemText>
          <Typography variant="subheading" color="inherit" style={{ color: 'white' }}>
            {props.title}
          </Typography>
        </ListItemText>
        {
          props.actionComponent &&
          <ListItemSecondaryAction>
            {props.actionComponent}
          </ListItemSecondaryAction>
        }

      </ListItem>
    </List>
    <div style={{ padding: '5px 0px' }}>
      {props.children}
    </div>
  </Paper>)
}

const CustomList = ({ classes, title, active, onClick, button = true }) => {
  return (
    <ListItem button={button} className={classes.listItem} onClick={onClick} style={{ backgroundColor: active && '#fc6' }} >
      <ListItemText primary={title} />
    </ListItem>
  )
}