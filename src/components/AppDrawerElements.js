import React from "react";
import { Link } from "react-router-dom";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import { MenuItem } from "material-ui/Menu";
import PropTypes from "prop-types";

import StarIcon from "material-ui-icons/Star";

export const DrawerMenuItems = onRequestClose => (
  <div>
    <Divider />
    <List onClick={onRequestClose}>
      <Link to="/home">
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Link to="/courses">
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List onClick={onRequestClose}>
      <Link to="/profile">
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </Link>
      <Link to="/about">
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </Link>
    </List>
  </div>
);

const AppBarMenuItems = ({ onClick, logout, login, isAuth }) => (
  <div>
    {isAuth ? (
      // Here should be <Fragment> from react 16, I guess
      <div>
        <Link to="/account">
          <MenuItem
            onClick={() => {
              onClick();
            }}
          >
            My account
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            onClick();
            logout();
          }}
        >
          Logout
        </MenuItem>
      </div>
    ) : (
      <MenuItem
        onClick={() => {
          onClick();
          login();
        }}
      >
        Login
      </MenuItem>
    )}
  </div>
);

AppBarMenuItems.propTypes = {
  onClick: PropTypes.func,
  logout: PropTypes.func,
  login: PropTypes.func,
  isAuth: PropTypes.bool
};

export const AppBarMenuItemsExport = AppBarMenuItems;
