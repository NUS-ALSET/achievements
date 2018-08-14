import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import React, { Fragment } from "react";

// material-ui icons in front of the drawer tabs
import Whatshot from "@material-ui/icons/Whatshot";
import School from "@material-ui/icons/School";
import Explore from "@material-ui/icons/Explore";
import Group from "@material-ui/icons/Group";
import Person from "@material-ui/icons/Person";
// isAdmin might not be serving any function anymore
import Security from "@material-ui/icons/Security";

const linkStyle = {
  textDecoration: "none"
};

export const DrawerMenuItems = (onRequestClose, userId, isAdmin) => (
  <div>
    <Divider />
    <List component="nav" onClick={onRequestClose}>
      <Link style={linkStyle} to={"/home"}>
        <ListItem button>
          <ListItemIcon>
            <Whatshot />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={"/courses"}>
        <ListItem button>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={"/paths"}>
        <ListItem button>
          <ListItemIcon>
            <Explore />
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
            <Group />
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={`/profile/${userId || "non-logged"}`}>
        <ListItem button>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </Link>
      {isAdmin && (
        <Link style={linkStyle} to={"/admin"}>
          <ListItem button>
            <ListItemIcon>
              <Security />
            </ListItemIcon>
            <ListItemText primary="Administration" />
          </ListItem>
        </Link>
      )}
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
