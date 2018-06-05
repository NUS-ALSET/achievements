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
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import { pathDialogShow } from "../../containers/Paths/actions";
import { APP_SETTING } from "../../achievementsApp/config";

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class PathsTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currentUserId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    paths: PropTypes.object.isRequired
  };

  onEditClick = path => this.props.dispatch(pathDialogShow(path));

  render() {
    const { classes, paths } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Path name</TableCell>
            <TableCell
              style={{
                width: APP_SETTING.isSuggesting ? 150 : 360
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(paths)
            .filter(id => paths[id])
            .map(id => ({ ...paths[id], id }))
            .map(path => (
              <TableRow key={path.id}>
                <TableCell>{path.name}</TableCell>
                {APP_SETTING.isSuggesting ? (
                  <TableCell>
                    <Link className={classes.link} to={`/paths/${path.id}`}>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </Link>
                    <IconButton onClick={() => this.onEditClick(path)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Link className={classes.link} to={`/paths/${path.id}`}>
                      <Button variant="raised">Open</Button>
                    </Link>
                    <Button
                      className={classes.button}
                      onClick={() => this.onEditClick(path)}
                      variant="raised"
                    >
                      Edit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(PathsTable);
