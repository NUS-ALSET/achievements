/**
 * @file Custom Analysis List Menu Component
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 30.06.18
 */

import * as React from "react";
import PropTypes from "prop-types";

import isEmpty from "lodash/isEmpty";

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
    menuContent: PropTypes.any
  };
  state = {
    anchorEl: null,
    selectedIndex: 0,
    selectedName: ""
  };

  handleClickListItem = event => {
    this.setAnchorEl(event.currentTarget);
  };

  handleMenuItemClick = (event, index, option) => {
    this.setSelectedIndex(index);
    this.setSelectedName(option.name);
    this.props.listHandler(this.props.listType, option);
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
  setSelectedName = name => {
    this.setState({ selectedName: name });
  };

  render() {
    const { classes, type, listType, menuContent } = this.props;
    let textToDisplay = "";
    let option = "";
    let optionsToDisplay = [{ name: "" }];

    switch (listType) {
      case "Type":
        textToDisplay = type;
        if (menuContent && !isEmpty(menuContent)) {
          Object.keys(menuContent).forEach(customAnalysisKey => {
            option = Object.assign(
              {
                id: customAnalysisKey
              },
              menuContent[customAnalysisKey]
            );
            optionsToDisplay.push(option);
          });
        }
        break;
      case "Activity":
        textToDisplay = type === "Path" ? "Activity" : "Assignment";
        optionsToDisplay = optionsToDisplay.concat(menuContent);
        break;
      case "Analysis":
        textToDisplay = "Analysis";
        if (menuContent && !isEmpty(menuContent)) {
          Object.keys(menuContent).forEach(customAnalysisKey => {
            option = Object.assign(
              {
                id: customAnalysisKey
              },
              menuContent[customAnalysisKey]
            );
            optionsToDisplay.push(option);
          });
        }
        break;
      case "Query":
        textToDisplay = "Log Type";
        optionsToDisplay = optionsToDisplay.concat(menuContent);
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
                secondary={this.state.selectedName}
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
                key={index}
                selected={index === this.state.selectedIndex}
                onClick={event =>
                  this.handleMenuItemClick(event, index, option)
                }
              >
                {(option && option.name) || ""}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    );
  }
}

export default CustomAnalysisMenu;
