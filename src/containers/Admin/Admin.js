/**
 * @file Admin container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 03.03.18
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";

import withStyles from "material-ui/styles/withStyles";

const styles = theme => ({
  section: { padding: theme.spacing.unit },
  setButton: { marginTop: 11 }
});

class Admin extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dispatch: PropTypes.func
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.section}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography>
              Authorize Achievements App by visiting this url:
              <a href="//google.com">auth</a>
            </Typography>
          </Grid>
          <Grid item sm={9} xs={12}>
            <TextField
              fullWidth
              helperText="Enter generated by link above auth code"
              label="Auth code"
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <Button className={classes.setButton} fullWidth variant="raised">
              Set
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({});

export default compose(withStyles(styles), connect(mapStateToProps))(Admin);
