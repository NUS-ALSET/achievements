import { Link } from "react-router-dom";
import { MenuItem } from "material-ui/Menu";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

import StarIcon from "material-ui-icons/Star";

const linkStyle = {
  textDecoration: "none"
};

export const DrawerMenuItems = (onRequestClose, userId) => (
  <div>
    <Divider />
    <List onClick={onRequestClose}>
      <Link style={linkStyle} to={"/home"}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={"/courses"}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={"/paths"}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Paths" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List onClick={onRequestClose}>
      <Link style={linkStyle} to={"/cohorts"}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={`/profile/${userId || "non-logged"}`}>
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
        <Link style={linkStyle} to={`/account/${isAuth}`}>
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
  isAuth: PropTypes.any
};

export const AppBarMenuItemsExport = AppBarMenuItems;
