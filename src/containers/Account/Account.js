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
import withStyles from "material-ui/styles/withStyles";
import { codeCombatService } from "../../services/codeCombat";
import Grid from "material-ui/Grid";
import Card, { CardMedia, CardContent, CardActions } from "material-ui/Card";
import Typography from "material-ui/Typography";
import { accountService } from "../../services/account";
import ExternalSourceCard from "../../components/ExternalSourceCard";

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
    userName: PropTypes.string,
    externalSources: PropTypes.object
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
    const { user, classes, externalSources } = this.props;

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
          {Object.keys(externalSources).map(externalSourceKey => (
            <ExternalSourceCard
              classes={classes}
              key={externalSourceKey}
              externalSource={externalSources[externalSourceKey]}
            />
          ))}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  userName: state.firebase.auth.displayName,
  uid: state.firebase.auth.uid,
  auth: state.firebase.auth,

  // That should be in firebase
  externalSources: accountService.fetchExternalSources(),
  userAchievements: state.firebase.data.userAchievements,
  user: (state.firebase.data.users || {})[state.firebase.auth.uid]
});

export default compose(
  firebaseConnect((props, store) => [
    "/users",
    `/userAchievements/${store.getState().firebase.auth.uid}`
  ]),
  withStyles(styles),
  connect(mapStateToProps)
)(Account);
