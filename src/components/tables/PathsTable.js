/**
 * @file PathsTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import { pathProblemDialogShow } from "../../containers/Paths/actions";

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class PathsTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currentUserId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    paths: PropTypes.object.isRequired
  };

  onEditClick = problem => this.props.dispatch(pathProblemDialogShow(problem));

  render() {
    const { classes, paths } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Path name</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell
              style={{
                width: 360
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(paths)
            .filter(id => paths[id])
            .map(id => ({ ...paths[id], id }))
            .map(path => (
              <TableRow key={path.id}>
                <TableCell>{path.name}</TableCell>
                <TableCell>{path.progress}</TableCell>
                <TableCell>
                  <Link className={classes.link} to={`/paths/${path.id}`}>
                    <Button variant="raised">Open</Button>
                  </Link>
                  <Button
                    className={classes.button}
                    onClick={() => this.onEditClick(path)}
                    variant="raised"
                  >
                    Refresh
                  </Button>
                  <Button
                    className={classes.button}
                    onClick={() => this.onEditClick(path)}
                    variant="raised"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(PathsTable);
