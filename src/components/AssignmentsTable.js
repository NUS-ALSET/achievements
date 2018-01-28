import React from "react";
import PropTypes from "prop-types";

import { GroupingState, IntegratedGrouping } from "@devexpress/dx-react-grid";
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableGroupRow
} from "@devexpress/dx-react-grid-material-ui";

class AssignmentsTable extends React.PureComponent {
  static propTypes = {
    assignments: PropTypes.any.isRequired
  };

  state = {
    editingIds: [],
    changes: {},
    added: []
  };

  render() {
    return (
      <Grid
        rows={this.props.assignments}
        columns={[
          { name: "studentName", title: "Student" },
          { name: "assignment", title: "Assignment" },
          { name: "team", title: "Team" }
        ]}
      >
        <GroupingState defaultGrouping={[{ columnName: "studentName" }]} />
        <IntegratedGrouping />
        <VirtualTable />
        <TableHeaderRow />
        <TableGroupRow />
      </Grid>
    );
  }
}

export default AssignmentsTable;
