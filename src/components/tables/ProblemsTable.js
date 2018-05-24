/**
 * @file ProblemsTable component module
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

class ProblemsTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currentUserId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    pathOwnerId: PropTypes.string,
    problems: PropTypes.array.isRequired,
    selectedPathId: PropTypes.string
  };

  onEditClick = problem => this.props.dispatch(pathProblemDialogShow(problem));

  render() {
    const { classes, pathOwnerId, problems, selectedPathId } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Problem name</TableCell>
            <TableCell
              style={{
                width: 240
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {problems.map(problem => (
            <TableRow key={problem.id}>
              <TableCell>{problem.name}</TableCell>
              <TableCell>
                <Link
                  className={classes.link}
                  to={`/paths/${selectedPathId || pathOwnerId}/problems/${
                    problem.id
                  }`}
                >
                  <Button variant="raised">Open</Button>
                </Link>
                <Button
                  className={classes.button}
                  onClick={() => this.onEditClick(problem)}
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

export default withStyles(styles)(ProblemsTable);
