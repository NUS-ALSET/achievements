/**
 * @file Recommendations container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 13.06.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import PathCard from "./cards/PathCard";

class Recommendations extends React.PureComponent {
  static propTypes = {
    recs: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
  };

  getRecTitle = rec => `Use the ${rec.feature} ${rec.featureType}`;

  render() {
    const { recs, title } = this.props;

    return (
      <Fragment>
        <Typography
          style={{
            marginLeft: 4
          }}
          variant="headline"
        >
          {title}
        </Typography>
        <Paper
          style={{
            marginBottom: 24
          }}
        >
          <Grid container spacing={4}>
            <Grid item sm={4} xs={12}>
              <PathCard
                featured={true}
                path={recs[0].path}
                problem={recs[0].problem}
                title={this.getRecTitle(recs[0])}
                video={recs[0].video}
              />
            </Grid>
            <Grid
              item
              sm={8}
              style={{
                display: "flex",
                flexWrap: "wrap"
              }}
              xs={12}
            >
              {recs
                .slice(1)
                .map(rec => (
                  <PathCard
                    key={rec.problem}
                    path={rec.path}
                    problem={rec.problem}
                    title={this.getRecTitle(rec)}
                    video={rec.video}
                  />
                ))}
            </Grid>
          </Grid>
        </Paper>
      </Fragment>
    );
  }
}

export default Recommendations;
