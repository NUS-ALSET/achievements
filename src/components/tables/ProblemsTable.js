/**
 * @file CohortsTable container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Button from "material-ui/Button";

import { Link } from "react-router-dom";

import withStyles from "material-ui/styles/withStyles";

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
    currentUserId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    pathOwnerId: PropTypes.string,
    problems: PropTypes.array.isRequired,
    selectedPathId: PropTypes.string
  };

  render() {
    const { pathOwnerId, problems, selectedPathId } = this.props;

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
                  to={`/paths/${pathOwnerId || selectedPathId}/problems/${
                    problem.id
                  }`}
                >
                  <Button variant="raised">Open</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ProblemsTable);
