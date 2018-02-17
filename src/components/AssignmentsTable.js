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
    onAcceptClick: PropTypes.func,
    instructorView: PropTypes.bool.isRequired,
    sortState: PropTypes.object,
    currentUser: PropTypes.object,
    course: PropTypes.object
  };

  state = {
    editingIds: [],
    changes: {},
    added: []
  };

  getSolution(assignment, solutions) {
    let solution = solutions[assignment.id];
    const result = (solution && solution.value) || "";

    switch (assignment.questionType) {
      case "Profile":
        return solution ? (
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://codecombat.com/user/${result.replace(
              / \(\d+\)$/,
              ""
            )}`}
          >
            {result}
          </a>
        ) : (
          undefined
        );
      default:
        return result;
    }
  }

  render() {
    const {
      /** @type AssignmentCourse */
      course,
      currentUser,
      sortState,
      onSortClick,
      onSubmitClick
    } = this.props;

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
            {course.assignments
              .filter(assignment => assignment.visible)
              .map(assignment => (
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
                    {assignment.details && (
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={assignment.details}
                      >
                        details
                      </a>
                    )}
                  </div>
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(course.members).map(id => {
            const studentInfo = course.members[id];
            return (
              <TableRow key={studentInfo.id}>
                <TableCell>{studentInfo.name}</TableCell>
                {course.assignments
                  .filter(assignment => assignment.visible)
                  .map(assignment => (
                    <TableCell key={assignment.id}>
                      <Fragment>
                        {this.getSolution(assignment, studentInfo.solutions)}

                        {studentInfo.id === currentUser.id && (
                          <Button
                            onClick={() =>
                              onSubmitClick(
                                assignment,
                                studentInfo.solutions[assignment.id]
                              )
                            }
                          >
                            {studentInfo.solutions[assignment.id]
                              ? "Update"
                              : "Submit"}
                          </Button>
                        )}
                      </Fragment>
                    </TableCell>
                  ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default AssignmentsTable;
