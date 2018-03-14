/**
 * @file PathsList container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 05.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import List, { ListItem, ListItemText, ListSubheader } from "material-ui/List";

import OpenInNewIcon from "material-ui-icons/OpenInNew";
import { pathSelect } from "../../containers/Paths/actions";

class PathsList extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
    paths: PropTypes.object,
    selectedPathId: PropTypes.string
  };

  selectPath = pathId => this.props.dispatch(pathSelect(pathId));

  render() {
    const { header, paths, selectedPathId } = this.props;

    return (
      <List
        component="nav"
        subheader={<ListSubheader component="div">{header}</ListSubheader>}
      >
        <ListItem
          onClick={() => this.selectPath("")}
          style={
            (!selectedPathId && {
              background: "rgba(0, 0, 0, 0.14)"
            }) ||
            {}
          }
        >
          <ListItemText inset primary="Default path" />
          <Link to="/paths">
            <OpenInNewIcon />
          </Link>
        </ListItem>
        {Object.keys(paths || {})
          .map(id => ({ ...paths[id], id }))
          .map(path => (
            <ListItem
              key={path.id}
              onClick={() => this.selectPath(path.id)}
              style={
                (selectedPathId === path.id && {
                  background: "rgba(0, 0, 0, 0.14)"
                }) ||
                {}
              }
            >
              <ListItemText inset primary={path.name} />
              <Link to="/paths">
                <OpenInNewIcon />
              </Link>
            </ListItem>
          ))}
      </List>
    );
  }
}

export default PathsList;
