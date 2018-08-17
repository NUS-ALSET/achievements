import { Link } from "react-router-dom";

// for highlight the selected tab in drawer menu in the future
// import MenuList from '@material-ui/core/MenuList';
// import MenuItem from "@material-ui/core/MenuItem";

import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import React, { Fragment } from "react";

// material-ui icons in front of the drawer tabs
// Home
import Whatshot from "@material-ui/icons/Whatshot";
// Paths
import Explore from "@material-ui/icons/Explore";
// Courses
import Group from "@material-ui/icons/Group";
// Cohorts
import Domain from "@material-ui/icons/Domain";
// Profile
import Mood from "@material-ui/icons/Mood";
// isAdmin might not be serving any function anymore
import Security from "@material-ui/icons/Security";
// for Github icon
import GithubIcon from "./icons/GithubIcon";


const linkStyle = {
  textDecoration: "none"
};

const AppDrawerElements = (onRequestClose, userId, isAdmin) => (
  <Fragment>
    <List
      component="nav"
      subheader={<ListSubheader component="div">Explore Path Activities</ListSubheader>}
      onClick={onRequestClose}
    >
      <Link style={linkStyle} to={"/home"}>
        <ListItem button>
          <ListItemIcon>
            <Whatshot />
          </ListItemIcon>
          <ListItemText primary="Home" />
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
    <List
      component="nav"
      subheader={<ListSubheader component="div">Education in Classes</ListSubheader>}
      onClick={onRequestClose}
    >
      <Link style={linkStyle} to={"/courses"}>
        <ListItem button>
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </Link>
      <Link style={linkStyle} to={"/cohorts"}>
        <ListItem button>
          <ListItemIcon>
            <Domain />
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List
      component="nav"
      onClick={onRequestClose}
    >
      <Link style={linkStyle} to={`/profile/${userId || "non-logged"}`}>
        <ListItem button>
          <ListItemIcon>
            <Mood />
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
    <Divider />
    <List onClick={onRequestClose}>
      <Link style={linkStyle} to={"/"}>
        <ListItem button>
          <ListItemIcon>
            <GithubIcon />
          </ListItemIcon>
          <ListItemText primary="Contribute" />
        </ListItem>
      </Link>
    </List>
  </Fragment>
);

export default AppDrawerElements;
