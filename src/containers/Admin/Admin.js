/**
 * @file Admin container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 03.03.18
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";

import sagas from "./sagas";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import withStyles from "@material-ui/core/styles/withStyles";
import { adminUpdateConfigRequest } from "./actions";
import { sagaInjector } from "../../services/saga";

const styles = theme => ({
  section: { padding: theme.spacing.unit },
  setButton: { marginTop: 11 },
  formControl: {
    margin: theme.spacing.unit
  }
});

// FIXIT: move it into shared with functions place
const recommendations = {
  solvedPySkills: "Jupyter Activities With New Skills",
  unSolvedPySkills: "Jupyter Activities With Solved Skills",
  codeCombat: "CodeCombat Activities",
  jupyter: "Colaboratory Notebook Activities",
  jupyterInline: "Jupyter Notebook Activities",
  youtube: "YouTube Video Activities",
  game: "Game Activities"
};
const urls = {
  jupyterLambdaProcessor: "Jupyter Solver url",
  jupyterAnalysisLambdaProcessor: "Jupyter Analyzer url"
};
const jestConfig = {
  awsJestRunnerServerURL: "Jest Runner url",
  githubAccessToken: "GithHub Access Token"
};

class Admin extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dispatch: PropTypes.func,
    config: PropTypes.object,
    isAdmin: PropTypes.bool
  };
  static defaultProps = {
    config: {
      jestRunnerConfig: {},
      recommendations: {}
    }
  };

  state = {
    recommendations: {}
  };

  handleChange = name => event =>
    this.setState({
      [name]: event.target.value
    });

  handleChangeRecommendation = name => event =>
    this.setState({
      recommendations: {
        ...this.state.recommendations,
        [name]: event.target.checked
      }
    });

  commit = () => {
    this.props.dispatch(adminUpdateConfigRequest(this.state));
  };

  render() {
    const { classes, config, isAdmin } = this.props;
    const allowed = config.recommendations || {
      solvedPySkills: true,
      unSolvedPySkills: true,
      codeCombat: true,
      jupyter: true,
      jupyterInline: true,
      youtube: true,
      game: true
    };
    config.jestRunnerConfig = config.jestRunnerConfig || {};

    if (!isAdmin) {
      return <div>Are you sure that you have the necessary rights?</div>;
    }

    return (
      <Paper className={classes.section}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <FormControl
              className={classes.formControl}
              component="fieldset"
              fullWidth
            >
              <FormLabel component="legend">URLs</FormLabel>
              <FormGroup>
                {Object.keys(urls).map(url => (
                  <TextField
                    fullWidth
                    key={url}
                    label={urls[url]}
                    onChange={this.handleChange(url)}
                    value={this.state[url] || config[url] || ""}
                  />
                ))}
                {Object.keys(jestConfig).map(url => (
                  <TextField
                    fullWidth
                    key={url}
                    label={jestConfig[url]}
                    onChange={this.handleChange(url)}
                    value={
                      this.state[url] || config.jestRunnerConfig[url] || ""
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl} component="fieldset">
              <FormLabel component="legend">Allowed recommendations</FormLabel>
              <FormGroup>
                {Object.keys(allowed).map(key => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          this.state.recommendations[key] === undefined
                            ? config.recommendations[key]
                            : this.state.recommendations[key]
                        }
                        onChange={this.handleChangeRecommendation(key)}
                        value={String(
                          this.state.recommendations[key] ||
                            config.recommendations[key]
                        )}
                      />
                    }
                    key={key}
                    label={recommendations[key]}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item sm={9} xs={12} />
          <Grid item sm={3} xs={12}>
            <Button
              color="primary"
              fullWidth
              onClick={this.commit}
              variant="raised"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

sagaInjector.inject(sagas);

// add state param when needed
const mapStateToProps = state => ({
  isAdmin: state.firebase.data.isAdmin,
  config: state.firebase.data.config
});

export default compose(
  firebaseConnect((ownProps, store) => {
    const state = store.getState();
    const uid = state.firebase.auth.uid;

    if (!uid) {
      return [];
    }
    return [
      {
        path: `/admins/${uid}`,
        storeAs: "isAdmin"
      },
      "/config"
    ];
  }),
  withStyles(styles),
  connect(mapStateToProps)
)(Admin);
