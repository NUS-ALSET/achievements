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
    dispatch: PropTypes.func.isRequired,
    problems: PropTypes.object
  };

  render() {
    const { problems } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Problem name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(problems || {})
            .map(id => ({ ...problems[id], id }))
            .map(problem => (
              <TableRow key={problem.id}>
                <TableCell>{problem.name}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ProblemsTable);
