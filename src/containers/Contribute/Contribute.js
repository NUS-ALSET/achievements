import React from 'react';
// import PropTypes from 'prop-types';

import GithubIcon from '../../components/icons/GithubIcon';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  mainDiv: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
  mainContent: {
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  contriButton: {
    marginTop: theme.spacing.unit * 4,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});


function Contribute(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <main>
        <div className={classes.mainDiv}>
          <div className={classes.mainContent}>
            <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
              Contribute
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" paragraph>
              NUS ALSET Achievements is an open development hosted on GitHub
            </Typography>
            <p style={{textAlign: "center"}}>
              <a
                href="https://travis-ci.org/NUS-ALSET/achievements"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="https://travis-ci.org/NUS-ALSET/achievements.svg?branch=master"
                  alt="Build Status"
                />
              </a>
              &nbsp;
              <a
                href="https://github.com/prettier/prettier"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
                  alt="code style: prettier"
                />
              </a>
              &nbsp;
              <a
                href="https://waffle.io/NUS-ALSET/achievements"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="https://badge.waffle.io/NUS-ALSET/achievements.svg?columns=all"
                  alt="Waffle.io - Columns and their card count"/>
              </a>
              &nbsp;
              <a
                href="http://isitmaintained.com/project/NUS-ALSET/achievements"
                title="Average time to resolve an issue"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="http://isitmaintained.com/badge/resolution/NUS-ALSET/achievements.svg"
                  alt="Average time to resolve an issue"
                />
              </a>
              &nbsp;
              <a
                href="http://isitmaintained.com/project/NUS-ALSET/achievements"
                title="Percentage of issues still open"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="http://isitmaintained.com/badge/open/NUS-ALSET/achievements.svg"
                  alt="Percentage of issues still open"
                />
              </a>
            </p>

            <div className={classes.contriButton}>
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <a
                    href="https://github.com/NUS-ALSET/achievements"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                    >
                      <GithubIcon className={classes.leftIcon} />
                      Our GitHub
                    </Button>
                  </a>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default withStyles(styles)(Contribute);
