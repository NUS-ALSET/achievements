import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "react-redux-firebase";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import Table, {
// eslint-disable-next-line no-unused-vars
  TableBody,
  // eslint-disable-next-line no-unused-vars
  TableCell,
  // eslint-disable-next-line no-unused-vars
  TableFooter,
  TableHead,
  // eslint-disable-next-line no-unused-vars
  TablePagination,
  TableRow,
  // eslint-disable-next-line no-unused-vars
  TableSortLabel
} from "material-ui/Table";

const linkStyle = {
  textDecoration: "none"
};

class CoursesTable extends React.PureComponent {
  static propTypes = {
    ownerId: PropTypes.string.isRequired,
    courses: PropTypes.any.isRequired
  };

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course name</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(this.props.courses) ? (
            <TableRow>
              <TableCell>Empty list</TableCell>
            </TableRow>
          ) : (
            Object.keys(this.props.courses).map(courseId => {
              return (
                <TableRow key={courseId}>
                  <TableCell>{this.props.courses[courseId].name}</TableCell>
                  <TableCell>
                    {this.props.courses[courseId].instructorName}
                  </TableCell>
                  <TableCell>
                    <Link to={`/courses/${courseId}`} style={linkStyle}>
                      <Button raised>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  }
}

export default CoursesTable;
