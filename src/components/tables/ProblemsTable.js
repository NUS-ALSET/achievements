/**
 * @file ProblemsTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import DoneIcon from "@material-ui/icons/Done";

import withStyles from "@material-ui/core/styles/withStyles";

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
    onEditProblem: PropTypes.func.isRequired,
    onOpenProblem: PropTypes.func.isRequired,
    pathOwnerId: PropTypes.any,
    problems: PropTypes.array.isRequired
  };

  render() {
    const {
      classes,
      currentUserId,
      onEditProblem,
      onOpenProblem,
      pathOwnerId,
      problems
    } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Problem name</TableCell>
            <TableCell>Description</TableCell>
            {currentUserId !== pathOwnerId && <TableCell>Status</TableCell>}
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
              <TableCell>{problem.description}</TableCell>
              {currentUserId !== pathOwnerId && (
                <TableCell>
                  {problem.solved && (
                    <Icon>
                      <DoneIcon />
                    </Icon>
                  )}
                </TableCell>
              )}
              <TableCell>
                <Button onClick={() => onOpenProblem(problem)} variant="raised">
                  Open
                </Button>
                {pathOwnerId === currentUserId && (
                  <Button
                    className={classes.button}
                    onClick={() => onEditProblem(problem)}
                    variant="raised"
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ProblemsTable);
