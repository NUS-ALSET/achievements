import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import { MenuItem } from "material-ui/Menu";
import PropTypes from "prop-types";
import Button from "material-ui/Button";

import StarIcon from "material-ui-icons/Star";

const linkStyle = {
  textDecoration: "none"
};

export const DrawerMenuItems = (onRequestClose, userId) => (
  <div>
    <Divider />
    <List onClick={onRequestClose}>
      <Link to="/home" style={linkStyle}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Link to="/courses" style={linkStyle}>
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
      <Link to="/cohorts" style={linkStyle}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      </Link>
      <Link to={`/profile/${userId}`} style={linkStyle}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </Link>
    </List>
  </div>
);

const AppBarMenuItems = ({ onClick, logout, login, isAuth }) => (
  <div>
    {isAuth ? (
      <Fragment>
        <Link to="/account" style={linkStyle}>
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
      </Fragment>
    ) : (
      <Button
        onClick={() => {
          onClick();
          login();
        }}
      >
        Login
      </Button>
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
