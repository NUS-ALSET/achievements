/**
 * @file Account container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 26.01.18
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import Button from "material-ui/Button";
import withStyles from "material-ui/styles/withStyles";
import { codeCombatService } from "../../services/codeCombat";
import Grid from "material-ui/Grid";
import Card, { CardMedia, CardContent, CardActions } from "material-ui/Card";
import Typography from "material-ui/Typography";

const styles = theme => ({
  card: {
    margin: theme.spacing.unit
  }
});

class Account extends React.PureComponent {
  static propTypes = {
    firebase: PropTypes.object,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    auth: PropTypes.object,
    uid: PropTypes.string,
    userName: PropTypes.string
  };

  state = {
    codeCombatLogin: null,
    userChecked: false
  };

  handleCodeCombatLoginChange = event => {
    codeCombatService.checkUser(this.state.codeCombatLogin).then(result =>
      this.setState({
        userChecked: result
      })
    );
    this.setState({
      codeCombatLogin: event.currentTarget.value
    });
  };

  accountDataCommit = () => {
    const { firebase, user, uid } = this.props;

    firebase.update(`/users/${uid}`, {
      codeCombatLogin: this.state.codeCombatLogin || user.codeCombatLogin || ""
    });
  };

  render() {
    const { user, classes } = this.props;

    return (
      <Grid container>
        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardMedia
              style={{ height: 240 }}
              image={this.props.auth.photoURL}
              title={this.props.userName}
            />
            <CardContent>
              <Typography>{this.props.userName}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="title">Free Code Camp</Typography>
              <Typography>Registered as </Typography>
              <Typography>319 achievements </Typography>
            </CardContent>
            <CardActions>
              <Button raised>Refresh Achievements</Button>
              <Button raised color="secondary">
                Remove
              </Button>
            </CardActions>
          </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="title">Pivotal Expert</Typography>
              <Typography>Registered as </Typography>
              <Typography>319 achievements </Typography>
            </CardContent>
            <CardActions>
              <Button raised>Refresh Achievements</Button>
              <Button raised color="secondary">
                Remove
              </Button>
            </CardActions>
          </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="title">Code Combat</Typography>
              <Typography>319 achievements </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" raised>
                Add Profile
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  userName: state.firebase.auth.displayName,
  uid: state.firebase.auth.uid,
  auth: state.firebase.auth,
  user: (state.firebase.data.users || {})[state.firebase.auth.uid]
});

export default compose(
  firebaseConnect(["/users"]),
  withStyles(styles),
  connect(mapStateToProps)
)(Account);
