import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import { MenuItem } from "material-ui/Menu";
import PropTypes from "prop-types";
import Button from "material-ui/Button";

import StarIcon from "material-ui-icons/Star";
import { APP_SETTING } from "../achievementsApp/config";

const linkStyle = {
  textDecoration: "none"
};

export const DrawerMenuItems = (onRequestClose, userId) => (
  <div>
    <Divider />
    <List onClick={onRequestClose}>
      <Link to={`${APP_SETTING.basename}home`} style={linkStyle}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Link to={`${APP_SETTING.basename}courses`} style={linkStyle}>
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
      <Link to={`${APP_SETTING.basename}cohorts`} style={linkStyle}>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      </Link>
      <Link to={`${APP_SETTING.basename}profile/${userId}`} style={linkStyle}>
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
        <Link
          to={`${APP_SETTING.basename}account/${isAuth}`}
          style={linkStyle}
        >
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
