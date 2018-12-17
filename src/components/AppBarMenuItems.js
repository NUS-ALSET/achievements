import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
// and AppBar right-most icon
// import MenuList from '@material-ui/core/MenuList';
import MenuItem from "@material-ui/core/MenuItem";

import Button from "@material-ui/core/Button";

const linkStyle = {
  textDecoration: "none"
};

const AppBarMenuItems = ({ onClick, logout, login, isAuth }) => (
  <Fragment>
    {isAuth ? (
      <Fragment>
        <Link style={linkStyle} to={`/profile/${isAuth}`}>
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
  </Fragment>
);

AppBarMenuItems.propTypes = {
  onClick: PropTypes.func,
  logout: PropTypes.func,
  login: PropTypes.func,
  isAuth: PropTypes.any
};

export default AppBarMenuItems;
