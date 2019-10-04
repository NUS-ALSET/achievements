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
    id: "unique_users",
    caption: "Unique users"
  },
  {
    id: "nps",
    caption: "NPS"
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

  getValues = obj => {
    let mapped = [];
    for (let key in obj) {
      if (obj[key]["id"]) {
        mapped.push(obj[key]);
      } else {
        let temp = obj[key];
        temp["id"] = key;
        mapped.push(temp);
      }
    }
    return mapped;
  };

  componentDidUpdate(prevProps, prevState) {
    if (isEmpty(prevState.sortedPaths) && !isEmpty(this.props.paths)) {
      let sorted = this.props.paths ? this.getValues(this.props.paths) : [];
      this.setState({ sortedPaths: sorted });
    } else if (
      !isEmpty(this.props.paths) &&
      prevProps.paths !== this.props.paths
    ) {
      this.setState({
        sortedPaths: this.props.paths ? this.getValues(this.props.paths) : []
      });
    }
  }

  onEditClick = pathInfo => this.props.pathDialogShow(pathInfo);

  sortPaths = key => {
    let publicPaths = { ...this.props.paths };
    let sorted = this.getValues(publicPaths).sort((a, b) =>
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

  componentDidMount() {
    this.setState({
      sortedPaths: this.props.paths ? this.getValues(this.props.paths) : []
    });
  }

  render() {
    const { classes, viewCreatedTab, uid } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
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
              <TableCell colSpan={4}>Empty</TableCell>
            </TableRow>
          )}
          {this.state.sortedPaths.map((path, index) => (
            <TableRow hover key={path.id}>
              <TableCell>{index + 1}</TableCell>
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
                <Link className={classes.link} to={`/paths/${path.id}`}>
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
