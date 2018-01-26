import React from "react";
import PropTypes from "prop-types";
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
import { isEmpty } from "react-redux-firebase";

class AssignementsTable extends React.PureComponent {
  static propTypes = {
    assignements: PropTypes.any.isRequired
  };

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course name</TableCell>
            <TableCell>Instructor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(this.props.assignements) ? (
            <TableRow>
              <TableCell>Empty list</TableCell>
            </TableRow>
          ) : (
            Object.keys(this.props.assignements).map(courseId => {
              return (
                <TableRow key={courseId}>
                  <TableCell>
                    {this.props.assignements[courseId].name}
                  </TableCell>
                  <TableCell>
                    {this.props.assignements[courseId].instructorName}
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

export default AssignementsTable;
