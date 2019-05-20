/**
 * @file CohortsTable container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class CohortsTable extends React.PureComponent {
  static propTypes = {
    onEditCohortClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    cohorts: PropTypes.object.isRequired,
    currentUserId: PropTypes.string.isRequired
  };

  render() {
    const { cohorts, currentUserId, classes, onEditCohortClick } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cohort name</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!Object.keys(cohorts).length ? (
            <TableRow>
              <TableCell colSpan={5}>Empty list</TableCell>
            </TableRow>
          ) : (
            Object.keys(cohorts)
              .map(id => ({ ...cohorts[id], id }))
              .map(cohort => (
                <TableRow key={cohort.id}>
                  <TableCell>{cohort.name}</TableCell>
                  <TableCell>{cohort.instructorName}</TableCell>
                  <TableCell>
                    <Link className={classes.link} to={`/cohorts/${cohort.id}`}>
                      <Button className={classes.button} variant="contained">
                        View
                      </Button>
                    </Link>
                    {cohort.owner === currentUserId && (
                      <Fragment>
                        <Button
                          className={classes.button}
                          onClick={() => onEditCohortClick(cohort)}
                          variant="contained"
                        >
                          Edit
                        </Button>
                        {/* Not implemented yet */ false && (
                          <Button
                            className={classes.button}
                            variant="contained"
                          >
                            Delete
                          </Button>
                        )}
                      </Fragment>
                    )}
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(CohortsTable);
