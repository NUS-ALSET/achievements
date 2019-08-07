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
import Typography from "@material-ui/core/Typography";

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
// isAdmin for admin actions
import Security from "@material-ui/icons/Security";
// for Github icon
import GithubIcon from "./icons/GithubIcon";
// Journeys
import PollIcon from "@material-ui/icons/Poll";
// CustomAnalysis
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

const AppDrawerElements = (onRequestClose, userId, isAdmin, location) => (
  <Fragment>
    <MenuList
      onClick={onRequestClose}
      subheader={
        <ListSubheader component="div">Explore Path Activities</ListSubheader>
      }
    >
      {/* enable Home highlight for homev2 */}
      <MenuItem
        component={Link}
        selected={
          "/" === location.pathname || /^\/home/.test(location.pathname)
        }
        to="/"
      >
        <ListItem>
          <ListItemIcon>
            {"/" === location.pathname || /^\/home/.test(location.pathname) ? (
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
        selected={/^\/paths/.test(location.pathname)}
        to="/paths"
      >
        <ListItem>
          <ListItemIcon>
            {/^\/paths/.test(location.pathname) ? (
              <Explore style={{ fill: "red" }} />
            ) : (
              <Explore />
            )}
          </ListItemIcon>
          <ListItemText primary="Paths" />
        </ListItem>
      </MenuItem>
      <MenuItem
        component={Link}
        selected={/^\/mylearning/.test(location.pathname)}
        to="/mylearning"
      >
        <ListItem>
          <ListItemIcon>
            {/^\/mylearning/.test(location.pathname) ? (
              <PollIcon style={{ fill: "red" }} />
            ) : (
              <PollIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Learning" />
        </ListItem>
      </MenuItem>
      <MenuItem
        component={Link}
        selected={/^\/customanalysis/.test(location.pathname)}
        to="/customanalysis"
      >
        <ListItem>
          <ListItemIcon>
            {/^\/customanalysis/.test(location.pathname) ? (
              <TrendingUpIcon style={{ fill: "red" }} />
            ) : (
              <TrendingUpIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Custom Analysis" />
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
        selected={/^\/courses/.test(location.pathname)}
        to="/courses"
      >
        <ListItem>
          <ListItemIcon>
            {/^\/courses/.test(location.pathname) ? (
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
        selected={/^\/cohorts/.test(location.pathname)}
        to="/cohorts"
      >
        <ListItem>
          <ListItemIcon>
            {/^\/cohorts/.test(location.pathname) ? (
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
        selected={/^\/profile/.test(location.pathname)}
        to={`/profile/${userId || "non-logged"}`}
      >
        <ListItem>
          <ListItemIcon>
            {/^\/profile/.test(location.pathname) ? (
              <Mood style={{ fill: "red" }} />
            ) : (
              <Mood />
            )}
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </MenuItem>
      {isAdmin && (
        <MenuItem
          component={Link}
          selected={/^\/admin/.test(location.pathname)}
          to={"/admin"}
        >
          <ListItem>
            <ListItemIcon>
              {/^\/admin/.test(location.pathname) ? (
                <Security style={{ fill: "red" }} />
              ) : (
                <Security />
              )}
            </ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItem>
        </MenuItem>
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
        &#169; 2019 NUS-ALSET
      </Typography>
    </div>
  </Fragment>
);

export default AppDrawerElements;
