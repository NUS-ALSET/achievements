import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import Divider from "@material-ui/core/Divider";
// for highlight the selected tab in drawer with Menu
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
// list does not support selected link natively...
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

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
// TODO: isAdmin might not be serving any function anymore
import Security from "@material-ui/icons/Security";
// for Github icon
import GithubIcon from "./icons/GithubIcon";

import Typography from "@material-ui/core/Typography";

const linkStyle = {
  textDecoration: "none"
};

const AppDrawerElements = (onRequestClose, userId, isAdmin, location) => (
  <Fragment>
    <MenuList
      onClick={onRequestClose}
      subheader={
        <ListSubheader component="div">Explore Path Activities</ListSubheader>
      }
    >
      {/* enable Home highlight for homev2 homev3 */}
      <MenuItem
        component={Link}
        selected={
          "/" === location.pathname || !!location.pathname.match(/\/home/)
        }
        to="/"
      >
        <ListItem>
          <ListItemIcon>
            {"/" === location.pathname ||
            !!location.pathname.match(/\/home/) ? (
              <Whatshot style={{ fill: "red" }} />
            ) : (
              <Whatshot />
            )}
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </MenuItem>
      {/* the Paths tab will be highlighted if URL starts with "/paths" */}
      <MenuItem
        component={Link}
        selected={!!location.pathname.match(/\/paths/)}
        to="/paths"
      >
        <ListItem>
          <ListItemIcon>
            {location.pathname.match(/\/paths/) ? (
              <Explore style={{ fill: "red" }} />
            ) : (
              <Explore />
            )}
          </ListItemIcon>
          <ListItemText primary="Paths" />
        </ListItem>
      </MenuItem>
    </MenuList>

    <Divider />

    <MenuList
      onClick={onRequestClose}
      subheader={
        <ListSubheader component="div">Education in Classes</ListSubheader>
      }
    >
      {/* the Courses tab will be highlighted if URL starts with "/courses" */}
      <MenuItem
        component={Link}
        selected={!!location.pathname.match(/\/courses/)}
        to="/courses"
      >
        <ListItem>
          <ListItemIcon>
            {location.pathname.match(/\/courses/) ? (
              <Group style={{ fill: "red" }} />
            ) : (
              <Group />
            )}
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </MenuItem>
      {/* the Cohorts tab will be highlighted if URL starts with "/cohorts" */}
      <MenuItem
        component={Link}
        selected={!!location.pathname.match(/\/cohorts/)}
        to="/cohorts"
      >
        <ListItem>
          <ListItemIcon>
            {location.pathname.match(/\/cohorts/) ? (
              <Domain style={{ fill: "red" }} />
            ) : (
              <Domain />
            )}
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      </MenuItem>
    </MenuList>

    <Divider />

    <MenuList onClick={onRequestClose}>
      {/* the Profile tab will be highlighted if URL starts with "/profile" */}
      <MenuItem
        component={Link}
        selected={!!location.pathname.match(/\/profile/)}
        to={`/profile/${userId || "non-logged"}`}
      >
        <ListItem>
          <ListItemIcon>
            {location.pathname.match(/\/profile/) ? (
              <Mood style={{ fill: "red" }} />
            ) : (
              <Mood />
            )}
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </MenuItem>
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
    </MenuList>

    <Divider />

    <MenuList onClick={onRequestClose}>
      <MenuItem
        component={Link}
        selected={"/contribute" === location.pathname}
        to="/contribute"
      >
        <ListItem>
          <ListItemIcon>
            {"/contribute" === location.pathname ? (
              <GithubIcon style={{ fill: "red" }} />
            ) : (
              <GithubIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Contribute" />
        </ListItem>
      </MenuItem>
    </MenuList>
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: 230
      }}
    >
      <Typography align="center" gutterBottom variant="caption">
        &#169; 2018 NUS-ALSET
      </Typography>
    </div>
  </Fragment>
);

export default AppDrawerElements;
