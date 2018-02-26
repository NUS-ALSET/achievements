import {
  Grid,
  Table,
  TableGroupRow,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import { GroupingState, IntegratedGrouping } from "@devexpress/dx-react-grid";

import PropTypes from "prop-types";
import React from "react";

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    assignments: PropTypes.any.isRequired,
    instructorView: PropTypes.bool.isRequired,
    studentName: PropTypes.string
  };

  state = {
    editingIds: [],
    changes: {},
    added: []
  };

  render() {
    return (
      <Grid
        columns={[
          { name: "studentName", title: "Student" },
          { name: "assignment", title: "Assignment" },
          { name: "solution", title: "Solution" }
        ].concat(
          this.props.instructorView
            ? [{ name: "actions", title: "Actions" }]
            : []
        )}
        rows={this.props.assignments}
      >
        <GroupingState
          defaultExpandedGroups={[this.props.studentName]}
          defaultGrouping={[{ columnName: "studentName" }]}
        />
        <IntegratedGrouping />
        <Table />
        <TableHeaderRow />
        <TableGroupRow />
      </Grid>
    );
  }
}

// noinspection JSUnusedGlobalSymbols
export default AssignmentsTable;
