import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "material-ui/Table";

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    onSortClick: PropTypes.func.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    sortState: PropTypes.object,

    solutions: PropTypes.object,
    studentAssignments: PropTypes.arrayOf(PropTypes.object),
    instructorView: PropTypes.bool.isRequired,
    assignmentDefinitions: PropTypes.object,
    studentName: PropTypes.string,
    userId: PropTypes.string
  };

  state = {
    editingIds: [],
    changes: {},
    added: []
  };

  getSolution(assignment, studentInfo) {
    const solution = studentInfo[assignment.id];

    switch (assignment.questionType) {
      case "Profile":
        return solution.value ? (
          <a
            target="_blank"
            href={`https://codecombat.com/user/${solution.value.replace(
              / \(\d+\)$/,
              ""
            )}`}
          >
            {solution.value}
          </a>
        ) : (
          solution.value
        );
      default:
        return solution.value;
    }
  }

  render() {
    const {
      assignmentDefinitions,
      studentAssignments,
      sortState,
      onSortClick,
      onSubmitClick
    } = this.props;
    const assignments = Object.keys(assignmentDefinitions)
      .filter(assignmentId => assignmentDefinitions[assignmentId].visible)
      .map(id => Object.assign({ id: id }, assignmentDefinitions[id]));

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                style={{
                  minWidth: 250
                }}
                active={sortState.field === "studentName"}
                direction={sortState.direction}
                onClick={() => onSortClick()}
              >
                Student name
              </TableSortLabel>
            </TableCell>
            {assignments.map(assignment => (
              <TableCell
                key={assignment.id}
                style={{
                  minWidth: 250,
                  whiteSpace: "normal",
                  wordWrap: "break-word"
                }}
              >
                <TableSortLabel
                  active={sortState.field === assignment.id}
                  direction={sortState.direction}
                  onClick={() => onSortClick(assignment)}
                >
                  {assignment.name}
                </TableSortLabel>
                <div>
                  <a target="_blank" href={assignment.details}>
                    details
                  </a>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentAssignments.map(studentInfo => (
            <TableRow key={studentInfo.studentId}>
              <TableCell>{studentInfo.studentName}</TableCell>
              {assignments.map(assignment => {
                return (
                  <TableCell key={assignment.id}>
                    <Fragment>
                      {this.getSolution(assignment, studentInfo)}
                      {studentInfo[assignment.id].showActions && (
                        <Button
                          onClick={() =>
                            onSubmitClick(
                              assignment,
                              studentInfo[assignment.id]
                            )
                          }
                        >
                          {studentInfo[assignment.id].value
                            ? "Update"
                            : "Submit"}
                        </Button>
                      )}
                    </Fragment>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default AssignmentsTable;
