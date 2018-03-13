/**
 * @file Breadcrumbs container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 06.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";

import ChevronRightIcon from "material-ui-icons/ChevronRight";

import withStyles from "material-ui/styles/withStyles";

const styles = theme => ({
  breadcrumbLink: {
    textDecoration: "none"
  },
  breadcrumbText: {
    margin: theme.spacing.unit,
    textTransform: "uppercase",
    fontSize: "0.875rem"
  }
});

class Breadcrumbs extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    paths: PropTypes.array.isRequired
  };

  render() {
    const { classes, paths } = this.props;

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
      </Toolbar>
    );
  }
}

export default withStyles(styles)(Breadcrumbs);
