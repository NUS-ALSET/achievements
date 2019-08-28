/**
 * @file PathsTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";

import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

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

  onEditClick = pathInfo => this.props.pathDialogShow(pathInfo);

  render() {
    const { classes, viewCreatedTab, paths, uid } = this.props;

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
              Count
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
          {!Object.keys(paths).length && (
            <TableRow>
              <TableCell colSpan={3}>Empty</TableCell>
            </TableRow>
          )}
          {Object.keys(paths)
            .filter(id => paths[id])
            .map(id => ({ ...paths[id], id }))
            .map(path => (
              <TableRow hover key={path.id}>
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
                <TableCell>{path.attempts}</TableCell>
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
