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
import Typography from "@material-ui/core/Typography";

import withStyles from "@material-ui/core/styles/withStyles";
import { adminUpdateConfigRequest, createNewService, fetchServiceDetails } from "./actions";
import { sagaInjector } from "../../services/saga";
import ServicesList from "./ServicesList";
import ServiceDialog from "../../components/dialogs/ServiceDialog";

const styles = theme => ({
  section: { padding: theme.spacing.unit },
  setButton: { marginTop: 11 },
  formControl: {
    margin: theme.spacing.unit
  }
});

// FIXIT: move it into shared with functions place
const recommendations = {
  NotebookWithNewSkills: "Notebook Activities to Learn New Skills",
  NotebookWithUsedSkills: "Notebook Activities to Reinforce Used Skills",
  codeCombat: "CodeCombat Activities",
  jupyter: "Colaboratory Notebook Activities",
  jupyterInline: "Jupyter Notebook Activities",
  youtube: "YouTube Video Activities",
  game: "Game Activities"
};
const urls = {
  jupyterLambdaProcessor: "Jupyter Solver url",
  jupyterAnalysisLambdaProcessor: "Jupyter Analyzer url",
  codeCombatProfileURL: "CodeCombat Profile url"
};
const jestConfig = {
  awsJestRunnerServerURL: "Jest Runner url",
  githubAccessToken: "GitHub Access Token"
};

class Admin extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    adminUpdateConfigRequest: PropTypes.func,
    config: PropTypes.object,
    isAdmin: PropTypes.bool,
    createNewService: PropTypes.func,
    thirdPartyServices: PropTypes.object,
    fetchServiceDetails: PropTypes.func,
    service: PropTypes.object
  };

  static defaultProps = {
    config: {
      jestRunnerConfig: {},
      recommendations: {}
    }
  };

  state = {
    recommendations: {},
    newServiceDetails: {},
    serviceModalOpen: false,
    editing: false
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
    this.props.adminUpdateConfigRequest(this.state);
  };

  addService = () => {
    this.props.createNewService(this.state.newServiceDetails);
  }

  toggleServiceModal = (editing) => () => {
    this.setState(state => ({
      serviceModalOpen: !state.serviceModalOpen,
      editing
    }), () => {
      // console.log(this.state)
    })
  }

  editService = id => () => {
    this.toggleServiceModal(true)();
    // fetch service details
    this.props.fetchServiceDetails(id);
  }

  deleteService = id => () => console.log("deleting service....", id)

  render() {
    const { classes, config, isAdmin } = this.props;
    const allowed = config.recommendations || {
      NotebookWithNewSkills: true,
      NotebookWithUsedSkills: true,
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
      <React.Fragment>
        <Paper className={classes.section}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5">
                Admin Page
              </Typography>
              <Typography gutterBottom>
                You are able to see this '/admin' page because you have been
                granted admin rights in our Firebase.
                <br />
                <b>With great power comes great responsibility.</b>
                <br />
                Please do not delete ANYTHING in Firebase. Since the database is
                "schema-less", we may not know how the code is using different
                nodes and where the code is expecting certain properties to exist.
                If you need to repeatedly delete some data (activities, paths,
                courses), we should create a feature in the code to do that.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h6">
                Remote URLs used
              </Typography>
              <FormControl
                className={classes.formControl}
                component="fieldset"
                fullWidth
              >
                <FormLabel component="legend">Edit URLs</FormLabel>
                <br />
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
              <Typography gutterBottom variant="h6">
                Control recommendations to display at Home
              </Typography>
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
                variant="contained"
              >
                UPDATE
              </Button>
            </Grid>
            <Grid item sm={9} xs={12} />
              <Grid item sm={3} xs={12}>
                <Button
                  color="primary"
                  fullWidth
                  onClick={this.toggleServiceModal(false)}
                  variant="contained"
                >
                  Add Service
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ServicesList
                deleteService={this.deleteService}
                editService={this.editService}
                services={this.props.thirdPartyServices}
              />
            </Grid>
        </Paper>
        <ServiceDialog
          createNewService={this.props.createNewService}
          editing={this.state.editing}
          onClose={this.toggleServiceModal(false)}
          open={this.state.serviceModalOpen}
          service={this.props.service}
        />
      </React.Fragment>
    );
  }
}

sagaInjector.inject(sagas);

// add state param when needed
const mapStateToProps = state => ({
  isAdmin: state.firebase.data.isAdmin,
  config: state.firebase.data.config,
  thirdPartyServices: state.firebase.data.thirdPartyServices,
  service: state.admin.service
});

const mapDispatchToProps = dispatch => ({
  adminUpdateConfigRequest,
  createNewService: data => {
    dispatch(createNewService(data))
  },
  fetchServiceDetails: id => {
    dispatch(fetchServiceDetails(id))
  }
})

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
      "/config",
      {
        path: "/thirdPartyServices",
        storeAs: "thirdPartyServices"
      }
    ];
  }),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Admin);
