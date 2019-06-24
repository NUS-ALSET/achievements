/**
 * @file Custom Analysis List Menu Component
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 22.02.18
 */

import * as React from "react";
import PropTypes from "prop-types";

// Import MaterialUI components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

class CustomAnalysisMenu extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    type: PropTypes.string,
    listType: PropTypes.string,
    listHandler: PropTypes.func,
    optionsToDisplay: PropTypes.array
  };
  state = {
    anchorEl: null,
    selectedIndex: 0
  };

  handleClickListItem = event => {
    this.setAnchorEl(event.currentTarget);
  };

  handleMenuItemClick = (event, index, optionsToDisplay) => {
    this.setSelectedIndex(index);
    this.props.listHandler(this.props.listType, optionsToDisplay[index]);
    this.setAnchorEl(null);
  };

  handleClose = () => {
    this.setAnchorEl(null);
  };

  setAnchorEl = anchorEl => {
    this.setState({ anchorEl: anchorEl });
  };

  setSelectedIndex = index => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { classes, type, listType, optionsToDisplay } = this.props;
    let textToDisplay = "";

    switch (listType) {
      case "Type":
        textToDisplay = type;
        break;
      case "Activity":
        textToDisplay = type === "Path" ? "Activity" : "Assignment";
        break;
      case "Analysis":
        textToDisplay = "Analysis";
        break;
      default:
        return <div>Unsupported List Type</div>;
    }
    return (
      <div>
        <div className={classes.activitySelection}>
          <List component="nav" aria-label="type variant selection">
            <ListItem
              button
              aria-haspopup="true"
              aria-controls="type-menu"
              aria-label={textToDisplay}
              onClick={this.handleClickListItem}
            >
              <ListItemText
                primary={textToDisplay}
                secondary={optionsToDisplay[this.state.selectedIndex]}
              />
            </ListItem>
          </List>
          <Menu
            id="type-menu"
            anchorEl={this.state.anchorEl}
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            {optionsToDisplay.map((option, index) => (
              //TODO : index can go out of range is type switched. Handle this case.
              //
              <MenuItem
                key={option}
                selected={index === this.state.selectedIndex}
                onClick={event =>
                  this.handleMenuItemClick(event, index, optionsToDisplay)
                }
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    );
  }
}

export default CustomAnalysisMenu;
