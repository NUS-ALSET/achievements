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
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import withStyles from "material-ui/styles/withStyles";
import { codeCombatService } from "../../services/codeCombat";
import CloseIcon from "material-ui-icons/Close";
import DoneIcon from "material-ui-icons/Done";
import Grid from "material-ui/Grid";

const styles = theme => ({
  field: {
    margin: theme.spacing.unit
  },
  checkIcon: {
    position: "relative",
    top: "20px"
  }
});

class Account extends React.PureComponent {
  static propTypes = {
    firebase: PropTypes.object,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    user: PropTypes.object,
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
        <Grid item xs={9}>
          <TextField
            label="Display name"
            className={classes.field}
            value={(user && user.displayName) || ""}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="Code combat login"
            className={classes.field}
            value={
              this.state.codeCombatLogin ||
              (this.state.codeCombatLogin === null &&
                user &&
                user.codeCombatLogin) ||
              ""
            }
            onChange={this.handleCodeCombatLoginChange}
            autoFocus
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          {this.state.userChecked ? (
            <DoneIcon className={classes.checkIcon} />
          ) : (
            <CloseIcon className={classes.checkIcon} />
          )}
        </Grid>
        <Grid item xs={9}>
          <Button
            className={classes.field}
            onClick={this.accountDataCommit}
            disabled={!user}
          >
            Commit
          </Button>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  userName: state.firebase.auth.displayName,
  uid: state.firebase.auth.uid,
  user: (state.firebase.data.users || {})[state.firebase.auth.uid]
});

export default compose(
  firebaseConnect(["/users"]),
  withStyles(styles),
  connect(mapStateToProps)
)(Account);
