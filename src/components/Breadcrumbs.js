/**
 * @file Breadcrumbs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 06.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  },
  breadcrumbActions: {
    position: "absolute",
    right: theme.spacing.unit
  },
  breadcrumbAction: {
    marginLeft: theme.spacing.unit
  }
});

class Breadcrumbs extends React.PureComponent {
  static propTypes = {
    action: PropTypes.any,
    classes: PropTypes.object,
    paths: PropTypes.array.isRequired
  };

  render() {
    const { action, classes, paths } = this.props;

    return (
      <Toolbar>
        {paths.map(
          (pathInfo, index) =>
            index === paths.length - 1 ? (
              <Typography className={classes.breadcrumbText} key={index}>
                {pathInfo.label}
              </Typography>
            ) : (
              <Fragment key={index}>
                <Link className={classes.breadcrumbLink} to={pathInfo.link}>
                  <Typography className={classes.breadcrumbText}>
                    {pathInfo.label}
                  </Typography>
                </Link>
                <ChevronRightIcon />
              </Fragment>
            )
        )}
        {action && (
          <Toolbar className={classes.breadcrumbActions}>
            {Array.isArray(action) ? (
              action.filter(action => action).map(action => (
                <Button
                  className={classes.breadcrumbAction}
                  key={action.label}
                  onClick={action.handler}
                  variant="raised"
                >
                  {action.label}
                </Button>
              ))
            ) : (
              <Button onClick={action.handler} variant="raised">
                {action.label}
              </Button>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}

export default withStyles(styles)(Breadcrumbs);
