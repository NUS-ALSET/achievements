/**
 * @file CohortCoursesTable container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import { Link, withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import withStyles from "@material-ui/core/styles/withStyles";
import { cohort } from "../../types";

const MARGIN_MULTIPLIER = 3;

const styles = theme => ({
  table: {
    width: "100%",
    marginTop: theme.spacing.unit * MARGIN_MULTIPLIER,
    overflowX: "auto",
    minWidth: 700
  },
  narrowCell: {
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingBottom: 2,
    paddingTop: 0
  },
  button: {
    margin: theme.spacing.unit
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f0f0f0"
    }
  }
});

class CohortCoursesTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    cohort: cohort,
    membersPathsRanking: PropTypes.object,
    courses: PropTypes.array,
    isInstructor: PropTypes.bool,
    onRemoveClick: PropTypes.func,
    onSortClick: PropTypes.func,
    sortState: PropTypes.shape({
      field: PropTypes.string,
      direction: PropTypes.oneOf(["asc", "desc"])
    })
  };

  render() {
    const {
      classes,
      courses: crs,
      cohort,
      isInstructor,
      onRemoveClick,
      onSortClick,
      sortState,
      membersPathsRanking,
      uid
    } = this.props;
    let totals = {
      progress: 0,
      participants: 0
    };
    const courses = crs || [];

    if (courses.length <= 0) {
      return <p>No Courses found for this cohort</p>;
    }
    courses.forEach(course => {
      totals.progress += course.progress;
      totals.participants += course.participants;
      return true;
    });
    const rankCellData = ["User Path Rank->"];
    const nonPathCellCount = 3;
    cohort.paths.forEach(path => {
      rankCellData.push(((membersPathsRanking[path] || {})[uid] || {}).rank);
    });
    for (let i = 0; i < nonPathCellCount; i++) {
      rankCellData.push("");
    }
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.narrowCell}>
              <TableSortLabel
                active={sortState.field === "rank"}
                direction={sortState.direction}
                onClick={() => onSortClick("rank")}
              >
                Course Rank
              </TableSortLabel>
            </TableCell>
            {cohort.pathsData && cohort.pathsData.length ? (
              cohort.pathsData.map(pathData => {
                pathData = pathData || {};
                return (
                  <TableCell
                    className={classes.narrowCell}
                    key={pathData.id || Math.random()}
                  >
                    <TableSortLabel
                      active={sortState.field === pathData.id}
                      direction={sortState.direction}
                      onClick={() => onSortClick(pathData.id)}
                    >
                      {pathData.name}
                    </TableSortLabel>
                  </TableCell>
                )
              })
            ) : (
              <TableCell className={classes.narrowCell}>
                <TableSortLabel
                  active={sortState.field === "paths"}
                  direction={sortState.direction}
                  onClick={() => onSortClick("paths")}
                >
                  Paths for Cohort
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell className={classes.narrowCell}>
              <TableSortLabel
                active={sortState.field === "progress"}
                direction={sortState.direction}
                onClick={() => onSortClick("progress")}
              >
                Explorers ({totals.progress})
              </TableSortLabel>
            </TableCell>

            <TableCell className={classes.narrowCell}>
              <TableSortLabel
                active={sortState.field === "participants"}
                direction={sortState.direction}
                onClick={() => onSortClick("participants")}
              >
                Total Students ({totals.participants})
              </TableSortLabel>
            </TableCell>
            <TableCell
              className={classes.narrowCell}
              style={{ width: "50%", textAlign: "center" }}
            >
              <TableSortLabel
                active={sortState.field === "name"}
                direction={sortState.direction}
                onClick={() => onSortClick("name")}
              >
                Course
              </TableSortLabel>
            </TableCell>
            {isInstructor && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(course => (
              <TableRow
                className={classes.row}
                hover
                key={course.id}
                style={{ height: 18 }}
              >
                <TableCell className={classes.narrowCell}>
                  <strong>{course.rank}</strong>
                </TableCell>
                {cohort.paths ? (
                  cohort.paths.length &&
                  cohort.paths.map(id => (
                    <TableCell className={classes.narrowCell} key={id}>
                      {course.pathsProgress && course.pathsProgress[id]}
                    </TableCell>
                  ))
                ) : (
                  <TableCell className={classes.narrowCell}>None</TableCell>
                )}
                <TableCell className={classes.narrowCell}>
                  {course.progress}
                </TableCell>
                <TableCell className={classes.narrowCell}>
                  {course.participants}
                </TableCell>
                <TableCell
                  className={classes.narrowCell}
                  style={{ width: "50%", textAlign: "center" }}
                >
                  <Link to={`/courses/${course.id}`}>{course.name}</Link>
                </TableCell>
                {isInstructor && (
                  <TableCell className={classes.narrowCell}>
                    <Button
                      color="secondary"
                      onClick={() => onRemoveClick(course.id)}
                      size="small"
                    >
                      Remove
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          {membersPathsRanking && Object.keys(membersPathsRanking).length>0 &&
          <TableRow
            className={classes.row}
            hover
            style={{ height: 18, backgroundColor: "darkgrey" }}
          >
            {rankCellData.map((data, index) => {
              return (
                <TableCell
                  className={classes.narrowCell}
                  key={`${index + String(data)}`}
                >
                  {data}
                </TableCell>
              );
            })}
          </TableRow>}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(withRouter(CohortCoursesTable));
