import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

// import data
import { columnChartConfigs } from "./charts/basic.js";
import stackedChartConfigs from "./charts/stackedColumnChart.js";
import chartThreeConfigs from "./charts/chartThree.js";
import chartFourConfigs from "./charts/chartFour.js";
import chartFiveConfigs from "./charts/chartFive.js";



// import fusioncharts library
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);



const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

function AutoGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
    <h1> Dashboard - Analytics on Paths</h1>
    {/* QUICK OVERVIEW */}
    <h2> Quick Overview </h2>
    <p> A quick overview of the usage of the platform in the <b>current</b> month.</p>
    <Grid container spacing={24}>
        <Grid item xs>
            <Paper className={classes.paper}>
                <h1>333</h1>
                <p>Number of Unique Users this Month</p>
            </Paper>
        </Grid>
        <Grid item xs>
            <Paper className={classes.paper}>
                <h1>98</h1>
                <p>Number of New Users this Month</p>
            </Paper>
        </Grid>
        <Grid item xs>
            <Paper className={classes.paper}>
                <h1>5</h1>
                <p>Average Number of Activities Completed this Month</p>
            </Paper>
        </Grid>
    </Grid>

    <Grid container spacing={24}>
        <Grid item xs>
            <Paper className={classes.paper}>
                <ReactFC {...columnChartConfigs}/>
            </Paper>
        </Grid>
    </Grid>

    {/* USAGE ACROSS MONTHS */}
    <h2> Usage Across Months </h2>
    <p> Insights on usage of paths across the months. </p>
    <Grid container spacing={24}>
        <Grid item xs>
            <Paper className={classes.paper}>
                <ReactFC {...stackedChartConfigs}/>
        </Paper>
        </Grid>
    </Grid>

    {/* USAGE ON PARTICULAR PATH */}
    <h2> USAGE Across Paths </h2>
    <p> Insights on usage across paths. </p>
    <Grid container spacing={24}>
        <Grid item xs>
        <Paper className={classes.paper}>
            <ReactFC {...chartThreeConfigs}/>
        </Paper>
        </Grid>
        <Grid item xs>
        <Paper className={classes.paper}>
        <ReactFC {...chartFourConfigs}/>
        </Paper>
        </Grid>
    </Grid>

    {/* USAGE ON PARTICULAR PATH */}
    <h2> USAGE ON PARTICULAR PATH </h2>
    <p> Deeper insights on a particular path. For demo purposes, the Intro to Vue path was chosen.</p>
    <Grid container spacing={24}>
        <Grid item xs>
            <Paper className={classes.paper}>
                Avg time taken for students to complete each activity (Ben's charts)
            </Paper>
        </Grid>
        <Grid item xs>
            <Paper className={classes.paper}>
                Other charts
            </Paper>
        </Grid>
    </Grid>
    <Grid container spacing={24}>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                To help identify paths that have further room for improvement.
                <ReactFC {...chartFiveConfigs}/>
            </Paper>
        </Grid>
    </Grid>
    </div>
  );
}
AutoGrid.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AutoGrid);