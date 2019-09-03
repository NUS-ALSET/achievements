/**
 * @file PathsTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";

import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import isEmpty from "lodash/isEmpty";

export const PATH_STATS_FILTER_TYPES = [
  {
    id: "attempts",
    caption: "Attempts"
  },
  {
    id: "solves",
    caption: "Solves"
  },
  {
    id: "attempts_per_solve",
    caption: "Attempts per solve"
  },
  {
    id: "totalActivities",
    caption: "Total Activities"
  }
];

const styles = () => ({
  link: {
    textDecoration: "none"
  }
});

class PathsTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    viewCreatedTab: PropTypes.bool,
    paths: PropTypes.object.isRequired,
    pathDialogShow: PropTypes.func.isRequired,
    uid: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { sortedPaths: [], selectedVal: "attempts" };
  }

  componentDidUpdate(prevProps, prevState) {
    if (isEmpty(prevState.sortedPaths) && !isEmpty(this.props.paths)) {
      let sorted = this.props.paths ? Object.values(this.props.paths) : [];
      this.setState({ sortedPaths: sorted });
    }
  }

  onEditClick = pathInfo => this.props.pathDialogShow(pathInfo);

  sortPaths = key => {
    let publicPaths = { ...this.props.paths };
    let sorted = Object.values(publicPaths).sort((a, b) =>
      a[key.target.value] === b[key.target.value]
        ? 0
        : b[key.target.value] < a[key.target.value]
        ? -1
        : 1
    );

    this.setState({
      sortedPaths: sorted,
      selectedVal: key.target.value
    });
  };
  render() {
    const { classes, viewCreatedTab, uid } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Path name</TableCell>
            {!viewCreatedTab && (
              <TableCell
                style={{
                  // eslint-disable-next-line no-magic-numbers
                  width: 150
                }}
              >
                Progress
              </TableCell>
            )}

            <TableCell
              style={{
                // eslint-disable-next-line no-magic-numbers
                width: 150
              }}
            >
              <Select
                value={this.state.selectedVal}
                onChange={event => this.sortPaths(event)}
              >
                {PATH_STATS_FILTER_TYPES.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.caption || ""}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>

            <TableCell
              style={{
                // eslint-disable-next-line no-magic-numbers
                width: 150
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!Object.keys(this.state.sortedPaths).length && (
            <TableRow>
              <TableCell colSpan={3}>
                Empty {Object.keys(this.state.sortedPaths)}
              </TableCell>
            </TableRow>
          )}
          {this.state.sortedPaths.map(path => (
            <TableRow hover key={path.pathKey}>
              <TableCell>{path.name}</TableCell>
              {!viewCreatedTab && (
                <TableCell>
                  {path.solutions !== undefined && path.totalActivities
                    ? `${path.solutions} of ${path.totalActivities}`
                    : path.owner === uid
                    ? "owner"
                    : "not joined"}
                </TableCell>
              )}

              <TableCell>{path[this.state.selectedVal]}</TableCell>
              <TableCell>
                <Link className={classes.link} to={`/paths/${path.pathKey}`}>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </Link>
                {viewCreatedTab && (
                  <IconButton onClick={() => this.onEditClick(path)}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(PathsTable);
