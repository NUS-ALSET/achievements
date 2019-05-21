/**
 * @file TasksTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 21.03.19
 */

import * as React from "react";
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

class TasksTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  };

  render() {
    const { classes, onDeleteClick, tasks } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!Object.keys(tasks).length ? (
            <TableRow>
              <TableCell colSpan={5}>Empty list</TableCell>
            </TableRow>
          ) : (
            Object.keys(tasks)
              .map(id => ({ ...tasks[id], id }))
              .map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>
                    <Link className={classes.link} to={`/advanced/${task.id}`}>
                      <Button className={classes.button} variant="contained">
                        View
                      </Button>
                    </Link>
                    <Button
                      className={classes.button}
                      onClick={() => onDeleteClick(task.id)}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(TasksTable);
